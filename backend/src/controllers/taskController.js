import Task from '../models/TaskModel.js';

// Create a new task with validation
export const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, subTasks } = req.body;

    // Validate inputs
    if (!title || title.trim().length === 0) {
      return res.status(400).json({ message: 'Title is required and cannot be empty' });
    }
    if (priority && !['high', 'medium', 'low'].includes(priority)) {
      return res.status(400).json({ message: 'Priority must be high, medium, or low' });
    }
    if (dueDate) {
      if (isNaN(Date.parse(dueDate))) {
        return res.status(400).json({ message: 'Invalid dueDate format' });
      }
      if (new Date(dueDate) < new Date()) {
        return res.status(400).json({ message: 'dueDate cannot be in the past' });
      }
    }
    if (subTasks) {
      if (!Array.isArray(subTasks)) {
        return res.status(400).json({ message: 'subTasks must be an array' });
      }
      if (subTasks.length > 10) {
        return res.status(400).json({ message: 'Cannot add more than 10 sub-tasks' });
      }
      for (const subTask of subTasks) {
        if (!subTask.title || subTask.title.trim().length === 0) {
          return res.status(400).json({ message: 'Sub-task title is required and cannot be empty' });
        }
        if (subTask.status && !['todo', 'in-progress', 'completed'].includes(subTask.status)) {
          return res.status(400).json({ message: 'Invalid sub-task status' });
        }
      }
    }

    const task = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : description,
      priority: priority || 'medium',
      dueDate: dueDate ? new Date(dueDate) : null,
      user: req.user,
      subTasks: subTasks || [],
    });

    res.status(201).json(task);
  } catch (error) {
    console.error(`Error in createTask: ${error.message}`);
    res.status(400).json({ message: error.message });
  }
};

// Get all tasks for the logged-in user with optional filtering, sorting, and pagination
export const getTasks = async (req, res) => {
  try {
    const { priority, status, sort, page = 1, limit = 10 } = req.query;

    // Build query object
    const query = { user: req.user };
    if (priority) {
      if (!['high', 'medium', 'low'].includes(priority)) {
        return res.status(400).json({ message: 'Invalid priority value' });
      }
      query.priority = priority;
    }
    if (status) {
      if (!['todo', 'in-progress', 'completed'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
      }
      query.status = status;
    }

    // Build sort object
    const sortOptions = {};
    if (sort) {
      const validSortFields = ['dueDate', 'priority', 'createdAt'];
      const sortFields = sort.split(',').map(field => {
        if (field.startsWith('-')) {
          return [field.slice(1), -1]; // Descending
        }
        return [field, 1]; // Ascending
      });
      sortFields.forEach(([field, order]) => {
        if (!validSortFields.includes(field)) {
          throw new Error(`Invalid sort field: ${field}`);
        }
        sortOptions[field] = order;
      });
    } else {
      sortOptions.createdAt = -1; // Default sort
    }

    // Pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    if (isNaN(pageNum) || pageNum < 1) {
      return res.status(400).json({ message: 'Invalid page number' });
    }
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({ message: 'Limit must be between 1 and 100' });
    }

    const skip = (pageNum - 1) * limitNum;
    const tasks = await Task.find(query).sort(sortOptions).skip(skip).limit(limitNum);
    const totalTasks = await Task.countDocuments(query);

    res.json({
      tasks,
      currentPage: pageNum,
      totalPages: Math.ceil(totalTasks / limitNum),
      totalTasks,
    });
  } catch (error) {
    console.error(`Error in getTasks: ${error.message}`);
    res.status(400).json({ message: error.message });
  }
};

// Get a task by ID for the logged-in user
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user });
    if (!task) {
      return res.status(404).json({ message: 'Task not found or not authorized' });
    }
    res.json(task);
  } catch (error) {
    console.error(`Error in getTaskById: ${error.message}`);
    res.status(400).json({ message: error.message });
  }
};

