import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [20, 'Title cannot be more than 20 characters'],
  },
  description: {
    type: String,
    trim: true,
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium',
  },
  dueDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['Todo', 'InProgress', 'Completed'],
    default: 'Todo',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
  },
  subTasks: [{
    title: {
      type: String,
      required: [true, 'Subtask title is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Todo', 'InProgress', 'Completed'],
      default: 'Todo',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
    default: null,
  },
});

export default mongoose.model('Task', taskSchema);