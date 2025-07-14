import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createTask, getTasks, getTaskById, updateTask, deleteTask, addSubTask, updateSubTask, deleteSubTask, searchTasks, getSubTask } from '../controllers/taskController.js';

const router = express.Router();

// Search tasks
router.get('/search', protect, searchTasks);

// Task routes
router.post('/', protect, createTask);
router.get('/', protect, getTasks);
router.get('/:id', protect, getTaskById);
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask);

// Sub-task routes
router.get('/:taskId/subtasks/:subTaskId', protect, getSubTask);
router.post('/:taskId/subtasks', protect, addSubTask);
router.put('/:taskId/subtasks/:subTaskId', protect, updateSubTask);
router.delete('/:taskId/subtasks/:subTaskId', protect, deleteSubTask);

export default router;