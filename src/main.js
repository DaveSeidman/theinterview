import './css/main.scss';

const speech = document.querySelector('.speech');
const intent = document.querySelector('.intent');
const myVideo = document.querySelector('.my-video > video');
const userVideo = document.querySelector('.user-video > video');
const constraints = { audio: true, video: { width: 720, height: 1280 } };
const intents = require('./intents.json');

let recognition;

const env = window.location.href.indexOf('localhost') > 0 ? 'dev' : 'prod';

const nlpURL = env === 'dev'
  ? 'http://localhost:5000/the-interview-app/us-central1/api/nlp'
  : 'https://us-central1-the-interview-app.cloudfunctions.net/api/nlp';


const getIntent = text => new Promise((resolve) => {
  intent.value = 'sending speech to api.ai for analysis';
  fetch(`${nlpURL}/${text}`)
    .then(response => response.json())
    .then((response) => {
      intent.value = response.action;
      resolve(response.action);
    });
});

getIntent('how are you today?').then(respondToUser);

const random = array => array[Math.floor(Math.random() * array.length)];

const playVideo = (video) => {
  myVideo.src = `videos/${video}.mp4`;
};

const respondToUser = (response) => {
  const userIntent = intents[response];

  if (!userIntent) return playVideo(intents.fallback);

  return playVideo(random(userIntent));
};

const startListening = (cameraReady) => {
  if (!cameraReady) { return console.log('coudnt get webcam'); }

  recognition = new webkitSpeechRecognition();
  recognition.onresult = (e) => {
    let text = '';
    for (let i = e.resultIndex; i < e.results.length; i += 1) {
      text += e.results[i][0].transcript;
    }
    speech.value = text;
    getIntent(text).then(respondToUser);
  };
  recognition.onend = () => {
    setTimeout(startListening(true), 250);
  };
  recognition.lang = 'en-US';
  recognition.start();
};

const getCamera = () => new Promise((resolve) => {
  navigator.mediaDevices.getUserMedia(constraints)
    .then((stream) => {
      userVideo.srcObject = stream;
      userVideo.onloadedmetadata = () => {
        userVideo.play();
        return resolve(true);
      };
    })
    .catch((err) => {
      console.log(`${err.name}: ${err.message}`);
      return resolve(false);
    });
});

getCamera().then(startListening);

const videoComplete = () => {
  console.log('video ended');
  playVideo('idle-1');
};

// playVideo('idle-1');
myVideo.addEventListener('ended', videoComplete);
