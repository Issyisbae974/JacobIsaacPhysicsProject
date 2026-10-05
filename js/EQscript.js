//AudioMotionAnalyzer
import AudioMotionAnalyzer from "./audioMotion-analyzer.js";

let isConnected = false;
let sample;



const button = document.getElementById("Play/Pause")
const volumeSlider = document.getElementById("EQslider");

const audioMotion = new AudioMotionAnalyzer(document.getElementById("EQgui")),
    audioCtx = audioMotion.audioCtx,
    source = audioCtx.createMediaElementSource(sample),
    gainNode = audioCtx.createGain();




function playback () {
    if (audioCtx.state === "suspended") {
        audioMotion.audioCtx.resume();
    }

    if (sample.paused) {
        if (!isConnected) {
            audioMotion.connectInput(gainNode);
        }
        sample.play();

    } else {
        sample.pause();
        sample.currentTime = 0;
    }
}

function setVolume(value) {

    const numericValue = parseFloat(value) || 0;

    const volumePercentage = numericValue / 100;
    const logVolume = (Math.pow(volumePercentage, 2));

    if(audioMotion && gainNode) {
        gainNode.gain.value = logVolume;
    }

    volumeSlider.style.setProperty("--value", `${numericValue}%`)
}

function optionSet () {

    audioMotion.registerGradient( 'myGradient', {
    bgColor: '#ffffff',

    colorStops: [
        '#000000',
    ]
});

    audioMotion.setOptions({
        gradient: 'myGradient',
        mode: 10,
        channelLayout: 'single',
        fillAlpha: 0,
        linearAmplitude: true,
        linearBoost: 6,
        lineWidth: 2,
        maxFreq: 20000,
        minFreq: 20,
        frequencyScale: 'log',
        peakLine: false,
        showScaleX: true,
        showPeaks: false,
        weightingFilter: 'D',
        ansiBands: false,
        smoothing: 0.8,
    });
};

//Running the functions
optionSet();
setVolume(volumeSlider.value);
button.addEventListener("click", (e) => console.log(e.target.id));

volumeSlider.addEventListener('input', (e) => {
    setVolume(e.target.value);
});

source.connect(gainNode);
