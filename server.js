const apiai = require('apiai');

const apiaiClient = apiai('402cae09c92b4d228c90a026f090b97e');
const express = require('express');
const intents = require('./src/intents.json');
const fs = require('fs');
const chalk = require('chalk');

const app = express();

app.use(express.static('src/videos'));

app.get('/apiai/nlp/:text', (req, res) => {
  const request = apiaiClient.textRequest(req.params.text, {
    sessionId: 'usesocketidhere',
  });

  request.on('response', (response) => {
    res.send(response.result);
  });

  request.on('error', (error) => {
    console.log(error);
    res.send({ result: 'There was an error' });
  });

  request.end();
});

app.listen(8000, () => { console.log('listening on port 8000'); });

const videoCheck = () => {
  console.log(' ');
  console.log('verifying video files:');
  console.log('---------------------------------------');
  Object.keys(intents).forEach((intent) => {
    const videos = intents[intent];
    videos.forEach((video) => {
      const path = `./src/videos/${video}.mp4`;
      const exists = fs.existsSync(path);
      console.log(chalk[exists ? 'green' : 'red'](path, exists ? '✓' : 'x'));
      // console.log(video, fs.existsSync());
    });
  });
};

videoCheck();
