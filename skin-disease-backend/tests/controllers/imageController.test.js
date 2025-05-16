const request = require('supertest');
const express = require('express');
const imageController = require('../../controllers/imageController');
const imageModel = require('../../models/imageModel');
const featureModel = require('../../models/featureModel');
const classificationModel = require('../../models/classificationModel');
const { auth } = require('../../middleware/auth');
const fs = require('fs');
const path = require('path');

// Mock dependencies
jest.mock('../../models/imageModel');
jest.mock('../../models/featureModel');
jest.mock('../../models/classificationModel');
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
router.post('/upload', auth, imageController.uploadMiddleware, imageController.uploadImage);
router.get('/user/me', auth, imageController.getUserImages);
router.get('/:id', imageController.getImageById);
app.use('/api/images', router);

describe('Image Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('uploadImage', () => {
    test('should upload an image and return success with features and classification', async () => {
      // Mock model responses
      imageModel.create.mockResolvedValue(1); // imageId = 1
      featureModel.create.mockResolvedValue(1); // featureId = 1
      classificationModel.create.mockResolvedValue(1); // classificationId = 1

      // Create test file data
      const testFeatures = {
        asymmetry: 2,
        pigment_network: 'T',
        dots_globules: 'AT',
        streaks: 'P',
        regression_areas: 'P',
        blue_whitish_veil: 'P',
        color_white: false,
        color_red: false,
        color_light_brown: true,
        color_dark_brown: true,
        color_blue_gray: true,
        color_black: false
      };

      const testClassification = {
        classification: [
          {
            class_name: 'Actinic Keratosis',
            class_code: 'akiec',
            confidence_percent: 85.5
          },
          {
            class_name: 'Melanocytic nevi',
            class_code: 'nv',
            confidence_percent: 10.2
          },
          {
            class_name: 'Melanoma',
            class_code: 'mel',
            confidence_percent: 4.3
          }
        ]
      };

      // Mock fs.readFileSync to return test data
      fs.readFileSync.mockReturnValue(JSON.stringify({
        features: testFeatures,
        classification: testClassification
      }));

      // Make request
      const response = await request(app)
        .post('/api/images/upload')
        .attach('image', Buffer.from('fake-image'), 'test-image.jpg');

      // Assertions
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.imageId).toBe(1);
      expect(response.body.features).toEqual(testFeatures);
      expect(response.body.classification).toEqual(testClassification);
      expect(imageModel.create).toHaveBeenCalledWith(1, expect.any(String));
      expect(featureModel.create).toHaveBeenCalledWith(1, expect.objectContaining({
        asymmetry: 2,
        pigment_network: 'T'
      }));
    });

    test('should return 400 if no image is uploaded', async () => {
      // Make request without attaching an image
      const response = await request(app)
        .post('/api/images/upload');

      // Assertions
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Please upload an image');
    });
  });

  describe('getUserImages', () => {
    test('should return all images for the authenticated user', async () => {
      // Mock data
      const mockImages = [
        { id: 1, user_id: 1, image_path: 'uploads/image1.jpg', created_at: new Date() },
        { id: 2, user_id: 1, image_path: 'uploads/image2.jpg', created_at: new Date() }
      ];

      // Mock model response
      imageModel.findByUserId.mockResolvedValue(mockImages);

      // Make request
      const response = await request(app)
        .get('/api/images/user/me');

      // Assertions
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body[0]).toHaveProperty('imageUrl');
      expect(imageModel.findByUserId).toHaveBeenCalledWith(1);
    });
  });

  describe('getImageById', () => {
    test('should return an image with its features and classification', async () => {
      // Mock data
      const mockImage = { id: 1, user_id: 1, image_path: 'uploads/image1.jpg', created_at: new Date() };
      const mockFeatures = { 
        id: 1, 
        image_id: 1, 
        asymmetry: 2,
        pigment_network: 'T',
        dots_globules: 'AT'
      };
      const mockClassification = { 
        id: 1, 
        image_id: 1, 
        classification_result: 'abnormal',
        result1: 'Actinic Keratosis',
        percent1: 85.5
      };

      // Mock model responses
      imageModel.findById.mockResolvedValue(mockImage);
      featureModel.findByImageId.mockResolvedValue(mockFeatures);
      classificationModel.findByImageId.mockResolvedValue(mockClassification);

      // Make request
      const response = await request(app)
        .get('/api/images/1');

      // Assertions
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('imageUrl');
      expect(response.body).toHaveProperty('features');
      expect(response.body).toHaveProperty('classification');
      expect(imageModel.findById).toHaveBeenCalledWith('1');
      expect(featureModel.findByImageId).toHaveBeenCalledWith('1');
      expect(classificationModel.findByImageId).toHaveBeenCalledWith('1');
    });

    test('should return 404 if image not found', async () => {
      // Mock model response
      imageModel.findById.mockResolvedValue(null);

      // Make request
      const response = await request(app)
        .get('/api/images/999');

      // Assertions
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Image not found');
    });
  });
});
