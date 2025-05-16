const db = require('../config/db');
const bcrypt = require('bcrypt');

const userModel = {
  async create(name, email, password, role = 'patient', degreePath = null) {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // If role is doctor, set approval status to pending
    let approvalStatus = null;
    if (role === 'doctor') {
      approvalStatus = 'pending';
    }
    
    const [result] = await db.execute(
      'INSERT INTO users (name, email, password, role, degree_path, approval_status) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, hashedPassword, role, degreePath, approvalStatus]
    );
    return result.insertId;
  },

  async findByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },

  async findById(id) {
    const [rows] = await db.execute('SELECT id, name, email, role, created_at, degree_path, approval_status FROM users WHERE id = ?', [id]);
    return rows[0];
  },
  
  async findAll() {
    const [rows] = await db.execute('SELECT id, name, email, role, created_at, degree_path, approval_status FROM users');
    return rows;
  },
  
  async findPendingDoctors() {
    const [rows] = await db.execute(
      'SELECT id, name, email, role, created_at, degree_path, approval_status FROM users WHERE role = ? AND approval_status = ?',
      ['doctor', 'pending']
    );
    return rows;
  },
  
  async updateApprovalStatus(userId, status) {
    await db.execute(
      'UPDATE users SET approval_status = ? WHERE id = ?',
      [status, userId]
    );
    return true;
  },
  
  async findAllPatientsWithImages() {
    // First get all patients
    const [patients] = await db.execute(
      'SELECT id, name, email, created_at, profile_picture FROM users WHERE role = ?',
      ['patient']
    );
    
    // For each patient, get their images with features and classification
    const patientsWithImages = await Promise.all(patients.map(async (patient) => {
      const [images] = await db.execute(
        `SELECT i.*, 
        c.classification_result, c.confidence_score,
        f.asymmetry, f.pigment_network, f.dots_globules, f.streaks, 
        f.regression_areas, f.blue_whitish_veil, f.color_white, f.color_red, 
        f.color_light_brown, f.color_dark_brown, f.color_blue_gray, f.color_black
        FROM images i 
        LEFT JOIN classifications c ON i.id = c.image_id
        LEFT JOIN image_features f ON i.id = f.image_id
        WHERE i.user_id = ?`,
        [patient.id]
      );
      
      // Process images to include features and classification in a structured format
      const processedImages = images.map(image => {
        // Extract features
        const features = {
          asymmetry: image.asymmetry,
          pigment_network: image.pigment_network,
          dots_globules: image.dots_globules,
          streaks: image.streaks,
          regression_areas: image.regression_areas,
          blue_whitish_veil: image.blue_whitish_veil,
          color_white: Boolean(image.color_white),
          color_red: Boolean(image.color_red),
          color_light_brown: Boolean(image.color_light_brown),
          color_dark_brown: Boolean(image.color_dark_brown),
          color_blue_gray: Boolean(image.color_blue_gray),
          color_black: Boolean(image.color_black)
        };
        
        // Extract classification
        const classification = image.classification_result ? {
          result: image.classification_result,
          confidence: image.confidence_score,
          predictions: [{
            label: image.classification_result,
            confidence: image.confidence_score
          }]
        } : null;
        
        // Clean up the image object by removing the feature and classification fields
        const cleanedImage = { ...image };
        [
          'asymmetry', 'pigment_network', 'dots_globules', 'streaks', 
          'regression_areas', 'blue_whitish_veil', 'color_white', 'color_red', 
          'color_light_brown', 'color_dark_brown', 'color_blue_gray', 'color_black',
          'classification_result', 'confidence_score'
        ].forEach(key => delete cleanedImage[key]);
        
        // Return the image with structured features and classification
        return {
          ...cleanedImage,
          features: Object.values(features).some(v => v !== null && v !== undefined) ? features : null,
          classification: classification
        };
      });
      
      return {
        ...patient,
        images: processedImages
      };
    }));
    
    return patientsWithImages;
  }
};

module.exports = userModel;