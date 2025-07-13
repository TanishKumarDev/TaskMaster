import React from 'react';
import { updateTask, deleteTask } from '../api/taskApi';

const TaskCard = ({ task }) => {
  const handleDelete = async () => {
    try {
      await deleteTask(task._id);
      window.location.reload(); // Temporary refresh, later use state
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting task');
    }
  };

  const handleStatusChange = async (status) => {
    try {
      await updateTask(task._id, { status });
      window.location.reload(); // Temporary refresh
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating task');
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
      <h3 className="text-lg font-semibold">{task.title}</h3>
      <p className="text-gray-600">{task.description || 'No description'}</p>
      <p className="text-sm mt-2">
        <span className="font-bold">Priority:</span> {task.priority}
      </p>
      <p className="text-sm">
        <span className="font-bold">Status:</span> {task.status}
      </p>
      <p className="text-sm">
        <span className="font-bold">Due:</span>{' '}
        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
      </p>
      <div className="mt-4 flex space-x-2">
        <button
          onClick={() => handleStatusChange('completed')}
          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
        >
          Mark Complete
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;