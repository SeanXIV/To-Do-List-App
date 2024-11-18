const functions = require("firebase-functions");
const tasks = require("./tasks");

exports.index = functions.https.onRequest((req, res) => {
  res.status(200).send("Backend is working!");
});

exports.api = tasks.api;
