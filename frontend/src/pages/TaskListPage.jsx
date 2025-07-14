import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const TaskListPage = () => {
  const [tasks, setTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Map backend enums to display values
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

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const queryParams = new URLSearchParams();
        if (searchQuery) queryParams.append('query', searchQuery);
        if (filterStatus) queryParams.append('status', filterStatus);
        if (sortBy) queryParams.append('sort', sortBy);
        
        const url = searchQuery || filterStatus || sortBy
          ? `http://localhost:3000/api/tasks/search?${queryParams.toString()}`
          : 'http://localhost:3000/api/tasks';
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllTasks(response.data.tasks);
        setTasks(response.data.tasks);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch tasks');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, [navigate, searchQuery, filterStatus, sortBy]);

  const handleDelete = async (id) => {
    if (!id || id === 'undefined') {
      setError('Invalid task ID');
      return;
    }
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      await axios.delete(`http://localhost:3000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllTasks(allTasks.filter((task) => task._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSubTask = async (taskId, subTaskId) => {
    if (!taskId || taskId === 'undefined' || !subTaskId || subTaskId === 'undefined') {
      setError('Invalid task or sub-task ID');
      return;
    }
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      await axios.delete(`http://localhost:3000/api/tasks/${taskId}/subtasks/${subTaskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllTasks(
        allTasks.map((task) =>
          task._id === taskId
            ? { ...task, subTasks: task.subTasks.filter((subTask) => subTask._id !== subTaskId) }
            : task
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete sub-task');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-center text-gray-900 dark:text-white">TaskMaster Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">Manage your tasks here!</p>
        <div className="mb-6 flex gap-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks by title or description..."
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            disabled={isLoading}
            aria-label="Search tasks"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            disabled={isLoading}
            aria-label="Sort tasks"
          >
            <option value="">Sort By</option>
            <option value="priority">Priority</option>
            <option value="dueDate">Due Date</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            disabled={isLoading}
            aria-label="Filter by status"
          >
            <option value="">All Status</option>
            <option value="Todo">Todo</option>
            <option value="InProgress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {isLoading ? (
          <p className="text-gray-600 dark:text-gray-300 text-center">Loading tasks...</p>
        ) : tasks.length === 0 ? (
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
                <p className="text-gray-600 dark:text-gray-300">Priority: {priorityDisplay[task.priority]}</p>
                <p className="text-gray-600 dark:text-gray-300">Status: {statusDisplay[task.status]}</p>
                <p className="text-gray-600 dark:text-gray-300">
                  Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                </p>
                {task.subTasks && task.subTasks.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sub-Tasks</h3>
                    <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300">
                      {task.subTasks.map((subTask) => (
                        <li key={subTask._id} className="flex justify-between items-center">
                          <span>{subTask.title} - {statusDisplay[subTask.status]}</span>
                          <div className="flex gap-2">
                            <Link
                              to={`/edit-subtask/${task._id}/${subTask._id}`}
                              className="text-blue-500 hover:underline"
                              aria-label={`Edit sub-task ${subTask.title}`}
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDeleteSubTask(task._id, subTask._id)}
                              className="text-red-500 hover:underline"
                              disabled={isLoading}
                              aria-label={`Delete sub-task ${subTask.title}`}
                            >
                              Delete
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="mt-4 flex gap-4">
                  <Link
                    to={`/edit-task/${task._id}`}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    aria-label={`Edit task ${task.title}`}
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    disabled={isLoading}
                    aria-label={`Delete task ${task.title}`}
                  >
                    Delete
                  </button>
                  <Link
                    to={`/create-subtask/${task._id}`}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    aria-label={`Add sub-task to ${task.title}`}
                  >
                    Add Sub-Task
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