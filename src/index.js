import React, { useState } from "react";
import ReactDOM from "react-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./styles.css";

function App() {
  // User login state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Task management state
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [shareWith, setShareWith] = useState("");

  // Tasks state with category included
  const [tasks, setTasks] = useState([]);

  // Task categories
  const categories = ["Not Yet Started", "In Progress", "Finished"];

  // Handle login, this is for testing the front end before connecting the backend
  const handleLogin = async (e) => {
    e.preventDefault();
    if (username === "test123" && password === "test123") {
      const fakeToken = "mock-jwt-token";
      localStorage.setItem("token", fakeToken);
      setIsLoggedIn(true);
    } else {
      alert("Invalid test credentials");
    }
  };

  /*const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://webapi-final-project.onrender.com",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();
      if (response.ok && data.token) {
        localStorage.setItem("token", data.token);
        setIsLoggedIn(true);
      } else {
        alert("Invalid credentials");
      }
    } catch (err) {
      alert("Login failed");
    }
  };*/

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  // Handle task creation
  const handleTaskSubmit = (e) => {
    e.preventDefault();
    const newTask = {
      id: Date.now().toString(), // unique ID for each task
      name: taskName,
      description,
      dueDate,
      priority,
      sharedWith: shareWith.split(",").map((user) => user.trim()),
      category: "Not Yet Started", // Default category for new tasks
    };
    setTasks([...tasks, newTask]);
    setTaskName("");
    setDescription("");
    setDueDate("");
    setPriority("Medium");
    setShareWith("");
  };

  // Handle task reorder (drag-and-drop)
  const handleOnDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) return; // Dropped outside of list

    // Reorder tasks by category
    const updatedTasks = [...tasks];
    const [removed] = updatedTasks.splice(source.index, 1);
    removed.category = destination.droppableId; // Update the task's category
    updatedTasks.splice(destination.index, 0, removed);

    setTasks(updatedTasks);
  };

  // Check if the task is overdue
  const isOverdue = (task) => {
    const today = new Date().toISOString().split("T")[0];
    return task.dueDate && task.dueDate < today;
  };

  // Frontend display
  return (
    <div className="text-center">
      <h2>Web API Final Project: Jessica Nguyen</h2>

      {!isLoggedIn ? (
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Log In</button>
        </form>
      ) : (
        <>
          <p>Welcome, {username}!</p>
          <button onClick={handleLogout}>Log Out</button>

          <h3>Create New Task</h3>
          <form onSubmit={handleTaskSubmit}>
            <input
              type="text"
              placeholder="Task Name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              required
            />
            <br />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <br />
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
            <br />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <br />
            <br />
            <input
              type="text"
              placeholder="Share with (comma-separated usernames)"
              value={shareWith}
              onChange={(e) => setShareWith(e.target.value)}
            />
            <br />
            <button type="submit">Add Task</button>
          </form>

          <h4>Task Categories</h4>
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <div className="task-columns">
              {categories.map((category) => (
                <Droppable key={category} droppableId={category}>
                  {(provided) => (
                    <div
                      className="task-column"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      <h4>{category}</h4>
                      <ul>
                        {tasks
                          .filter((task) => task.category === category)
                          .map((task, index) => (
                            <Draggable
                              key={task.id}
                              draggableId={task.id}
                              index={index}
                            >
                              {(provided) => (
                                <li
                                  className="task-item"
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <strong>{task.name}</strong> -{" "}
                                  {task.description} - Due: {task.dueDate} -{" "}
                                  Priority: {task.priority}
                                  {isOverdue(task) && (
                                    <span className="overdue-tag">
                                      ⚠ Overdue
                                    </span>
                                  )}
                                  <br />
                                  {/* Display shared users */}
                                  <span>
                                    <strong>Shared with:</strong>
                                    {task.sharedWith.length > 0
                                      ? task.sharedWith.join(", ")
                                      : "No one"}
                                  </span>
                                </li>
                              )}
                            </Draggable>
                          ))}
                        {provided.placeholder}
                      </ul>
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </DragDropContext>
        </>
      )}
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
