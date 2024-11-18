const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const mongoose = require("mongoose");

admin.initializeApp();
const app = express();

const taskSchema = new mongoose.Schema({
  name: String,
  completed: Boolean,
});

const Task = mongoose.model("Task", taskSchema);

const connectDb = async () => {
  if (mongoose.connection.readyState >= 1) return;
  const uri = functions.config().mongodb.uri;
  return mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

app.use(express.json());

app.get("/tasks", async (req, res) => {
  await connectDb();
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({message: "Internal Server Error"});
  }
});

app.post("/tasks", async (req, res) => {
  await connectDb();
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({message: "Internal Server Error"});
  }
});

app.put("/tasks", async (req, res) => {
  await connectDb();
  try {
    const {id} = req.query;
    const task = await Task.findByIdAndUpdate(id, req.body, {new: true});
    res.status(200).json(task);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({message: "Internal Server Error"});
  }
});

app.delete("/tasks", async (req, res) => {
  await connectDb();
  try {
    const {id} = req.query;
    await Task.findByIdAndDelete(id);
    res.status(200).json({message: "Task deleted"});
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({message: "Internal Server Error"});
  }
});

exports.api = functions.https.onRequest(app);
