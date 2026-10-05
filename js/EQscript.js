//AudioMotionAnalyzer
import AudioMotionAnalyzer from "./audioMotion-analyzer.js";

let isConnected = false;
let sample;

const buttons = document.querySelectorAll(".EQbutton");
const volumeSlider = document.getElementById("EQslider");

const audioMotion = new AudioMotionAnalyzer(document.getElementById("EQgui")),
    audioCtx = audioMotion.audioCtx;

let source;
let gainNode;




function playback (buttonID) {
    sample = document.getElementById(`${buttonID}.mp3`);
    audioMotion.connectInput(gainNode);
    if (audioCtx.state === "suspended") {
        audioMotion.audioCtx.resume();
    }

    if (sample.paused) {
        if (!isConnected) {
            source = audioCtx.createMediaElementSource(sample);
            source.connect(gainNode);
            isConnected = true;
        }
        sample.play();

    } else {
        sample.pause();
        sample.currentTime = 0;
        audioCtx.suspend();
    }
}


buttons.forEach(button => {
    button.addEventListener("click", (e) => {
        playback(e.currentTarget.id);
    });
});

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

function test(value) {
    console.log(value);
}

//Running the functions
optionSet();
setVolume(volumeSlider.value);

volumeSlider.addEventListener('input', (e) => {
    setVolume(e.target.value);
});


