import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

let tasks = [];

// GET /task - Fetch all tasks with optional filter
app.get("/task", (req, res) => {
  try {
    const { filter } = req.query;
    const normalizedFilter = filter?.toLowerCase();
    let filteredTasks = tasks;

    if (normalizedFilter === "completed") {
      filteredTasks = tasks.filter((task) => task.completed);
    } else if (normalizedFilter === "pending") {
      filteredTasks = tasks.filter((task) => !task.completed);
    }

    res.status(200).json({ tasks: filteredTasks || [] });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error: error.message });
  }
});

// POST /task - Add new task
app.post("/task", (req, res) => {
  try {
    const { title } = req.body;
    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Task title is required" });
    }

    const newTask = {
      id: uuidv4(),
      title: title.trim(),
      completed: false,
    };
    tasks.push(newTask);
    res.status(201).json({ message: "Task added successfully", task: newTask });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error: error.message });
  }
});

// PUT /task/:id - Update a task
app.put("/task/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;

    const task = tasks.find((t) => t.id === id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (title !== undefined && title.trim() === "") {
      return res.status(400).json({ message: "Task title cannot be empty" });
    }
    if (completed !== undefined && typeof completed !== "boolean") {
      return res.status(400).json({ message: "Invalid value for completed" });
    }

    if (title !== undefined) task.title = title.trim();
    if (completed !== undefined) task.completed = completed;

    res.status(200).json({ message: "Task updated successfully", task });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error: error.message });
  }
});

// DELETE /task/:id - Delete a task
app.delete("/task/:id", (req, res) => {
  try {
    const { id } = req.params;

    const taskIndex = tasks.findIndex((t) => t.id === id);
    if (taskIndex === -1) {
      return res.status(404).json({ message: "Task not found" });
    }

    const [deletedTask] = tasks.splice(taskIndex, 1);
    res.status(200).json({ message: "Task deleted successfully", task: deletedTask });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
