const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors()); // React ke liye CORS enable
app.use(express.json()); // JSON body parse

// ✅ MongoDB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/todoDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Error:", err));

// ✅ Task Schema & Model
const taskSchema = new mongoose.Schema({
  title: String,
  desc: String,
  complete: { type: Boolean, default: false },
});

const Task = mongoose.model("Task", taskSchema);

// ================== ROUTES ==================

// Get all tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// Add new task
app.post("/tasks", async (req, res) => {
  try {
    const { title, desc } = req.body;
    const newTask = new Task({ title, desc });
    await newTask.save();
    res.json(newTask);
  } catch (err) {
    res.status(500).json({ error: "Failed to add task" });
  }
});

// Mark complete
app.put("/tasks/:id/complete", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { complete: true },
      { new: true }
    );
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: "Failed to mark complete" });
  }
});

// Update (edit task)
app.put("/tasks/:id", async (req, res) => {
  try {
    const { title, desc } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, desc },
      { new: true }
    );
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: "Failed to update task" });
  }
});

// Delete task
app.delete("/tasks/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete task" });
  }
});

// ✅ Start server
app.listen(5000, () => console.log("🚀 Server running on port 5000"));
