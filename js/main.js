'use strict'

//design mode
const SMILE = '😄'
const LOSE = '🤯'
const WINE = '🥳'
//cell design
const MINE = '💣'
const FLAG = '🚩'
const EMPTY = ''

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    isHint: false,
    safeCount: 0,
    isSevenBoom: false,
    manuallyPos: false,
    countManually: 0
}

var gLevel = {
    LEVEL: 0,
    SIZE: 4,
    MINES: 2,
    EMPTY: 14
}

//intervals
var gManuallyInterval
var gTimerInterval

var gHints = []
var gMinePoses = []

var gBoard = []
var gIsFirstClick
//popular elements
var gElPlayAgain = document.querySelector('.play-again')
var gElBtnManually = document.querySelector('.manually')

var gCountScore = 0
localStorage.clear

function init() {

    //rest the game details
    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
        isHint: false,
        safeCount: 0,
        isSevenBoom: false,
        manuallyPos: false,
        countManually: 0
    }
    gMinePoses = []
    gIsFirstClick = true
    //restart the dom
    gElBtnManually.innerText = 'manually position💣'
    gElPlayAgain.innerText = SMILE

    //began a new game
    gBoard = createBoard()
    renderBoard(gBoard)


    restHints()
}

//create the model
function createBoard() {
    var count = gLevel.SIZE
    var board = []

    for (var i = 0; i < count; i++) {
        board.push([])

        for (var j = 0; j < count; j++) {
            board[i].push(createCell())
        }
    }
    return board
}

//render the dom by model
function renderBoard(board) {


    var boardHTML = ''

    for (var i = 0; i < board.length; i++) {
        boardHTML += '\n <tr>'

        for (var j = 0; j < board[i].length; j++) {
            var cellId = getIdByLoc({ i, j })
            boardHTML += `\n\t <td class= "cell"
             onclick="cellClicked(event,this, ${i}, ${j})" 
             oncontextmenu ="cellMarked(event,this, ${i}, ${j})"
             id="${cellId}" ></td>`
        }
        boardHTML += '\n </tr>'

    }

    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = boardHTML
}

function cellClicked(event, elCell, i, j) {

    if (!gGame.isOn) return
    if (gBoard[i][j].isMarked) return

    if (gIsFirstClick) {
        createMines(i, j)
        setTimer()
    }

    var cell = gBoard[i][j]
    if (gGame.isHint) {
        showCell(cell, i, j)
        expandShown(i, j)
        gGame.isHint = false
        setTimeout(() => {
            gGame.isHint = false
            hideCells(i, j)
        }, 1000);
        return
    }

    if (cell.isMine) {
        showMines()
        gGame.isOn = false
        gElPlayAgain.innerText = LOSE

        clearTimer()
        return
    }

    if (cell.isShown) {
        return
    }

    showCell(cell, i, j)
    checkGameOver()
    if (!minesNegsCount(i, j)) expandShown(i, j)
}

function checkGameOver() {

    if (gGame.shownCount === gLevel.EMPTY && allMinesMarked()) {
        showMines()
        gGame.isOn = false
        clearTimer()
        gElPlayAgain.innerText = WINE
        setBestScore()
    }
}

function expandShown(rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {

            if (j < 0 || j >= gBoard[i].length) continue
            if (i === rowIdx && j === colIdx) continue

            var cell = gBoard[i][j]

            if (cell.isShown) continue

            showCell(cell, i, j)
            if (!minesNegsCount(i, j) && !gGame.isHint) expandShown(i, j)
        }
    }
}

function playAgain() {
    var elTimer = document.querySelector('.timer')
    elTimer.innerText = '0:0'
    clearTimer()
    init()
}

function showCell(cell, i, j) {

    if (!gGame.isHint) {
        cell.isShown = true
        gGame.shownCount++
    }

    var id = getIdByLoc({ i, j })
    var elCell = document.getElementById(id)
    elCell.classList.add('shown')
    if (gGame.isHint && cell.isMine) {
        elCell.innerText = MINE
        return
    }
    switch (cell.minesAroundCount) {
        case 1:
            elCell.classList.add('one')
            break
        case 2:
            elCell.classList.add('two')
            break
        case 3:
            elCell.classList.add('three')
            break
        case 4:
            elCell.classList.add('four')
            break
        case 5:
            elCell.classList.add('five')
            break
        case 6:
            elCell.classList.add('six')
            break
        case 7:
            elCell.classList.add('seven')
            break
        case 8:
            elCell.classList.add('eigth')
            break
    }
    elCell.innerText = (!cell.minesAroundCount) ? ' ' : cell.minesAroundCount
    checkGameOver()
}

function setTimer() {

    var seconds = 0
    var minutes = 0
    var elTimer = document.querySelector('.timer')

    gTimerInterval = setInterval(() => {
        gGame.secsPassed++
        console.log(gGame.secsPassed);
        seconds++
        if (seconds === 60) {
            seconds = 0
            minutes++
        }
        elTimer.innerText = minutes + ":" + seconds
    }, 1000);

}

function clearTimer() {
    clearInterval(gTimerInterval)
    localStorage.setItem(gCountScore++, gGame.secsPassed);

}

function setBestScore() {
    var elBestScore = document.querySelector('.score')
    var seconds = checkBestScore()

    var minutes = parseInt(seconds / 60)
    seconds = seconds - (minutes * 60)

    elBestScore.innerText = 'best score \n' + minutes + ":" + seconds
}

function checkBestScore() {
    var min = Infinity
    for (var item in localStorage) {
        var value = localStorage.getItem(localStorage.key(item))
        if (value < min) min = value
    }
    console.log('the min score is', min);
    return min
}



function manuallyPosition() {
    if (gGame.manuallyPos) return
    if (!gGame.isOn) return
    if(!gIsFirstClick)return
    gGame.manuallyPos = true

    var board = gBoard
    var boardHTML = ''

    for (var i = 0; i < board.length; i++) {
        boardHTML += '\n <tr>'

        for (var j = 0; j < board[i].length; j++) {
            boardHTML += `\n\t <td class= "cell mine-hover"
             onclick="createMine(${i}, ${j}, this)"
             ></td>`
        }
        boardHTML += '\n </tr>'
    }

    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = boardHTML
}


function createMine(i, j, elMine) {
    if (mineInclude(gMinePoses, { i, j })) {
        console.log('is also mine');
        return
    }
    if (gGame.countManually < gLevel.MINES) {
        gGame.countManually++
        gMinePoses.push({ i, j })
        elMine.innerText = MINE
    }

    if (gGame.countManually === gLevel.MINES) {
        clearClassMine()
        renderMines(gMinePoses)
        setMinesNegsCount()

        var seconds = 0
        var elManuallyBtn = document.querySelector('.manually')
        gGame.isOn = false

        gManuallyInterval = setInterval(() => {
            seconds++
            elManuallyBtn.innerText = 'start! \n more ' + seconds + ' seconds'
        }, 1000);

        setTimeout(() => {
            renderBoard(gBoard)
            elManuallyBtn.innerText = 'start!'
            clearInterval(gManuallyInterval)
            gGame.isOn = true
        }, 5000);

    }
}


function clearClassMine() {
    var cells = document.querySelectorAll('.cell')
    for (var i = 0; i < cells.length; i++) {
        cells[i].classList.remove('mine-hover')
    }
}
