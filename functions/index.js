const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const bodyParser = require('body-parser');

const app = express().use(bodyParser.json());

console.log(`running in ${process.env.NODE_ENV} mode`);

// for database
admin.initializeApp(functions.config().firebase);

if(process.env.NODE_ENV === 'dev') app.use(express.static('../src/videos'));


app.get((process.env.NODE_ENV === 'dev' ? 'apiai/nlp/:text' : '/:text'), (req, res) => {
  res.send(`hello there, ${req.params.text}`);
  const request = apiaiClient.textRequest(req.params.text, {
    sessionId: 'usesocketidhere',
  });
  
  request.on('response', (response) => {
    res.send(response.result);
  });
  
  request.on('error', (error) => {
    // console.log(error);
    res.send({ result: 'There was an error' });
  });
  
  request.end();
});

// For Dev:
// app.listen(8000, () => { console.log('listening on port 8000'); });



exports.api = functions.https.onRequest(app);