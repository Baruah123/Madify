import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css"; // Add this for updated styles

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("all");

  const API_URL = "http://localhost:5000/task";

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_URL}?filter=${filter}`);
      setTasks(response.data.tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const addTask = async () => {
    if (!newTask.trim()) {
      alert("Task title cannot be empty");
      return;
    }
    try {
      await axios.post(API_URL, { title: newTask });
      setNewTask("");
      fetchTasks();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const toggleTaskCompletion = async (id, completed) => {
    try {
      await axios.put(`${API_URL}/${id}`, { completed: !completed });
      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="app-container">
      <div className="todo-wrapper">
        <h1 className="todo-title">My To-Do List</h1>

        {/* Features Section */}
        <section className="features">
          <h2 className="features-title">App Features</h2>
          <ul className="features-list">
            <li>✔️ Add, delete, and update tasks</li>
            <li>✔️ Mark tasks as completed</li>
            <li>✔️ Filter tasks by completion status</li>
            <li>✔️ Clean and responsive UI</li>
          </ul>
        </section>

        {/* Input Section */}
        <div className="task-input-section">
          <input
            type="text"
            className="task-input"
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button className="add-task-button" onClick={addTask}>
            Add Task
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="filter-buttons">
          {["all", "completed", "pending"].map((type) => (
            <button
              key={type}
              className={`filter-button ${filter === type ? "active-filter" : ""}`}
              onClick={() => setFilter(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Task List */}
        <ul className="task-list">
          {tasks.map((task) => (
            <li className="task-item" key={task.id}>
              <div className="task-details">
                <input
                  type="checkbox"
                  className="task-checkbox"
                  checked={task.completed}
                  onChange={() => toggleTaskCompletion(task.id, task.completed)}
                />
                <span className={`task-title ${task.completed ? "completed-task" : ""}`}>
                  {task.title}
                </span>
              </div>
              <button className="delete-task-button" onClick={() => deleteTask(task.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
