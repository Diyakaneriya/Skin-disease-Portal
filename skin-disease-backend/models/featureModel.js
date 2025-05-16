const db = require('../config/db');

const featureModel = {
  async create(imageId, features) {
    const {
      asymmetry,
      pigment_network,
      dots_globules,
      streaks,
      regression_areas,
      blue_whitish_veil,
      color_white,
      color_red,
      color_light_brown,
      color_dark_brown,
      color_blue_gray,
      color_black
    } = features;

    const [result] = await db.execute(
      `INSERT INTO image_features (
        image_id, asymmetry, pigment_network, dots_globules, streaks, 
        regression_areas, blue_whitish_veil, color_white, color_red, 
        color_light_brown, color_dark_brown, color_blue_gray, color_black
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        imageId, 
        asymmetry || 0, 
        pigment_network || 'unknown', 
        dots_globules || 'unknown', 
        streaks || 'unknown', 
        regression_areas || 'unknown', 
        blue_whitish_veil || 'unknown', 
        color_white ? 1 : 0, 
        color_red ? 1 : 0, 
        color_light_brown ? 1 : 0, 
        color_dark_brown ? 1 : 0, 
        color_blue_gray ? 1 : 0, 
        color_black ? 1 : 0
      ]
    );
    return result.insertId;
  },

  async findByImageId(imageId) {
    const [rows] = await db.execute(
      'SELECT * FROM image_features WHERE image_id = ?',
      [imageId]
    );
    return rows[0];
  },

  async update(featureId, features) {
    const {
      asymmetry,
      pigment_network,
      dots_globules,
      streaks,
      regression_areas,
      blue_whitish_veil,
      color_white,
      color_red,
      color_light_brown,
      color_dark_brown,
      color_blue_gray,
      color_black
    } = features;

    await db.execute(
      `UPDATE image_features SET 
        asymmetry = ?, 
        pigment_network = ?, 
        dots_globules = ?, 
        streaks = ?, 
        regression_areas = ?, 
        blue_whitish_veil = ?, 
        color_white = ?, 
        color_red = ?, 
        color_light_brown = ?, 
        color_dark_brown = ?, 
        color_blue_gray = ?, 
        color_black = ?
      WHERE id = ?`,
      [
        asymmetry || 0, 
        pigment_network || 'unknown', 
        dots_globules || 'unknown', 
        streaks || 'unknown', 
        regression_areas || 'unknown', 
        blue_whitish_veil || 'unknown', 
        color_white ? 1 : 0, 
        color_red ? 1 : 0, 
        color_light_brown ? 1 : 0, 
        color_dark_brown ? 1 : 0, 
        color_blue_gray ? 1 : 0, 
        color_black ? 1 : 0,
        featureId
      ]
    );
    return true;
  }
};

module.exports = featureModel;
