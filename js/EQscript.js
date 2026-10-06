//AudioMotionAnalyzer
import AudioMotionAnalyzer from "./audioMotion-analyzer.js";

let isConnected = false;


const buttons = document.querySelectorAll(".EQbutton");
const volumeSlider = document.getElementById("EQslider");

const audioMotion = new AudioMotionAnalyzer(document.getElementById("EQgui"));
const audioCtx = audioMotion.audioCtx;
const gainNode = audioCtx.createGain();
let sample;
let source;

function playback (buttonID) {
    sample = document.getElementById(`${buttonID}.mp3`);
    source = audioCtx.createMediaElementSource(sample);
    if (audioCtx.state === "suspended") {
        audioMotion.audioCtx.resume();
    }

    if (sample.paused) {
        if (!isConnected) {
            source = audioCtx.createMediaElementSource(sample);
            source.connect(gainNode);
            audioMotion.connectInput(gainNode);
            isConnected = true;
        }
        sample.play();
    } else {
        sample.pause();
        sample.currentTime = 0;
        audioCtx.suspend();
    }
}
function getPlayingAudioId() {
    const audioElements = Array.from(document.querySelectorAll('audio'));
    
    const playingAudio = audioElements.find(audio => !audio.paused);
    
    return playingAudio ? playingAudio.id : null;
}

const initializedSources = new Map();

async function play (buttonID) {
    const sample = document.getElementById(`${buttonID}.mp3`);

    if (!sample) return;

    let currentPlayingId = getPlayingAudioId();

    document.querySelectorAll('audio').forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });

    if (currentPlayingId === `${buttonID}.mp3` ) {
        sample.currentTime = 0;
        sample.pause();
    } else {
        sample.currentTime = 0;
        sample.play();

    }



    if (audioCtx.state === "suspended") {
        await audioCtx.resume();
    }

    if (!initializedSources.has(buttonID)) {
        const mediaSource = audioCtx.createMediaElementSource(sample);
        
        mediaSource.connect(gainNode);
        audioMotion.connectInput(gainNode); 
        
        initializedSources.set(buttonID, mediaSource);
    }

 
}

buttons.forEach(button => {
    button.addEventListener("click", (e) => {
        play(e.currentTarget.id);
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


