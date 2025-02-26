const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');

// Upload an image (no authentication)
router.post('/upload', 
  imageController.uploadMiddleware, 
  imageController.uploadImage
);

// Get specific image by ID (no authentication)
router.get('/:id', imageController.getImageById);

module.exports = router;