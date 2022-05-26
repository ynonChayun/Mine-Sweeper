'use strict'

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getLocById(id) {
    var i = parseInt(id.split('-')[0])
    var j = parseInt(id.split('-')[1])

    return { i, j }
}

function getIdByLoc(loc) {
    return loc.i + '-' + loc.j
}

function randPosition() {
    var i = getRandomInt(0, gBoard.length - 1)
    var j = getRandomInt(0, gBoard[i].length - 1)
    return { i, j }
}

//create cell to the model
function createCell() {
    return {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
    }
}

function setLevel(level) {
    if (level == gLevel.LEVEL) return
    var elBoard = document.querySelector('.board')
    console.log(level);
    switch (level) {
        case 1:
            gLevel.LEVEL = 1
            gLevel.SIZE = 4
            gLevel.MINES = 2
            gLevel.EMPTY = 14
            elBoard.style.marginLeft = 45 + '%'
            break;
        case 2:
            gLevel.LEVEL = 2
            gLevel.SIZE = 8
            gLevel.MINES = 12
            gLevel.EMPTY = 52
            elBoard.style.marginLeft = 39 + '%'
            break
        case 3:
            gLevel.LEVEL = 3
            gLevel.SIZE = 12
            gLevel.MINES = 30
            gLevel.EMPTY = 114
            elBoard.style.marginLeft = 33 + '%'
            break
    }
    init()
}

//un/marker cell
function cellMarked(e, elCell, i, j) {
    e.preventDefault();
    if (!gGame.isOn) return

    var cell = gBoard[i][j]

    if (cell.isShown) return
    if (cell.isMarked) {
        elCell.classList.remove('marked')
        elCell.innerText = EMPTY
        cell.isMarked = false
        return
    }

    elCell.classList.add('marked')
    elCell.innerText = FLAG
    cell.isMarked = true
    checkGameOver()
}


