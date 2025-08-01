import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import TaskListPage from './pages/TaskListPage';
import CreateTaskPage from './pages/CreateTaskPage';
import EditTaskPage from './pages/EditTaskPage';
import CreateSubTaskPage from './pages/CreateSubTaskPage';
import EditSubTaskPage from './pages/EditSubTaskPage';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/tasks" element={<TaskListPage />} />
        <Route path="/create-task" element={<CreateTaskPage />} />
        <Route path="/edit-task/:id" element={<EditTaskPage />} />
        <Route path="/create-subtask/:taskId" element={<CreateSubTaskPage />} />
        <Route path="/edit-subtask/:taskId/:subTaskId" element={<EditSubTaskPage />} />
      </Routes>
    </div>
  );
}

export default App;