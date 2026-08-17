const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Department = require('./models/Department');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware MUST come before routes
app.use(express.json());
app.use(cors());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/civiceye';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas/Local successfully!'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Your test route
app.post('/api/departments', async (req, res) => {
  try {
    const newDepartment = new Department(req.body);
    const savedDepartment = await newDepartment.save();
    res.status(201).json(savedDepartment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('CivicEye Backend is running!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});