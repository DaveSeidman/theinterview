const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const apiai = require('apiai');

const app = express().use(bodyParser.json()).use(cors());
const apiaiClient = apiai('402cae09c92b4d228c90a026f090b97e');

console.log(`running in ${process.env.NODE_ENV} mode`);

admin.initializeApp(functions.config().firebase);

if(process.env.NODE_ENV === 'dev') app.use(express.static('../src/videos'));

app.get('/nlp/:text', (req, res) => {
  const request = apiaiClient.textRequest(req.params.text, { sessionId: 'usesocketidhere' });
  request.on('response', (response) => { res.send(response.result); });
  request.on('error', (error) => { res.send({ result: 'There was an error' }); });
  request.end();
});

exports.api = functions.https.onRequest(app);