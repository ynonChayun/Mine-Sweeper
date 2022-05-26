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
    LEVEL: 1,
    SIZE: 4,
    MINES: 2,
    EMPTY: 14
}

localStorage.clear()

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

    gLives = {
        countLives: 3,
        elLives: createLives()
    }
    resetLives()
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
        if (gLives.countLives > 0) {
            showMine(i, j)
            useLive()
            return
        }
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
        setScoreToStorage()
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
    
    
    if(cell.isMarked){
        cell.isMarked = false
        elCell.classList.remove('marked')
    }
    if (cell.isMine ) {
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



