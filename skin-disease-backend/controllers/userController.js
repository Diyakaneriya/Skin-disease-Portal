const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const userController = {
  async register(req, res) {
    try {
      const { name, email, password, role } = req.body;
      
      // Check if user already exists
      const existingUser = await userModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
      
      // Create new user
      const userId = await userModel.create(name, email, password, role);
      const user = await userModel.findById(userId);
      
      // Generate token
      const token = jwt.sign({ id: userId, role: user.role  }, process.env.JWT_SECRET, { expiresIn: '1d' });
      
      res.status(201).json({ user, token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  
  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      // Find user
      const user = await userModel.findByEmail(email);
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      
      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      
      // Generate token
      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      
      res.json({ user: userWithoutPassword, token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  
  async getAllUsers(req, res) {
    try {
      // Check if user is admin
      const requestingUser = await userModel.findById(req.user.id);
      if (requestingUser.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
      }
      
      // Get all users
      const users = await userModel.findAll();
      
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = userController;