const request = require('supertest');
const express = require('express');
const userController = require('../../controllers/userController');
const userModel = require('../../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { auth } = require('../../middleware/auth');

// Mock dependencies
jest.mock('../../models/userModel');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../../middleware/auth', () => ({
  auth: jest.fn((req, res, next) => {
    req.user = { id: 1, role: 'patient' };
    next();
  })
}));

// Setup express app for testing
const app = express();
app.use(express.json());

// Configure routes for testing
const router = express.Router();
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/all', auth, userController.getAllUsers);
router.get('/doctors/pending', auth, userController.getPendingDoctors);
router.post('/doctor/approve', auth, userController.updateDoctorStatus);
app.use('/api/users', router);

describe('User Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    test('should register a new patient user and return token', async () => {
      // Mock data
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'patient'
      };

      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        role: 'patient'
      };

      // Mock responses
      userModel.findByEmail.mockResolvedValue(null); // User doesn't exist
      userModel.create.mockResolvedValue(1); // userId = 1
      userModel.findById.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue('test-token');

      // Make request
      const response = await request(app)
        .post('/api/users/register')
        .send(userData);

      // Assertions
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token', 'test-token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id', 1);
      expect(userModel.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(userModel.create).toHaveBeenCalledWith('Test User', 'test@example.com', 'password123', 'patient');
    });

    test('should return 400 if user already exists', async () => {
      // Mock data
      const userData = {
        name: 'Existing User',
        email: 'existing@example.com',
        password: 'password123',
        role: 'patient'
      };

      // Mock responses
      userModel.findByEmail.mockResolvedValue({ id: 2, email: 'existing@example.com' });

      // Make request
      const response = await request(app)
        .post('/api/users/register')
        .send(userData);

      // Assertions
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('User already exists');
      expect(userModel.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    test('should login user and return token', async () => {
      // Mock data
      const loginData = {
        email: 'test@example.com',
        password: 'correct-password'
      };

      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed-password',
        role: 'patient'
      };

      // Mock responses
      userModel.findByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('test-token');

      // Make request
      const response = await request(app)
        .post('/api/users/login')
        .send(loginData);

      // Assertions
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token', 'test-token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id', 1);
      expect(response.body.user).not.toHaveProperty('password');
      expect(userModel.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(bcrypt.compare).toHaveBeenCalledWith('correct-password', 'hashed-password');
    });

    test('should return 400 if credentials are invalid', async () => {
      // Mock data
      const loginData = {
        email: 'test@example.com',
        password: 'wrong-password'
      };

      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed-password',
        role: 'patient'
      };

      // Mock responses
      userModel.findByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      // Make request
      const response = await request(app)
        .post('/api/users/login')
        .send(loginData);

      // Assertions
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid credentials');
      expect(jwt.sign).not.toHaveBeenCalled();
    });
  });

  describe('getAllUsers', () => {
    test('should return all users for admin', async () => {
      // Override auth middleware for this test
      auth.mockImplementation((req, res, next) => {
        req.user = { id: 3, role: 'admin' };
        next();
      });

      // Mock data
      const mockUsers = [
        { id: 1, name: 'User 1', email: 'user1@example.com', role: 'patient' },
        { id: 2, name: 'User 2', email: 'user2@example.com', role: 'doctor' }
      ];

      // Mock responses
      userModel.findById.mockResolvedValue({ id: 3, role: 'admin' });
      userModel.findAll.mockResolvedValue(mockUsers);

      // Make request
      const response = await request(app)
        .get('/api/users/all');

      // Assertions
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(userModel.findById).toHaveBeenCalledWith(3);
      expect(userModel.findAll).toHaveBeenCalled();
    });

    test('should return 403 if user is not admin', async () => {
      // Override auth middleware for this test
      auth.mockImplementation((req, res, next) => {
        req.user = { id: 1, role: 'patient' };
        next();
      });

      // Mock responses
      userModel.findById.mockResolvedValue({ id: 1, role: 'patient' });

      // Make request
      const response = await request(app)
        .get('/api/users/all');

      // Assertions
      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Access denied. Admin privileges required.');
      expect(userModel.findAll).not.toHaveBeenCalled();
    });
  });

  describe('getPendingDoctors', () => {
    test('should return pending doctors for admin', async () => {
      // Override auth middleware for this test
      auth.mockImplementation((req, res, next) => {
        req.user = { id: 3, role: 'admin' };
        next();
      });

      // Mock data
      const mockPendingDoctors = [
        { 
          id: 2, 
          name: 'Doctor 1', 
          email: 'doctor1@example.com', 
          role: 'doctor',
          approval_status: 'pending',
          degree_path: 'uploads/degrees/degree-123456.pdf'
        }
      ];

      // Mock responses
      userModel.findById.mockResolvedValue({ id: 3, role: 'admin' });
      userModel.findPendingDoctors.mockResolvedValue(mockPendingDoctors);

      // Make request
      const response = await request(app)
        .get('/api/users/doctors/pending');

      // Assertions
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toHaveProperty('approval_status', 'pending');
      expect(userModel.findById).toHaveBeenCalledWith(3);
      expect(userModel.findPendingDoctors).toHaveBeenCalled();
    });
  });

  describe('updateDoctorStatus', () => {
    test('should update doctor approval status', async () => {
      // Override auth middleware for this test
      auth.mockImplementation((req, res, next) => {
        req.user = { id: 3, role: 'admin' };
        next();
      });

      // Mock data
      const updateData = {
        doctorId: 2,
        status: 'approved'
      };

      // Mock responses
      userModel.findById.mockResolvedValue({ id: 3, role: 'admin' });
      userModel.updateApprovalStatus.mockResolvedValue(true);

      // Make request
      const response = await request(app)
        .post('/api/users/doctor/approve')
        .send(updateData);

      // Assertions
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Doctor registration approved');
      expect(userModel.findById).toHaveBeenCalledWith(3);
      expect(userModel.updateApprovalStatus).toHaveBeenCalledWith(2, 'approved');
    });

    test('should return 400 if status is invalid', async () => {
      // Override auth middleware for this test
      auth.mockImplementation((req, res, next) => {
        req.user = { id: 3, role: 'admin' };
        next();
      });

      // Mock data
      const updateData = {
        doctorId: 2,
        status: 'invalid-status'
      };

      // Mock responses
      userModel.findById.mockResolvedValue({ id: 3, role: 'admin' });

      // Make request
      const response = await request(app)
        .post('/api/users/doctor/approve')
        .send(updateData);

      // Assertions
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Status must be either approved or rejected');
      expect(userModel.updateApprovalStatus).not.toHaveBeenCalled();
    });
  });
});
