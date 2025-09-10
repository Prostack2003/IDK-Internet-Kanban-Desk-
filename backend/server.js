const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initDatabase } = require('./config/database');
const authRoutes = require('./routes/auth');
const boardsRoutes = require('./routes/boards');
const tasksRoutes = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Инициализация БД
initDatabase();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/boards', boardsRoutes);
app.use('/api/tasks', tasksRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
