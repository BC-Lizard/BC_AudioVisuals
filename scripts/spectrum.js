function playSpectrum() {
  // Define audio context and source
  audioSource = audioContext.createMediaElementSource(audioElement);

  // Define analyser node
  const analyserNode = audioContext.createAnalyser();
  analyserNode.fftSize = 2048;
  analyserNode.minDecibels = -100;
  analyserNode.maxDecibels = -30;
  analyserNode.smoothingTimeConstant = 0.8;

  // Connect audio source to analyser node and audio context destination
  audioSource.connect(analyserNode);
  analyserNode.connect(audioContext.destination);

  // Initialize bars array
  const bars = new Array(numBars);
  for (let i = 0; i < numBars; i++) {
    bars[i] = { height: 0 };
  }

  // Define update function
  function update() {
    // Request animation frame for continuous updating
    requestAnimationFrame(update);

    // Get frequency data from analyser node
    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserNode.getByteFrequencyData(dataArray);

    // Compute amplitude values for each bar
    const amplitudeStep = (maxFrequency - minFrequency) / numBars;
    const amplitudes = new Array(numBars);
    for (let i = 0; i < numBars; i++) {
      const minIndex = Math.floor(
        ((minFrequency + i * amplitudeStep) / audioContext.sampleRate) * bufferLength,
      );
      const maxIndex = Math.floor(
        ((minFrequency + (i + 1) * amplitudeStep) / audioContext.sampleRate) * bufferLength,
      );
      let sum = 0;
      for (let j = minIndex; j < maxIndex; j++) {
        sum += dataArray[j];
      }
      const amplitude = sum / (maxIndex - minIndex);
      amplitudes[i] = amplitude >= minAmplitude ? Math.pow(amplitude, logFactor) : 0;
    }

    // Apply exponential decay to bar heights
    for (let i = 0; i < numBars; i++) {
      if (amplitudes[i] < bars[i].height) {
        bars[i].height = Math.max(bars[i].height - decayRate * bars[i].height, amplitudes[i]);
      } else {
        bars[i].height = amplitudes[i];
      }
    }

    // Clear canvas and draw bars
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    const barWidth = canvas.width / numBars;
    const barSpacing = 10;
    for (let i = 0; i < numBars; i++) {
      const barHeight = 3 + (canvas.height * 0.5 * bars[i].height) / Math.pow(255, logFactor);
      if (i === 0) {
        ctx.fillRect(
          i * barWidth + barSpacing / 2,
          canvas.height - barHeight,
          barWidth - barSpacing,
          barHeight,
        );
      } else {
        ctx.fillRect(
          i * barWidth + barSpacing / 2,
          canvas.height - barHeight,
          barWidth - barSpacing,
          barHeight,
        );
      }
    }
  }

  // Start audio playback and visualizer update
  //audioElement.play();
  update();
}
