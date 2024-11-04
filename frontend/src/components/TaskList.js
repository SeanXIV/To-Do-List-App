import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';  // Import trash icon

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    axios.get('/api/tasks').then((response) => {
      setTasks(response.data);
    });
  }, []);

  const addTask = () => {
    axios.post('/api/tasks', { name: newTask, completed: false }).then((response) => {
      setTasks([...tasks, response.data]);
      setNewTask('');
    });
  };

  const deleteTask = (id) => {
    axios.delete(`/api/tasks/${id}`).then(() => {
      setTasks(tasks.filter(task => task._id !== id));
    });
  };

  const toggleTask = (id, completed) => {
    axios.put(`/api/tasks/${id}`, { completed: !completed }).then((response) => {
      setTasks(tasks.map(task => task._id === id ? response.data : task));
    });
  };

  return (
    <div>
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Add a new task..."
      />
      <button onClick={addTask}>Add Task</button>
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
    </div>
  );
};

export default TaskList;
