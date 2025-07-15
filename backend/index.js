import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';
import taskRoutes from './src/routes/taskRoutes.js';

dotenv.config();

const app = express();
app.use(express.json()); // Parse JSON bodies

// Enable CORS for frontend origin
app.use(cors({
  origin: [
    'https://task-master-ivory.vercel.app',
    'http://localhost:5173'
  ],
  credentials: true,
}));


// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);


// Basic route
app.get('/', (req, res) => {
  res.send('TaskMaster Backend is Running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});