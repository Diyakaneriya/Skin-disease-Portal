const featureModel = require('../../models/featureModel');
const db = require('../../config/db');

// Mock the database connection
jest.mock('../../config/db');

describe('Feature Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    test('should create a new feature entry in the database', async () => {
      // Mock data
      const imageId = 1;
      const features = {
        asymmetry: 2,
        pigment_network: 'T',
        dots_globules: 'AT',
        streaks: 'P',
        regression_areas: 'P',
        blue_whitish_veil: 'P',
        color_white: 0,
        color_red: 0,
        color_light_brown: 1,
        color_dark_brown: 1,
        color_blue_gray: 1,
        color_black: 0
      };

      // Mock database response
      db.execute.mockResolvedValue([{ insertId: 1 }]);

      // Call the method
      const result = await featureModel.create(imageId, features);

      // Assertions
      expect(result).toBe(1);
      expect(db.execute).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO image_features'),
        [
          imageId,
          features.asymmetry,
          features.pigment_network,
          features.dots_globules,
          features.streaks,
          features.regression_areas,
          features.blue_whitish_veil,
          features.color_white,
          features.color_red,
          features.color_light_brown,
          features.color_dark_brown,
          features.color_blue_gray,
          features.color_black
        ]
      );
    });

    test('should handle default values for missing features', async () => {
      // Mock data with missing features
      const imageId = 1;
      const features = {
        asymmetry: 2,
        // Missing other features
      };

      // Mock database response
      db.execute.mockResolvedValue([{ insertId: 1 }]);

      // Call the method
      const result = await featureModel.create(imageId, features);

      // Assertions
      expect(result).toBe(1);
      expect(db.execute).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO image_features'),
        expect.arrayContaining([
          imageId,
          2, // asymmetry
          'unknown', // Default for missing text fields
          'unknown',
          'unknown',
          'unknown',
          'unknown',
          0, // Default for missing boolean fields
          0,
          0,
          0,
          0,
          0
        ])
      );
    });
  });

  describe('findByImageId', () => {
    test('should return features for a specific image', async () => {
      // Mock data
      const imageId = 1;
      const mockFeatures = {
        id: 1,
        image_id: 1,
        asymmetry: 2,
        pigment_network: 'T',
        dots_globules: 'AT',
        streaks: 'P',
        regression_areas: 'P',
        blue_whitish_veil: 'P',
        color_white: 0,
        color_red: 0,
        color_light_brown: 1,
        color_dark_brown: 1,
        color_blue_gray: 1,
        color_black: 0
      };

      // Mock database response
      db.execute.mockResolvedValue([[mockFeatures]]);

      // Call the method
      const result = await featureModel.findByImageId(imageId);

      // Assertions
      expect(result).toEqual(mockFeatures);
      expect(db.execute).toHaveBeenCalledWith(
        'SELECT * FROM image_features WHERE image_id = ?',
        [imageId]
      );
    });

    test('should return undefined if no features found', async () => {
      // Mock data
      const imageId = 999;

      // Mock database response (empty result)
      db.execute.mockResolvedValue([[]]);

      // Call the method
      const result = await featureModel.findByImageId(imageId);

      // Assertions
      expect(result).toBeUndefined();
      expect(db.execute).toHaveBeenCalledWith(
        'SELECT * FROM image_features WHERE image_id = ?',
        [imageId]
      );
    });
  });

  describe('update', () => {
    test('should update existing features', async () => {
      // Mock data
      const featureId = 1;
      const updatedFeatures = {
        asymmetry: 1,
        pigment_network: 'AT',
        dots_globules: 'T',
        streaks: 'A',
        regression_areas: 'A',
        blue_whitish_veil: 'A',
        color_white: 1,
        color_red: 1,
        color_light_brown: 0,
        color_dark_brown: 0,
        color_blue_gray: 0,
        color_black: 1
      };

      // Mock database response
      db.execute.mockResolvedValue([{ affectedRows: 1 }]);

      // Call the method
      const result = await featureModel.update(featureId, updatedFeatures);

      // Assertions
      expect(result).toBe(true);
      expect(db.execute).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE image_features SET'),
        [
          updatedFeatures.asymmetry,
          updatedFeatures.pigment_network,
          updatedFeatures.dots_globules,
          updatedFeatures.streaks,
          updatedFeatures.regression_areas,
          updatedFeatures.blue_whitish_veil,
          updatedFeatures.color_white,
          updatedFeatures.color_red,
          updatedFeatures.color_light_brown,
          updatedFeatures.color_dark_brown,
          updatedFeatures.color_blue_gray,
          updatedFeatures.color_black,
          featureId
        ]
      );
    });
  });
});