// Update a task with validation
export const updateTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, status, subTasks } = req.body;

    // Validate inputs
    if (title && title.trim().length === 0) {
      return res.status(400).json({ message: 'Title cannot be empty' });
    }
    if (priority && !['high', 'medium', 'low'].includes(priority)) {
      return res.status(400).json({ message: 'Invalid priority value' });
    }
    if (status && !['todo', 'in-progress', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    if (dueDate) {
      if (isNaN(Date.parse(dueDate))) {
        return res.status(400).json({ message: 'Invalid dueDate format' });
      }
      if (new Date(dueDate) < new Date()) {
        return res.status(400).json({ message: 'dueDate cannot be in the past' });
      }
    }
    if (subTasks) {
      if (!Array.isArray(subTasks)) {
        return res.status(400).json({ message: 'subTasks must be an array' });
      }
      if (subTasks.length > 10) {
        return res.status(400).json({ message: 'Cannot add more than 10 sub-tasks' });
      }
      for (const subTask of subTasks) {
        if (!subTask.title || subTask.title.trim().length === 0) {
          return res.status(400).json({ message: 'Sub-task title is required and cannot be empty' });
        }
        if (subTask.status && !['todo', 'in-progress', 'completed'].includes(subTask.status)) {
          return res.status(400).json({ message: 'Invalid sub-task status' });
        }
      }
    }

    const task = await Task.findOne({ _id: req.params.id, user: req.user });
    if (!task) {
      return res.status(404).json({ message: 'Task not found or not authorized' });
    }

    if (title) task.title = title.trim();
    if (description !== undefined) task.description = description ? description.trim() : description;
    if (priority) task.priority = priority;
    if (dueDate) task.dueDate = new Date(dueDate);
    if (status) task.status = status;
    if (subTasks) task.subTasks = subTasks;

    await task.save();
    res.json(task);
  } catch (error) {
    console.error(`Error in updateTask: ${error.message}`);
    res.status(400).json({ message: error.message });
  }
};

// Delete a task
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user });
    if (!task) {
      return res.status(404).json({ message: 'Task not found or not authorized' });
    }
    res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error(`Error in deleteTask: ${error.message}`);
    res.status(400).json({ message: error.message });
  }
};

// Add a new sub-task to a task with validation
export const addSubTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, status } = req.body;

    // Validate input
    if (!title || title.trim().length === 0) {
      return res.status(400).json({ message: 'Sub-task title is required and cannot be empty' });
    }
    if (status && !['todo', 'in-progress', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid sub-task status' });
    }

    const task = await Task.findOne({ _id: taskId, user: req.user });
    if (!task) {
      return res.status(404).json({ message: 'Task not found or not authorized' });
    }

    if (task.subTasks.length >= 10) {
      return res.status(400).json({ message: 'Cannot add more than 10 sub-tasks' });
    }

    task.subTasks.push({ title: title.trim(), status: status || 'todo' });
    await task.save();

    res.status(201).json(task);
  } catch (error) {
    console.error(`Error in addSubTask: ${error.message}`);
    res.status(400).json({ message: error.message });
  }
};

// Update a specific sub-task
export const updateSubTask = async (req, res) => {
  try {
    const { taskId, subTaskId } = req.params;
    const { status } = req.body;

    if (status && !['todo', 'in-progress', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid sub-task status' });
    }

    const task = await Task.findOne({ _id: taskId, user: req.user });
    if (!task) {
      return res.status(404).json({ message: 'Task not found or not authorized' });
    }

    const subTask = task.subTasks.id(subTaskId);
    if (!subTask) {
      return res.status(404).json({ message: 'Sub-task not found' });
    }

    if (status) subTask.status = status;
    await task.save();

    res.json(task);
  } catch (error) {
    console.error(`Error in updateSubTask: ${error.message}`);
    res.status(400).json({ message: error.message });
  }
};

// Delete a specific sub-task
export const deleteSubTask = async (req, res) => {
  try {
    const { taskId, subTaskId } = req.params;

    const task = await Task.findOne({ _id: taskId, user: req.user });
    if (!task) {
      return res.status(404).json({ message: 'Task not found or not authorized' });
    }

    const subTask = task.subTasks.id(subTaskId);
    if (!subTask) {
      return res.status(404).json({ message: 'Sub-task not found' });
    }

    task.subTasks.pull(subTaskId);
    await task.save();

    res.json(task);
  } catch (error) {
    console.error(`Error in deleteSubTask: ${error.message}`);
    res.status(400).json({ message: error.message });
  }
};

// Search tasks
export const searchTasks = async (req, res) => {
  try {
    const { query, page = 1, limit = 10 } = req.query;

    // Validate search query
    if (!query || query.trim().length === 0) {
      return res.status(400).json({ message: 'Search query is required and cannot be empty' });
    }

    // Build search query
    const searchQuery = {
      user: req.user,
      $or: [
        { title: { $regex: query.trim(), $options: 'i' } },
        { description: { $regex: query.trim(), $options: 'i' } },
      ],
    };

    // Pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    if (isNaN(pageNum) || pageNum < 1) {
      return res.status(400).json({ message: 'Invalid page number' });
    }
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({ message: 'Limit must be between 1 and 100' });
    }

    const skip = (pageNum - 1) * limitNum;
    const tasks = await Task.find(searchQuery).skip(skip).limit(limitNum);
    const totalTasks = await Task.countDocuments(searchQuery);

    res.json({
      tasks,
      currentPage: pageNum,
      totalPages: Math.ceil(totalTasks / limitNum),
      totalTasks,
    });
  } catch (error) {
    console.error(`Error in searchTasks: ${error.message}`);
    res.status(400).json({ message: error.message });
  }
};