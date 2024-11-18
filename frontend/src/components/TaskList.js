import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';  // Import trash icon

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // State for error message

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/tasks`)
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => {
        console.error('Error fetching tasks:', error);
        setErrorMessage('Failed to load tasks. Please try again later.');
      });
  }, []);

  const addTask = () => {
    if (newTask.trim() === '') {
      setErrorMessage('Task cannot be empty.');  // Set error message
      return;
    }
    axios.post(`${process.env.REACT_APP_API_URL}/tasks`, { name: newTask, completed: false })
      .then((response) => {
        setTasks([...tasks, response.data]);
        setNewTask('');
        setErrorMessage('');  // Clear error message
      })
      .catch((error) => {
        console.error('Error adding task:', error);
        setErrorMessage('Failed to add task. Please try again later.');
      });
  };

  const deleteTask = (id) => {
    axios.delete(`${process.env.REACT_APP_API_URL}/tasks/${id}`)
      .then(() => {
        setTasks(tasks.filter(task => task._id !== id));
      })
      .catch((error) => {
        console.error('Error deleting task:', error);
        setErrorMessage('Failed to delete task. Please try again later.');
      });
  };

  const toggleTask = (id, completed) => {
    axios.put(`${process.env.REACT_APP_API_URL}/tasks/${id}`, { completed: !completed })
      .then((response) => {
        setTasks(tasks.map(task => task._id === id ? response.data : task));
      })
      .catch((error) => {
        console.error('Error updating task:', error);
        setErrorMessage('Failed to update task. Please try again later.');
      });
  };

  return (
    <div>
      <div className="form">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
        />
        <button className="add-task" onClick={addTask}>Add Task</button>
      </div>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}  {/* Display error message */}
      {tasks.length === 0 ? (
        <p>No tasks yet! Add some tasks to get started.</p>
      ) : (
        <ul>
          {tasks.map(task => (
            <li key={task._id}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task._id, task.completed)}
              />
              <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                {task.name}
              </span>
              <button onClick={() => deleteTask(task._id)}>
                <FaTrash />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;
