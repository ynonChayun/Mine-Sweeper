'use strict'

const SMILE = '😄'
const LOSE = '🤯'
const WINE = '🥳'

const MINE = '💣'
const FLAG = '🚩'
const EMPTY = ''

var gSecondsInterval

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

var gLevel = {
    SIZE: 10,
    MINES: 20
}


var gMinePoses = []
var gBoard = []
var gIsFirstClick

var gElPlayAgain = document.querySelector('.play-again')


function init() {
    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    }

    gElPlayAgain.innerText = SMILE
    gIsFirstClick = true

    gBoard = createBoard()
    renderBoard(gBoard)

    clearInterval(gSecondsInterval)
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

function setTimer() {

    var seconds = 0
    var minutes = 0
    var elTimer = document.querySelector('.time')

    gSecondsInterval = setInterval(() => {
        elTimer.innerText = seconds + ':' + minutes
        seconds++
        if (seconds = 59){
            minutes++
            seconds = 0
        }
    }, 1000);

}

function cellClicked(event, elCell, i, j) {

    if (!gGame.isOn) return
    if (gIsFirstClick) {
        gIsFirstClick = false

        //Creates an array of mines and render them on the board randomly
        gMinePoses = getMinePoses(i, j)
        renderMines(gMinePoses)

        //update minesAroundCount all of cells
        setMinesNegsCount()
        setTimer()
    }

    var cell = gBoard[i][j]

    if (cell.isMine) {
        showMines()
        gGame.isOn = false
        gElPlayAgain.innerText = LOSE

        clearInterval(gSecondsInterval)
        return
    }

    if (cell.isShown) {
        return
    }

    cell.isShown = true
    //Checking if he has no mine neighbors, and show them accordingly
    if (!minesNegsCount(i, j)) expandShown(i, j)

    gGame.shownCount++
    checkGameOver()
    elCell.innerText = cell.minesAroundCount
}

function checkGameOver() {
    var count = gLevel.SIZE ** 2
    count -= gLevel.MINES

    if (gGame.shownCount === count) {
        showMines()
        gGame.isOn = false
        clearInterval(gSecondsInterval)
        gElPlayAgain.innerText = WINE
    }
}

function showMines() {
    for (var i = 0; i < gMinePoses.length; i++) {
        var id = getIdByLoc(gMinePoses[i])
        var elMine = document.getElementById(id)
        elMine.innerText = MINE
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

            cell.isShown = true
            gGame.shownCount++
            if (!minesNegsCount(i, j)) expandShown( i, j)
            var id = getIdByLoc({ i, j })
            var elCell = document.getElementById(id)
            elCell.innerText = cell.minesAroundCount
        }
    }
}

function playAgain() {
    var elTimer = document.querySelector('.time')
    elTimer.innerText = '0:0'
    init()
}

//set on the empty cells the count of mine negs
function setMinesNegsCount() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            var cell = gBoard[i][j]
            if (cell.isMine) continue

            cell.minesAroundCount = minesNegsCount(i, j)
        }
    }
}

function cellMarked(e, elCell, i, j) {
    e.preventDefault();
    if (!gGame.isOn) return

    var cell = gBoard[i][j]

    if (cell.isShown) return
    if (cell.isMarked) {
        elCell.innerText = EMPTY
        cell.isMarked = false
        return
    }

    elCell.innerText = FLAG
    cell.isMarked = true

}

function renderMines(minePoses) {

    for (var rowIdx = 0; rowIdx < minePoses.length; rowIdx++) {
        var mine = minePoses[rowIdx]
        var cell = gBoard[mine.i][mine.j]
        cell.isMine = true
    }
}
