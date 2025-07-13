import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EditSubTaskPage = () => {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('todo');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { taskId, subTaskId } = useParams();

  useEffect(() => {
    const fetchSubTask = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const response = await axios.get(
          `http://localhost:3000/api/tasks/${taskId}/subtasks/${subTaskId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const subTask = response.data;
        setTitle(subTask.title);
        setStatus(subTask.status);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch sub-task');
      }
    };
    fetchSubTask();
  }, [taskId, subTaskId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      await axios.put(
        `http://localhost:3000/api/tasks/${taskId}/subtasks/${subTaskId}`,
        { title, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/tasks');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update sub-task');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold mb-4 text-center text-gray-900 dark:text-white">Edit Sub-Task</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">Update your sub-task details!</p>
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
              <option value="todo">Todo</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Update Sub-Task
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditSubTaskPage;