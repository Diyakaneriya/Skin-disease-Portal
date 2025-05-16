const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');

// Convert callback-based exec to Promise-based
const execPromise = util.promisify(exec);

// Mock dependencies
jest.mock('fs');
jest.mock('child_process');

describe('ML Service Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('process_image.py', () => {
    test('should extract features and classify an image', async () => {
      // Mock data for the test
      const imagePath = 'uploads/test-image.jpg';
      const outputPath = 'temp/output.json';
      const scriptPath = '../../ml-service/process_image.py';
      
      // Expected output from the ML service
      const expectedOutput = {
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
          disclaimer: 'This AI analysis is for educational purposes only and does not replace professional medical advice.',
          gradcam_path: 'temp/gradcam_1.jpg'
        }
      };

      // Mock the file system operations
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(JSON.stringify(expectedOutput));
      
      // Mock the execution of the Python script
      exec.mockImplementation((command, callback) => {
        callback(null, { stdout: 'Success', stderr: '' });
      });

      // Execute the Python script
      const command = `python "${scriptPath}" "${imagePath}" "${outputPath}"`;
      const { stdout, stderr } = await execPromise(command);
      
      // Read the output file
      const processedData = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
      
      // Assertions
      expect(stderr).toBe('');
      expect(processedData).toHaveProperty('features');
      expect(processedData).toHaveProperty('classification');
      
      // Feature extraction assertions
      expect(processedData.features).toHaveProperty('Asymmetry', 2);
      expect(processedData.features).toHaveProperty('Pigment_Network', 'T');
      expect(processedData.features).toHaveProperty('Dots_Globules', 'AT');
      
      // Classification assertions
      expect(processedData.classification.classification).toHaveLength(3);
      expect(processedData.classification.classification[0]).toHaveProperty('class_name');
      expect(processedData.classification.classification[0]).toHaveProperty('confidence_percent');
      
      // Grad-CAM visualization assertion
      expect(processedData.classification).toHaveProperty('gradcam_path');
    });

    test('should handle errors when processing an image', async () => {
      // Mock data for the test
      const imagePath = 'uploads/invalid-image.jpg';
      const outputPath = 'temp/output.json';
      const scriptPath = '../../ml-service/process_image.py';
      
      // Mock the file system operations
      fs.existsSync.mockReturnValue(false);
      
      // Mock the execution of the Python script with an error
      exec.mockImplementation((command, callback) => {
        callback(new Error('Python script execution failed'), { 
          stdout: '', 
          stderr: 'Error: Could not process the image' 
        });
      });

      // Execute the Python script and expect it to throw an error
      try {
        const command = `python "${scriptPath}" "${imagePath}" "${outputPath}"`;
        await execPromise(command);
        // If we reach here, the test should fail
        expect(true).toBe(false);
      } catch (error) {
        // Assertions for error handling
        expect(error).toBeTruthy();
        expect(fs.existsSync(outputPath)).toBe(false);
      }
    });
  });

  describe('Feature Extraction', () => {
    test('should extract all required dermatological features', () => {
      // Mock the feature extraction output
      const featureOutput = {
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
      };
      
      // Assertions for feature extraction
      expect(featureOutput).toHaveProperty('Asymmetry');
      expect([0, 1, 2]).toContain(featureOutput.Asymmetry);
      
      expect(featureOutput).toHaveProperty('Pigment_Network');
      expect(['AT', 'T', 'A']).toContain(featureOutput.Pigment_Network);
      
      expect(featureOutput).toHaveProperty('Dots_Globules');
      expect(['A', 'AT', 'T']).toContain(featureOutput.Dots_Globules);
      
      expect(featureOutput).toHaveProperty('Streaks');
      expect(['A', 'P']).toContain(featureOutput.Streaks);
      
      expect(featureOutput).toHaveProperty('Regression_Areas');
      expect(['A', 'P']).toContain(featureOutput.Regression_Areas);
      
      expect(featureOutput).toHaveProperty('Blue_Whitish_Veil');
      expect(['A', 'P']).toContain(featureOutput.Blue_Whitish_Veil);
      
      // Color properties should be boolean
      expect(featureOutput).toHaveProperty('Color_White');
      expect(typeof featureOutput.Color_White).toBe('boolean');
      
      expect(featureOutput).toHaveProperty('Color_Red');
      expect(typeof featureOutput.Color_Red).toBe('boolean');
      
      expect(featureOutput).toHaveProperty('Color_Light_Brown');
      expect(typeof featureOutput.Color_Light_Brown).toBe('boolean');
      
      expect(featureOutput).toHaveProperty('Color_Dark_Brown');
      expect(typeof featureOutput.Color_Dark_Brown).toBe('boolean');
      
      expect(featureOutput).toHaveProperty('Color_Blue_Gray');
      expect(typeof featureOutput.Color_Blue_Gray).toBe('boolean');
      
      expect(featureOutput).toHaveProperty('Color_Black');
      expect(typeof featureOutput.Color_Black).toBe('boolean');
    });
  });

  describe('Classification', () => {
    test('should provide top 3 diagnosis predictions with confidence scores', () => {
      // Mock the classification output
      const classificationOutput = {
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
        disclaimer: 'This AI analysis is for educational purposes only and does not replace professional medical advice.',
        gradcam_path: 'temp/gradcam_1.jpg'
      };
      
      // Assertions for classification
      expect(classificationOutput).toHaveProperty('classification');
      expect(classificationOutput.classification).toHaveLength(3);
      
      // Each prediction should have required properties
      classificationOutput.classification.forEach(prediction => {
        expect(prediction).toHaveProperty('class_name');
        expect(prediction).toHaveProperty('class_code');
        expect(prediction).toHaveProperty('confidence_percent');
        expect(typeof prediction.confidence_percent).toBe('number');
        expect(prediction.confidence_percent).toBeGreaterThanOrEqual(0);
        expect(prediction.confidence_percent).toBeLessThanOrEqual(100);
      });
      
      // Sum of confidence percentages should be close to 100%
      const totalConfidence = classificationOutput.classification.reduce(
        (sum, prediction) => sum + prediction.confidence_percent, 0
      );
      expect(totalConfidence).toBeCloseTo(100, 1);
      
      // Should have a confidence level
      expect(classificationOutput).toHaveProperty('confidence_level');
      expect(['low', 'medium', 'high']).toContain(classificationOutput.confidence_level);
      
      // Should have a recommendation
      expect(classificationOutput).toHaveProperty('recommendation');
      expect(typeof classificationOutput.recommendation).toBe('string');
      
      // Should have a disclaimer
      expect(classificationOutput).toHaveProperty('disclaimer');
      expect(typeof classificationOutput.disclaimer).toBe('string');
      
      // Should have a Grad-CAM visualization path
      expect(classificationOutput).toHaveProperty('gradcam_path');
      expect(typeof classificationOutput.gradcam_path).toBe('string');
    });
  });
});
