'use strict'

function clickHint(elHint, idx) {
    //check if the hint availible
    for (var i = 0; i < gHints.length; i++) {
        if (gHints[i].idx === idx) {
            return
        }
    }
    gHints.push({ idx, element: elHint })
    elHint.src = "imgs/hint2.png"
    gGame.isHint = true
}

function restHints() {
    for (var i = 0; i < gHints.length; i++) {
        gHints[i].element.src = 'imgs/hint.png'

    }
    gHints = []
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
