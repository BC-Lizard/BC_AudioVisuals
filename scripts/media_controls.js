// Add event listeners to control buttons
const playPauseButton = document.getElementById('play-pause');
document.addEventListener("keydown", (e) => {
    if (e.key === " ") {
        playToggle();
    } else if (e.key === "ArrowLeft") {
        stepBack();
    } else if (e.key === "ArrowRight") {
        stepForward();
    }
});

function playToggle() {    
    if (audioContext === null) {
        initAudioContext();
        playSpectrum();
    }
    if (audioElement.paused) {
        audioElement.play();
        playPauseButton.textContent = 'Pause';
    } else {
        audioElement.pause();
        playPauseButton.textContent = 'Play';
    }
}

function stepBack() {
    audioElement.currentTime -= 10;
    console.log("Step Backwards (add graphics over playback here)");
}

function stepForward() {
    audioElement.currentTime += 10;
    console.log("Step Forward (add graphics over playback here)");
}
