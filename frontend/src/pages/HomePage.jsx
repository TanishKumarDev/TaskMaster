import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const token = localStorage.getItem('token');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">TaskMaster</h1>
        {token ? (
          <>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Welcome back! Manage your tasks like a pro!
            </p>
            <div className="flex justify-center">
              <Link
                to="/tasks"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Go to Dashboard
              </Link>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              This is TaskMaster - manage your tasks like a pro!
            </p>
            <div className="flex justify-center gap-4">
              <Link
                to="/login"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Signup
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;