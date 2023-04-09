const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// Create an instance of the AudioContext class
const audioContext = new AudioContext();

// Set canvas width and height
canvas.width = window.innerWidth;
canvas.height = window.innerHeight * 0.95;

// Define frequency range to be displayed
var minFrequency = 0;
var maxFrequency = 15000;

// Define number of bars to be displayed
let numBars = 64;

// Define minimum threshold for amplitude values
let minAmplitude = 0;

// Define logarithmic scaling factor
let logFactor = 3;

// Define decay rate
let decayRate = 0.07;

// Define bar style
let barWidth = canvas.width / numBars;
let barSpacing = 10;
let barColor = '#fff';

// Initialize bars array
const bars = new Array(numBars);
for (let i = 0; i < numBars; i++) {
  bars[i] = { height: 0 };
}
console.log(
  navigator.mediaDevices.getUserMedia({
    audio: { deviceId: '55e714de2e66a10d9d38acc95b047f09b48c359b08c3159fc9f179ed7b00c8ef' },
  }),
);
// Use getUserMedia to capture the audio stream from the computer's audio output
navigator.mediaDevices
  .getUserMedia({ audio: true })
  .then(stream => {
    // Create a MediaStreamAudioSourceNode from the captured audio stream
    const sourceNode = audioContext.createMediaStreamSource(stream);

    // Create an AnalyserNode to analyze the audio data
    const analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = 1024;

    // Connect the MediaStreamAudioSourceNode to the AnalyserNode
    sourceNode.connect(analyserNode);

    // Create a Uint8Array to hold the frequency data
    const frequencyData = new Uint8Array(analyserNode.frequencyBinCount);

    // Define the render function to render the spectrum visualizer
    const render = () => {
      // Calculate the frequency data using getByteFrequencyData
      analyserNode.getByteFrequencyData(frequencyData);

      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Compute amplitude values for each bar
      const amplitudeStep = (maxFrequency - minFrequency) / numBars;
      const amplitudes = new Array(numBars);
      for (let i = 0; i < numBars; i++) {
        const minIndex = Math.floor(
          ((minFrequency + i * amplitudeStep) / audioContext.sampleRate) *
            analyserNode.frequencyBinCount,
        );
        const maxIndex = Math.floor(
          ((minFrequency + (i + 1) * amplitudeStep) / audioContext.sampleRate) *
            analyserNode.frequencyBinCount,
        );
        let sum = 0;
        for (let j = minIndex; j < maxIndex; j++) {
          sum += frequencyData[j];
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

      // Render the spectrum visualizer
      const bandWidth = Math.floor(
        (frequencyData.length * maxFrequency) / audioContext.sampleRate / numBars,
      );
      let x = 0;
      for (let i = 0; i < numBars; i++) {
        let max = 0;
        for (let j = 0; j < bandWidth; j++) {
          const index = Math.floor(
            (i * bandWidth * frequencyData.length * maxFrequency) /
              audioContext.sampleRate /
              numBars,
          );
          max = Math.max(max, frequencyData[index + j]);
        }
        //const barHeight = 3 + (max * canvas.height / 255);
        const barHeight = 3 + (canvas.height * bars[i].height) / Math.pow(255, logFactor);
        ctx.fillStyle = barColor;
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
        x += bandWidth;
      }

      // Request the next frame to render
      requestAnimationFrame(render);
    };

    // Start rendering the spectrum visualizer
    render();
  })
  .catch(error => {
    console.error(error);
  });
