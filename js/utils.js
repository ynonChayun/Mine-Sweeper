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
    if (level === gLevel.LEVEL) return
    // expert 30 % medium  39 % beginner 45%
    var elBoard = document.querySelector('.board')
    switch (level) {
        case 1:
            gLevel.SIZE = 4
            gLevel.MINES = 2
            gLevel.EMPTY = 14
            elBoard.style.marginLeft = 45 + '%'
            break;
        case 2:
            gLevel.SIZE = 8
            gLevel.MINES = 12
            gLevel.EMPTY = 52
            elBoard.style.marginLeft = 39 + '%'
            break
        case 3:
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

function hideCells(rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {

            if (j < 0 || j >= gBoard[i].length) continue

            var cell = gBoard[i][j]
            //check if the cell isnt show before the hint ,and hide
            if (cell.isShown) continue

            var id = getIdByLoc({ i, j })
            var elCell = document.getElementById(id)
            elCell.classList.remove('shown')
            elCell.innerText = ' '
        }
    }
}

function clickHint(elHint, idx) {
    for (var i = 0; i < gHints.length; i++) {
        if (gHints[i].idx === idx) {
            return
        }
    }
    gHints.push({ idx, element: elHint })
    elHint.src = "imgs/hint2.png"
    gGame.isHint = true
}

function clickSafe() {
    if (!gGame.isOn) return

    //stay only mines on the board
    if (gGame.shownCount === gLevel.EMPTY) return
    //over three clicks on safe
    if (gGame.safeCount === 3) return

    gGame.safeCount++

    var pos = randPosition()
    var cell = gBoard[pos.i][pos.j]

    while (cell.isMine || cell.isShown) {
        pos = randPosition()
        cell = gBoard[pos.i][pos.j]
    }

    if (gIsFirstClick) createMines(pos.i, pos.j)

    showCell(cell, pos.i, pos.j)

}

function restHints() {
    for (var i = 0; i < gHints.length; i++) {
        gHints[i].element.src = 'imgs/hint.png'

    }
    gHints = []
}