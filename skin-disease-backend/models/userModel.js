const db = require('../config/db');
const bcrypt = require('bcrypt');

const userModel = {
  async create(name, email, password, role = 'patient') {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );
    return result.insertId;
  },

  async findByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },

  async findById(id) {
    const [rows] = await db.execute('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [id]);
    return rows[0];
  }
};

module.exports = userModel;