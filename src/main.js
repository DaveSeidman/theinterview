import './css/main.scss';

const input = document.querySelector('.text');
const result = document.querySelector('.result');
const userVideo = document.querySelector('.user-video');
const constraints = { audio: true, video: { width: 720, height: 1280 } };
let recognition;

const sendText = (text) => {
  result.value = 'sending text to api.ai';
  fetch(`/apiai/nlp/${text}`)
    .then(response => response.json())
    .then((response) => {
      result.value = response.action;
    });
};

const startRecognition = (cameraReady) => {
  if(!cameraReady) 
    return console.log('coudnt get webcam');
    
  recognition = new webkitSpeechRecognition();
  recognition.onresult = (e) => {
    let text = '';
    for (let i = e.resultIndex; i < e.results.length; i += 1) {
      text += e.results[i][0].transcript;
    }
    input.value = text;
    sendText(text);
  };
  recognition.onend = () => {
      setTimeout(startRecognition(true), 500);
  };
  recognition.lang = 'en-US';
  recognition.start();
}

const getCamera = () => {
  return new Promise((resolve) => {
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
}

getCamera().then(startRecognition);