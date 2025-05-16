// Set up environment variables for testing
require('dotenv').config({ path: '.env.test' });

// Mock the database connection
jest.mock('../config/db', () => {
  return {
    execute: jest.fn(),
    pool: {
      getConnection: jest.fn().mockResolvedValue({
        execute: jest.fn(),
        release: jest.fn()
      })
    }
  };
});

// Mock file system operations
jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  existsSync: jest.fn().mockReturnValue(true),
  mkdirSync: jest.fn(),
  readFileSync: jest.fn().mockReturnValue(JSON.stringify({
    features: {
      Asymmetry: 2,
      Pigment_Network: 'T',
      Dots_Globules: 'AT',
      Streaks: 'P',
      Regression_Areas: 'P',
      Blue_Whitish_Veil: 'P',
      Color_White: false,
      Color_Red: false,
      Color_Light_Brown: true,
      Color_Dark_Brown: true,
      Color_Blue_Gray: true,
      Color_Black: false
    },
    classification: {
      classification: [
        {
          class_name: 'Actinic Keratosis / Bowens disease (pre-cancerous)',
          class_code: 'akiec',
          confidence_percent: 85.5
        },
        {
          class_name: 'Melanocytic nevi (benign mole)',
          class_code: 'nv',
          confidence_percent: 10.2
        },
        {
          class_name: 'Melanoma',
          class_code: 'mel',
          confidence_percent: 4.3
        }
      ],
      confidence_level: 'high',
      recommendation: 'This image shows characteristics consistent with a pre-cancerous lesion. Please consult with a dermatologist for proper evaluation.',
      disclaimer: 'This AI analysis is for educational purposes only and does not replace professional medical advice.'
    }
  })),
  unlinkSync: jest.fn()
}));

// Mock child_process exec
jest.mock('child_process', () => ({
  exec: jest.fn(),
  execSync: jest.fn(),
  execPromise: jest.fn().mockResolvedValue({ stdout: '', stderr: '' })
}));

// Mock multer
jest.mock('multer', () => {
  const multerMock = () => ({
    single: () => (req, res, next) => {
      req.file = {
        path: 'uploads/test-image.jpg',
        originalname: 'test-image.jpg',
        mimetype: 'image/jpeg',
        size: 12345
      };
      next();
    }
  });
  
  multerMock.diskStorage = () => ({});
  multerMock.MulterError = class MulterError extends Error {};
  
  return multerMock;
});

// Mock JWT
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('test-token'),
  verify: jest.fn().mockImplementation((token, secret, callback) => {
    if (token === 'valid-token') {
      return { id: 1, role: 'patient' };
    } else if (token === 'doctor-token') {
      return { id: 2, role: 'doctor' };
    } else if (token === 'admin-token') {
      return { id: 3, role: 'admin' };
    } else {
      throw new Error('Invalid token');
    }
  })
}));

// Mock bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
  compare: jest.fn().mockImplementation((password, hash) => {
    return Promise.resolve(password === 'correct-password');
  })
}));

// Global test setup
global.beforeEach(() => {
  jest.clearAllMocks();
});

// Suppress console logs during tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn()
};
