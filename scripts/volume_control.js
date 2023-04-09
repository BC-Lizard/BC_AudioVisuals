const initVolumeControl = () => {
    const gainNode = audioContext.createGain();

    audioSource.connect(gainNode).connect(audioContext.destination);

    const volumeControl = document.querySelector("#volume-control");

    volumeControl.addEventListener(
        "input",
        () => {
            gainNode.gain.value = volumeControl.value;
        },
        false
    );
}