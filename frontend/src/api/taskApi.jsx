import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:3000/api';


// Set JWT token
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

// Auth APIs
export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/auth/login`, { email, password });
  setAuthToken(response.data.token);
  return response.data;
};

export const signup = async (name, email, password) => {
  const response = await axios.post(`${API_URL}/auth/register`, { name, email, password });
  setAuthToken(response.data.token);
  return response.data;
};

// Task APIs
export const getTasks = async (params = {}) => {
  const response = await axios.get(`${API_URL}/tasks`, { params });
  return response.data;
};

export const createTask = async (taskData) => {
  const response = await axios.post(`${API_URL}/tasks`, taskData);
  return response.data;
};

export const updateTask = async (id, taskData) => {
  if (!id || id === 'undefined') {
    throw new Error('Invalid task ID');
  }
  const response = await axios.put(`${API_URL}/tasks/${id}`, taskData);
  return response.data;
};

export const deleteTask = async (id) => {
  if (!id || id === 'undefined') {
    throw new Error('Invalid task ID');
  }
  const response = await axios.delete(`${API_URL}/tasks/${id}`);
  return response.data;
};

export const searchTasks = async (query) => {
  if (!query || query.trim() === '') {
    throw new Error('Search query is required');
  }
  const response = await axios.get(`${API_URL}/tasks/search`, { params: { query } });
  return response.data;
};

// Sub-Task APIs
export const getSubTask = async (taskId, subTaskId) => {
  if (!taskId || taskId === 'undefined' || !subTaskId || subTaskId === 'undefined') {
    throw new Error('Invalid task or sub-task ID');
  }
  const response = await axios.get(`${API_URL}/tasks/${taskId}/subtasks/${subTaskId}`);
  return response.data;
};

export const addSubTask = async (taskId, subTaskData) => {
  if (!taskId || taskId === 'undefined') {
    throw new Error('Invalid task ID');
  }
  const response = await axios.post(`${API_URL}/tasks/${taskId}/subtasks`, subTaskData);
  return response.data;
};

export const updateSubTask = async (taskId, subTaskId, subTaskData) => {
  if (!taskId || taskId === 'undefined' || !subTaskId || subTaskId === 'undefined') {
    throw new Error('Invalid task or sub-task ID');
  }
  const response = await axios.put(`${API_URL}/tasks/${taskId}/subtasks/${subTaskId}`, subTaskData);
  return response.data;
};

export const deleteSubTask = async (taskId, subTaskId) => {
  if (!taskId || taskId === 'undefined' || !subTaskId || subTaskId === 'undefined') {
    throw new Error('Invalid task or sub-task ID');
  }
  const response = await axios.delete(`${API_URL}/tasks/${taskId}/subtasks/${subTaskId}`);
  return response.data;
};

export default setAuthToken;