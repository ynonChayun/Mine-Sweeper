'use strict'

function manuallyPosition() {
    if (gGame.manuallyPos) return
    if (!gGame.isOn) return
    if (!gIsFirstClick) return
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