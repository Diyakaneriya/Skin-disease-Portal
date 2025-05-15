const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, isAdmin } = require('../middleware/auth');

// Make sure these middleware functions exist in your auth middleware file
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/all', auth, isAdmin, userController.getAllUsers);

module.exports = router;