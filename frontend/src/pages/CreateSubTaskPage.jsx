import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addSubTask } from '../api/taskApi';

const CreateSubTaskPage = () => {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('Todo');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { taskId } = useParams();

  // Validate taskId on mount
  useEffect(() => {
    if (!taskId || taskId === 'undefined') {
      setError('Invalid task ID');
      navigate('/tasks');
    }
  }, [taskId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      await addSubTask(taskId, { title, status });
      navigate('/tasks');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create sub-task');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold mb-4 text-center text-gray-900 dark:text-white">Create Sub-Task</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">Add a sub-task to your task!</p>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Sub-Task Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            >
              <option value="Todo">Todo</option>
              <option value="InProgress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            disabled={!taskId || taskId === 'undefined'}
          >
            Create Sub-Task
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateSubTaskPage;