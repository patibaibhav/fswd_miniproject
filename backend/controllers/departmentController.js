// ─── Department Controller ───
const { query } = require('../config/db');

// GET /api/departments
const getAllDepartments = async (req, res) => {
  try {
    const result = await query('SELECT id, name FROM departments ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    console.error('Get departments error:', err);
    res.status(500).json({ error: 'Failed to fetch departments.' });
  }
};

module.exports = { getAllDepartments };
