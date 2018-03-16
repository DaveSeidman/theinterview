const apiai = require('apiai');

const apiaiClient = apiai('402cae09c92b4d228c90a026f090b97e');
const express = require('express');

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

