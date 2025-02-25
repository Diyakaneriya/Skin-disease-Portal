const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import routes
const userRoutes = require('./routes/userRoutes');
const imageRoutes = require('./routes/imageRoutes');
const classificationRoutes = require('./routes/classificationRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/classifications', classificationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});