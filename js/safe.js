'use strict'

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
