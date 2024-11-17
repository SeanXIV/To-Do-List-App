const functions = require('firebase-functions');

exports.index = functions.https.onRequest((req, res) => {
  res.status(200).send('Backend is working!');
});
