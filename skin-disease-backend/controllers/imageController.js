const imageModel = require('../models/imageModel');
const classificationModel = require('../models/classificationModel');
const path = require('path');
const multer = require('multer');
const { exec, execSync } = require('child_process');
const fs = require('fs');
const util = require('util');

// Convert callback-based exec to Promise-based
const execPromise = util.promisify(exec);

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
  // Accept all image types including BMP files
  if (file.mimetype.startsWith('image/') || 
      file.mimetype === 'image/bmp' || 
      path.extname(file.originalname).toLowerCase() === '.bmp') {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images (including .bmp).'), false);
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
  
  
  // Add this function to imageController.js
async getUserImages(req, res) {
  try {
    const userId = req.user.id;
    const images = await imageModel.findByUserId(userId);
    
    // Add URL to each image
    const imagesWithUrls = images.map(image => ({
      ...image,
      imageUrl: `${req.protocol}://${req.get('host')}/${image.image_path}`
    }));
    
    res.status(200).json(imagesWithUrls);
  } catch (error) {
    console.error('Error fetching user images:', error);
    res.status(500).json({ message: 'Failed to retrieve images' });
  }
},

// Modify uploadImage to save the user's ID and extract features using Python script
async uploadImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }
    
    const userId = req.user.id; // Get user ID from auth middleware
    const imagePath = req.file.path.replace(/\\/g, '/');
    
    // Save image with user ID
    const imageId = await imageModel.create(userId, imagePath);
    
    // Process image with feature extraction and classification
    let features = null;
    let classification = null;
    let processingError = null;
    let featureId = null;
    let classificationId = null;
    
    try {
      console.log('Processing image:', imagePath);
      
      // Create a temporary directory for the output if it doesn't exist
      const tempDir = path.resolve(__dirname, '../temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
      }
      
      // Set up paths for the Python script
      const absoluteImagePath = path.resolve(imagePath);
      const outputPath = path.resolve(tempDir, `${imageId}.json`);
      const scriptPath = path.resolve(__dirname, '../../ml-service/process_image.py');
      
      // Execute the Python script synchronously to wait for results
      const { stdout, stderr } = await execPromise(`python "${scriptPath}" "${absoluteImagePath}" "${outputPath}"`);
      
      if (stderr) {
        console.error('Python script stderr:', stderr);
      }
      
      // Read the output JSON file
      if (fs.existsSync(outputPath)) {
        const processedData = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
        features = processedData.features;
        classification = processedData.classification;
        console.log('Image processed successfully: features extracted and image classified');
        
        // Save features to the database
        if (features) {
          try {
            // Map the features to the database schema
            const featureData = {
              asymmetry: features.asymmetry || 0,
              pigment_network: features.pigment_network || 'unknown',
              dots_globules: features.dots_globules || 'unknown',
              streaks: features.streaks || 'unknown',
              regression_areas: features.regression_areas || 'unknown',
              blue_whitish_veil: features.blue_whitish_veil || 'unknown',
              color_white: features.color_white ? 1 : 0,
              color_red: features.color_red ? 1 : 0,
              color_light_brown: features.color_light_brown ? 1 : 0,
              color_dark_brown: features.color_dark_brown ? 1 : 0,
              color_blue_gray: features.color_blue_gray ? 1 : 0,
              color_black: features.color_black ? 1 : 0
            };
            
            // Use the featureModel to store the features
            const featureModel = require('../models/featureModel');
            featureId = await featureModel.create(imageId, featureData);
            console.log('Features saved to database with ID:', featureId);
          } catch (featureSaveError) {
            console.error('Error saving features to database:', featureSaveError);
          }
        }
        
        // Save classification to the database
        if (classification && classification.classification && classification.classification.length > 0) {
          try {
            // Get the top prediction
            const topPrediction = classification.classification[0];
            // Map the classification result to the database enum values
            let classResult = 'normal';
            if (topPrediction.class_code === 'mel' || topPrediction.class_name.toLowerCase().includes('melanoma')) {
              classResult = 'melanoma';
            } else if (topPrediction.confidence_percent < 70) {
              classResult = 'abnormal';
            }
            
            // Store the confidence score as a decimal (0-100)
            const confidenceScore = topPrediction.confidence_percent || (topPrediction.probability * 100);
            
            classificationId = await classificationModel.create(
              imageId,
              classResult,
              confidenceScore
            );
            console.log('Classification saved to database with ID:', classificationId);
          } catch (classSaveError) {
            console.error('Error saving classification to database:', classSaveError);
          }
        }
        
        // Clean up - remove the temporary file
        fs.unlinkSync(outputPath);
      } else {
        throw new Error('Feature extraction output file was not created');
      }
    } catch (featureError) {
      console.error('Feature extraction error:', featureError.message);
      processingError = 'Feature extraction failed, but image was saved';
      // Image upload still succeeded, so we continue
    }
    
    res.status(201).json({
      success: true,
      imageId,
      imagePath: `/${imagePath}`,
      features: features,
      classification: classification,
      processingError: processingError,
      message: processingError || 'Image uploaded, features extracted, and classified successfully'
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
      
      // Add URL to the image
      image.imageUrl = `${req.protocol}://${req.get('host')}/${image.image_path}`;
      
      // Get feature extraction data
      const featureModel = require('../models/featureModel');
      const features = await featureModel.findByImageId(imageId);
      
      // Get classification data
      const classification = await classificationModel.findByImageId(imageId);
      
      // Return all data together
      res.status(200).json({
        ...image,
        features: features || null,
        classification: classification || null
      });
    } catch (error) {
      console.error('Error fetching image:', error);
      res.status(500).json({ message: 'Failed to retrieve image' });
    }
  }
};

module.exports = imageController;