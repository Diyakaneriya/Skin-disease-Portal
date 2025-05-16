const imageModel = require('../../models/imageModel');
const db = require('../../config/db');

// Mock the database connection
jest.mock('../../config/db');

describe('Image Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    test('should create a new image entry in the database', async () => {
      // Mock data
      const userId = 1;
      const filename = 'test-image.jpg';
      const originalName = 'original-image.jpg';
      const path = 'uploads/test-image.jpg';

      // Mock database response
      db.execute.mockResolvedValue([{ insertId: 1 }]);

      // Call the method
      const result = await imageModel.create(userId, filename, originalName, path);

      // Assertions
      expect(result).toBe(1);
      expect(db.execute).toHaveBeenCalledWith(
        'INSERT INTO images (user_id, filename, original_name, path, upload_date) VALUES (?, ?, ?, ?, NOW())',
        [userId, filename, originalName, path]
      );
    });
  });

  describe('findById', () => {
    test('should return an image by its ID', async () => {
      // Mock data
      const imageId = 1;
      const mockImage = {
        id: 1,
        user_id: 1,
        filename: 'test-image.jpg',
        original_name: 'original-image.jpg',
        path: 'uploads/test-image.jpg',
        upload_date: new Date()
      };

      // Mock database response
      db.execute.mockResolvedValue([[mockImage]]);

      // Call the method
      const result = await imageModel.findById(imageId);

      // Assertions
      expect(result).toEqual(mockImage);
      expect(db.execute).toHaveBeenCalledWith(
        'SELECT * FROM images WHERE id = ?',
        [imageId]
      );
    });

    test('should return undefined if no image found', async () => {
      // Mock data
      const imageId = 999;

      // Mock database response (empty result)
      db.execute.mockResolvedValue([[]]);

      // Call the method
      const result = await imageModel.findById(imageId);

      // Assertions
      expect(result).toBeUndefined();
      expect(db.execute).toHaveBeenCalledWith(
        'SELECT * FROM images WHERE id = ?',
        [imageId]
      );
    });
  });

  describe('findUserImages', () => {
    test('should return all images for a specific user', async () => {
      // Mock data
      const userId = 1;
      const mockImages = [
        {
          id: 1,
          user_id: 1,
          filename: 'test-image1.jpg',
          original_name: 'original-image1.jpg',
          path: 'uploads/test-image1.jpg',
          upload_date: new Date()
        },
        {
          id: 2,
          user_id: 1,
          filename: 'test-image2.jpg',
          original_name: 'original-image2.jpg',
          path: 'uploads/test-image2.jpg',
          upload_date: new Date()
        }
      ];

      // Mock database response
      db.execute.mockResolvedValue([mockImages]);

      // Call the method
      const result = await imageModel.findUserImages(userId);

      // Assertions
      expect(result).toEqual(mockImages);
      expect(result).toHaveLength(2);
      expect(db.execute).toHaveBeenCalledWith(
        'SELECT * FROM images WHERE user_id = ? ORDER BY upload_date DESC',
        [userId]
      );
    });
  });

  describe('findUserImagesWithDetails', () => {
    test('should return user images with features and classifications', async () => {
      // Mock data
      const userId = 1;
      const mockImagesWithDetails = [
        {
          id: 1,
          user_id: 1,
          filename: 'test-image1.jpg',
          original_name: 'original-image1.jpg',
          path: 'uploads/test-image1.jpg',
          upload_date: new Date(),
          feature_id: 1,
          asymmetry: 2,
          pigment_network: 'T',
          dots_globules: 'AT',
          classification_id: 1,
          classification_result: 'abnormal',
          result1: 'Actinic Keratosis',
          percent1: 85.5
        }
      ];

      // Mock database response
      db.execute.mockResolvedValue([mockImagesWithDetails]);

      // Call the method
      const result = await imageModel.findUserImagesWithDetails(userId);

      // Assertions
      expect(result).toEqual(mockImagesWithDetails);
      expect(db.execute).toHaveBeenCalledWith(
        expect.stringContaining('SELECT i.*, f.id as feature_id, f.asymmetry'),
        [userId]
      );
    });
  });

  describe('findImageWithDetails', () => {
    test('should return a single image with its features and classification', async () => {
      // Mock data
      const imageId = 1;
      const mockImageWithDetails = {
        id: 1,
        user_id: 1,
        filename: 'test-image.jpg',
        original_name: 'original-image.jpg',
        path: 'uploads/test-image.jpg',
        upload_date: new Date(),
        feature_id: 1,
        asymmetry: 2,
        pigment_network: 'T',
        dots_globules: 'AT',
        classification_id: 1,
        classification_result: 'abnormal',
        result1: 'Actinic Keratosis',
        percent1: 85.5
      };

      // Mock database response
      db.execute.mockResolvedValue([[mockImageWithDetails]]);

      // Call the method
      const result = await imageModel.findImageWithDetails(imageId);

      // Assertions
      expect(result).toEqual(mockImageWithDetails);
      expect(db.execute).toHaveBeenCalledWith(
        expect.stringContaining('SELECT i.*, f.id as feature_id, f.asymmetry'),
        [imageId]
      );
    });

    test('should return undefined if no image found', async () => {
      // Mock data
      const imageId = 999;

      // Mock database response (empty result)
      db.execute.mockResolvedValue([[]]);

      // Call the method
      const result = await imageModel.findImageWithDetails(imageId);

      // Assertions
      expect(result).toBeUndefined();
      expect(db.execute).toHaveBeenCalledWith(
        expect.stringContaining('SELECT i.*, f.id as feature_id, f.asymmetry'),
        [imageId]
      );
    });
  });
});
