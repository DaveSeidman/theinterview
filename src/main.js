import './css/main.scss';

const input = document.querySelector('.text');
const sendBtn = document.querySelector('.send');
const listen = document.querySelector('.listen');
const result = document.querySelector('.result');

let recognition;

const sendText = () => {
  result.value = 'loading...';
  fetch(`/apiai/nlp/${input.value}`)
    .then(response => response.json())
    .then((response) => {
      console.log('response', response);
      result.value = response.action;
    });
};

const updateRec = () => {
  listen.innerHTML = recognition ? 'Stop' : 'Speak';
};

const setInput = (text) => {
  input.value = text;
  sendText();
};

const stopRecognition = () => {
  if (recognition) {
    recognition.stop();
    recognition = null;
  }
  updateRec();
};

const startRecognition = () => {
  recognition = new webkitSpeechRecognition();
  recognition.onstart = () => {
    updateRec();
  };
  recognition.onresult = (event) => {
    let text = '';
    for (let i = event.resultIndex; i < event.results.length; i += 1) {
      text += event.results[i][0].transcript;
    }

    setInput(text);
    stopRecognition();
  };
  recognition.onend = () => {
    stopRecognition();
  };
  recognition.lang = 'en-US';
  recognition.start();
};

const toggleListen = () => {
  if (recognition) {
    stopRecognition();
  } else {
    startRecognition();
  }
};

sendBtn.addEventListener('click', sendText);
listen.addEventListener('click', toggleListen);
input.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendText(); });
