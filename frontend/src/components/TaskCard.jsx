import React, { useState } from 'react';
import { updateTask, deleteTask } from '../api/taskApi';

const TaskCard = ({ task, onUpdate, isLoading }) => {
  const [error, setError] = useState('');

  const priorityDisplay = {
    Low: 'Low',
    Medium: 'Medium',
    High: 'High',
  };
  const statusDisplay = {
    Todo: 'Todo',
    InProgress: 'In Progress',
    Completed: 'Completed',
  };

  const handleDelete = async () => {
    if (!task?._id || task._id === 'undefined') {
      setError('Invalid task ID');
      return;
    }
    try {
      await deleteTask(task._id);
      onUpdate(task._id, null); // Notify parent to remove task
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting task');
    }
  };

  const handleStatusChange = async (status) => {
    if (!task?._id || task._id === 'undefined') {
      setError('Invalid task ID');
      return;
    }
    try {
      const updatedTask = await updateTask(task._id, { status });
      onUpdate(task._id, updatedTask); // Notify parent with updated task
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating task');
    }
  };

  if (!task || !task._id) return null;

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{task.title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{task.description || 'No description'}</p>
      <p className="text-sm mt-2">
        <span className="font-bold">Priority:</span> {priorityDisplay[task.priority] || 'Unknown'}
      </p>
      <p className="text-sm">
        <span className="font-bold">Status:</span> {statusDisplay[task.status] || 'Unknown'}
      </p>
      <p className="text-sm">
        <span className="font-bold">Due:</span>{' '}
        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
      </p>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <div className="mt-4 flex space-x-2">
        <button
          onClick={() => handleStatusChange('Completed')}
          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:opacity-50"
          disabled={isLoading || task.status === 'Completed'}
          aria-label={`Mark ${task.title} as completed`}
        >
          Mark Complete
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50"
          disabled={isLoading}
          aria-label={`Delete task ${task.title}`}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;