import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createTask, getTasks, getTaskById, updateTask, deleteTask, addSubTask, updateSubTask, deleteSubTask, searchTasks } from '../controllers/taskController.js';

const router = express.Router();

router.get('/search', protect, searchTasks);
router.post('/', protect, createTask);
router.get('/', protect, getTasks);
router.get('/:id', protect, getTaskById);
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask);
router.post('/:taskId/subtasks', protect, addSubTask);
router.put('/:taskId/subtasks/:subTaskId', protect, updateSubTask);
router.delete('/:taskId/subtasks/:subTaskId', protect, deleteSubTask);

export default router;