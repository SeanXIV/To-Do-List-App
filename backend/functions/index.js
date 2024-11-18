const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Add CORS support

// Initialize Firebase Admin and Express
admin.initializeApp();
const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json());

// MongoDB Setup
const taskSchema = new mongoose.Schema({
  name: String,
  completed: Boolean,
});

const Task = mongoose.model("Task", taskSchema);

const connectDb = async () => {
  if (mongoose.connection.readyState >= 1) return;
  try {
    await mongoose.connect(functions.config().mongodb.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

// Root endpoint to check if backend is working
app.get("/", async (req, res) => {
  try {
    await connectDb();
    res.status(200).send("Backend is working and connected to MongoDB!");
  } catch (error) {
    res.status(500).send("Error connecting to backend: " + error.message);
  }
});

// Task Routes
app.get("/tasks", async (req, res) => {
  try {
    await connectDb();
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({
      message: "Internal Server Error", error: error.message});
  }
});

app.post("/tasks", async (req, res) => {
  try {
    await connectDb();
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({
      message: "Internal Server Error", error: error.message});
  }
});

app.put("/tasks/:id", async (req, res) => {
  try {
    await connectDb();
    const {id} = req.params;
    const task = await Task.findByIdAndUpdate(id, req.body, {new: true});
    if (!task) {
      return res.status(404).json({message: "Task not found"});
    }
    res.status(200).json(task);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({
      message: "Internal Server Error", error: error.message});
  }
});

app.delete("/tasks/:id", async (req, res) => {
  try {
    await connectDb();
    const {id} = req.params;
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return res.status(404).json({message: "Task not found"});
    }
    res.status(200).json({message: "Task deleted"});
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({
      message: "Internal Server Error", error: error.message});
  }
});

// Export the Express app as a Firebase Function with specific configuration
exports.api = functions
    .runWith({
      timeoutSeconds: 300,
      memory: "256MB",
    })
    .https
    .onRequest(app);
