'use strict'

var gLives = {
    countLives: 3,
    elLives: [{ elLive: "", isOn: false }]
}

function useLive() {
  
    for (var i = 0; i < 3; i ++){
        if(!gLives.elLives[i].isOn){
            gLives.elLives[i].elLive.src = "imgs/heart1.png"
            gLives.elLives[i].isOn = true
            gLives.countLives--
            return
        }
    }

}

function createLives() {
    var lives = []
    for (var i = 0; i < 3; i++) {
        lives[i] = { elLive :document.querySelector(`.live${i}`), isOn :false}
    }
    return lives
}

function resetLives(){
    for (var i = 0; i < 3; i++) {
        gLives.elLives[i].elLive.src = "imgs/heart.png"
    }
}