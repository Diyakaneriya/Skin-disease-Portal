const imageModel = require('../models/imageModel');
const path = require('path');
const multer = require('multer');

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter for images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: fileFilter
});

const imageController = {
  uploadMiddleware: upload.single('image'),
  
  async uploadImage(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Please upload an image' });
      }
      
      const imagePath = req.file.path.replace(/\\/g, '/'); // Normalize path for all OS
      
      // Save image info to database (no user ID for now)
      const imageId = await imageModel.create(1, imagePath); // Use a dummy user ID (e.g., 1)
      
      res.status(201).json({
        success: true,
        imageId,
        imagePath: `/${imagePath}`, // Path for frontend to access
        message: 'Image uploaded successfully'
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ message: 'Failed to upload image' });
    }
  },
  
  async getImageById(req, res) {
    try {
      const imageId = req.params.id;
      const image = await imageModel.findById(imageId);
      
      if (!image) {
        return res.status(404).json({ message: 'Image not found' });
      }
      
      image.imageUrl = `${req.protocol}://${req.get('host')}/${image.image_path}`;
      
      res.status(200).json(image);
    } catch (error) {
      console.error('Error fetching image:', error);
      res.status(500).json({ message: 'Failed to retrieve image' });
    }
  }
};

module.exports = imageController;