import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex gap-6">
          <Link
            to="/"
            className="text-gray-700 dark:text-gray-200 font-medium hover:text-blue-500 dark:hover:text-blue-400"
          >
            Home
          </Link>
          {token && (
            <>
              <Link
                to="/tasks"
                className="text-gray-700 dark:text-gray-200 font-medium hover:text-blue-500 dark:hover:text-blue-400"
              >
                Dashboard
              </Link>
              <Link
                to="/create-task"
                className="text-gray-700 dark:text-gray-200 font-medium hover:text-blue-500 dark:hover:text-blue-400"
              >
                Create Task
              </Link>
            </>
          )}
        </div>
        <div className="flex gap-4 items-center">
          {token ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-700 dark:text-gray-200 font-medium hover:text-blue-500 dark:hover:text-blue-400"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-gray-700 dark:text-gray-200 font-medium hover:text-blue-500 dark:hover:text-blue-400"
              >
                Signup
              </Link>
            </>
          )}
          <button
            onClick={toggleTheme}
            className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;