'use strict'

//return array with mines random positions
function getMinePoses(i, j) {
    var minePoses = []

    for (var mineCount = 0; mineCount < gLevel.MINES; mineCount++) {
        var randPos = randPosition()
        while (i === randPos.i && j === randPos.j || mineInclude(minePoses, randPos)) {
            randPos = randPosition()
        }
        minePoses.push(randPos)
    }
    return minePoses
}

//Checks if the mine is in the array
function mineInclude(mines, checkMine) {
    for (var mineIdx = 0; mineIdx < mines.length; mineIdx++) {
        if (mines[mineIdx].i === checkMine.i && mines[mineIdx].j === checkMine.j) return true
    }
    return false
}

//count the mines negs of cell
function minesNegsCount(rowIdx, colIdx) {
    var count = 0

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue

            if (i === rowIdx && j === colIdx) continue

            if (gBoard[i][j].isMine) count++
            // console.log(rowIdx, colIdx, count);
        }
    }
    return count
}

//render the mines on menu
function renderMines(minePoses) {

    for (var rowIdx = 0; rowIdx < minePoses.length; rowIdx++) {
        var mine = minePoses[rowIdx]
        var cell = gBoard[mine.i][mine.j]
        cell.isMine = true
    }
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

function showMines() {
    for (var i = 0; i < gMinePoses.length; i++) {
        var id = getIdByLoc(gMinePoses[i])
        var elMine = document.getElementById(id)
        elMine.innerText = MINE
    }
}

function showMine(i, j) {
    var id = getIdByLoc({ i, j })
    var elMine = document.getElementById(id)
    elMine.innerText = MINE

    gElPlayAgain.innerText = LOSE

    setTimeout(() => {
        gElPlayAgain.innerText = SMILE
        elMine.innerText = ' '
    }, 1200);
    setTimeout(() => {
        if (gBoard[i][j].isMarked && gGame.isOn) elMine.innerText = FLAG
    }, 1200);
}

function allMinesMarked() {
    for (var i = 0; i < gMinePoses.length; i++) {
        var pos = gMinePoses[i]
        if (!gBoard[pos.i][pos.j].isMarked) return false
    }
    return true
}

function sevenBoomPos() {
    gGame.isSevenBoom = true
    var minePoses = []

    var goOn = true
    var countCells = 0

    for (var i = 0; i < gBoard.length; i++) {

        for (var j = 0; j < gBoard[i].length && goOn; j++) {
            countCells++
            if (countCells % 7 === 0) {
                minePoses.push({ i, j })
                if (minePoses.length === gLevel.MINES) goOn = false
            }
        }
    }
    return minePoses
}

function createMines(i, j) {
    gIsFirstClick = false

    if (gGame.isSevenBoom) {
        gMinePoses = sevenBoomPos()

    } else if (gGame.manuallyPos) {
    } else {
        gMinePoses = getMinePoses(i, j)
    }

    renderMines(gMinePoses)

    setMinesNegsCount()
}

function sevenBoom() {
    if (!gIsFirstClick) return
    gGame.isSevenBoom = true
}


