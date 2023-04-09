let visualizerMode = 'SPECTRUM';

// Get canvas element and its context
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

let mediaFileForPlayback = null;

// Define audio context and source
let audioContext = null;
let audioElement = null;


// initialize visualizer
// Set canvas width and height
canvas.width = window.innerWidth;
canvas.height = window.innerHeight * 0.95;

// Define frequency range to be displayed
var minFrequency = 0;
var maxFrequency = 8000;

// Define number of bars to be displayed
let numBars = 64;

// Define minimum threshold for amplitude values
let minAmplitude = 10;

// Define logarithmic scaling factor
let logFactor = 4;

// Define decay rate
let decayRate = 0.03;

// Define bar style
let barWidth = canvas.width / numBars;
let barSpacing = 10;
let barColor = '#fff';

if (visualizerMode === "SPECTRUM") {
    // Clear canvas and draw bars
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = barColor;

    for (let i = 0; i < numBars; i++) {
        const barHeight = 3;
        if (i == 0) {
            ctx.fillRect((i * barWidth) + (barSpacing/2), canvas.height - barHeight, barWidth - barSpacing, barHeight);
        } else {
            ctx.fillRect((i * barWidth) + (barSpacing/2), canvas.height - barHeight, barWidth - barSpacing, barHeight);
        }
    }
}

function initAudioContext() {
    audioContext = new AudioContext();
}