const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/medibuddy';
mongoose.connect(MONGODB_URI)
.then(() => console.log('MongoDB connected successfully'))
.catch(err => {
  console.error('MongoDB connection error:', err.message);
  console.log('Make sure MongoDB is running. You can start it with: mongod');
});

// Routes
app.use('/api/auth', require('./backend/routes/auth'));
app.use('/api/patients', require('./backend/routes/patients'));
app.use('/api/doctors', require('./backend/routes/doctors'));
app.use('/api/symptoms', require('./backend/routes/symptoms'));
app.use('/api/appointments', require('./backend/routes/appointments'));
app.use('/api/recommendations', require('./backend/routes/recommendations'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Medibuddy API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

