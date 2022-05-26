'use strict'

var beginnerCount = 0
var mediumCount = 0
var expertCount = 0

function setTimer() {

    var seconds = 0
    var minutes = 0
    var elTimer = document.querySelector('.timer')

    gTimerInterval = setInterval(() => {
        gGame.secsPassed++
        seconds++
        if (seconds === 60) {
            seconds = 0
            minutes++
        }
        elTimer.innerText = minutes + ":" + seconds
    }, 1000);

}

function setBestScore() {
    var elBestScore = document.querySelector('.score')
    var seconds = checkBestScore()

    var minutes = parseInt(seconds / 60)
    seconds = seconds - (minutes * 60)

    elBestScore.innerText = 'best score level ' + (gLevel.LEVEL ) + ' \n' + minutes + ":" + seconds
}

function checkBestScore() {
    var min = Infinity
    

    for (var i = 0; i < localStorage.length; i++) {
        var keyName = localStorage.key(i)
    var levelName = keyName.split('-')[0]
    switch (levelName) {
        case 'beginner':
            var level = 0
            break
        case 'medium':
            var level = 1
            break
        case 'expert':
            var level = 2
            break
    }

        var keyName = localStorage.key(i)
        var value = localStorage.getItem(keyName)
        if (value < min && level == gLevel.LEVEL) min = value
    }
    return min
}

function setScoreToStorage(){
    switch (gLevel.LEVEL) {
        case 0:
            var level = 'beginner' + '-' + beginnerCount++
            break
        case 1:
            var level = 'medium' + '-' + mediumCount++
            break
        case 2:
            var level = 'expert' + '-' + expertCount++
            break
    }
    localStorage.setItem(level, gGame.secsPassed);
}

function clearTimer() {
    clearInterval(gTimerInterval)
}

