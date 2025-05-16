const classificationModel = require('../../models/classificationModel');
const db = require('../../config/db');

// Mock the database connection
jest.mock('../../config/db');

describe('Classification Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    test('should create a new classification entry in the database', async () => {
      // Mock data
      const imageId = 1;
      const result = 'abnormal';
      const confidence = 85.5;

      // Mock database response
      db.execute.mockResolvedValue([{ insertId: 1 }]);

      // Call the method
      const classificationId = await classificationModel.create(imageId, result, confidence);

      // Assertions
      expect(classificationId).toBe(1);
      expect(db.execute).toHaveBeenCalledWith(
        'INSERT INTO classifications (image_id, classification_result, result1, percent1) VALUES (?, ?, ?, ?)',
        [imageId, result, result, confidence]
      );
    });
  });

  describe('findByImageId', () => {
    test('should return classification for a specific image', async () => {
      // Mock data
      const imageId = 1;
      const mockClassification = {
        id: 1,
        image_id: 1,
        classification_result: 'abnormal',
        result1: 'Actinic Keratosis',
        percent1: 85.5,
        result2: 'Melanocytic nevi',
        percent2: 10.2,
        result3: 'Melanoma',
        percent3: 4.3,
        created_at: new Date()
      };

      // Mock database response
      db.execute.mockResolvedValue([[mockClassification]]);

      // Call the method
      const result = await classificationModel.findByImageId(imageId);

      // Assertions
      expect(result).toEqual(mockClassification);
      expect(db.execute).toHaveBeenCalledWith(
        expect.stringContaining('SELECT c.id, c.image_id'),
        [imageId]
      );
    });

    test('should return undefined if no classification found', async () => {
      // Mock data
      const imageId = 999;

      // Mock database response (empty result)
      db.execute.mockResolvedValue([[]]);

      // Call the method
      const result = await classificationModel.findByImageId(imageId);

      // Assertions
      expect(result).toBeUndefined();
      expect(db.execute).toHaveBeenCalledWith(
        expect.stringContaining('SELECT c.id, c.image_id'),
        [imageId]
      );
    });
  });

  describe('saveFeatures', () => {
    test('should save features to the database', async () => {
      // Mock data
      const imageId = 1;
      const features = {
        asymmetry: 2,
        pigmentNetwork: 'T',
        dotsGlobules: 'AT',
        streaks: 'P',
        regressionAreas: 'P',
        blueWhitishVeil: 'P',
        colorWhite: false,
        colorRed: false,
        colorLightBrown: true,
        colorDarkBrown: true,
        colorBlueGray: true,
        colorBlack: false
      };

      // Mock database response
      db.execute.mockResolvedValue([{ insertId: 1 }]);

      // Call the method
      const result = await classificationModel.saveFeatures(imageId, features);

      // Assertions
      expect(result).toBe(1);
      expect(db.execute).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO image_features'),
        [
          imageId,
          features.asymmetry,
          features.pigmentNetwork,
          features.dotsGlobules,
          features.streaks,
          features.regressionAreas,
          features.blueWhitishVeil,
          features.colorWhite,
          features.colorRed,
          features.colorLightBrown,
          features.colorDarkBrown,
          features.colorBlueGray,
          features.colorBlack
        ]
      );
    });
  });
});
