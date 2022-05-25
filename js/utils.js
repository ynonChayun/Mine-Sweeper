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

//count the mines negs
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



function randPosition() {
    var i = getRandomInt(0, gBoard.length - 1)
    var j = getRandomInt(0, gBoard[i].length - 1)
    return { i, j }
}

function mineInclude(mines, checkMine) {
    for (var mineIdx = 0; mineIdx < mines.length; mineIdx++) {
        if (mines[mineIdx].i === checkMine.i && mines[mineIdx].j === checkMine.j) return true
    }
    return false
}

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

//create cell to the model
function createCell() {
    return {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false
    }
}