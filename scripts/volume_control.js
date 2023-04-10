const initVolumeControl = () => {
  const gainNode = audioContext.createGain();

  audioSource.connect(gainNode).connect(audioContext.destination);

  const volumeControl = document.querySelector('#volume-control');

  gainNode.gain.value = volumeControl.value;

  volumeControl.addEventListener(
    'input',
    () => {
      gainNode.gain.value = volumeControl.value;
    },
    false,
  );
};
