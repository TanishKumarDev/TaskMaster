import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const TaskListPage = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const response = await axios.get('http://localhost:3000/api/tasks', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(response.data.tasks);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch tasks');
      }
    };
    fetchTasks();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-center text-gray-900 dark:text-white">TaskMaster Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">Manage your tasks here!</p>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {tasks.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300 text-center">No tasks found.</p>
        ) : (
          <div className="grid gap-4">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md"
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{task.title}</h2>
                <p className="text-gray-600 dark:text-gray-300">{task.description || 'No description'}</p>
                <p className="text-gray-600 dark:text-gray-300">Priority: {task.priority}</p>
                <p className="text-gray-600 dark:text-gray-300">Status: {task.status}</p>
                <p className="text-gray-600 dark:text-gray-300">
                  Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                </p>
                <div className="mt-4">
                  <Link
                    to={`/edit-task/${task._id}`}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskListPage;