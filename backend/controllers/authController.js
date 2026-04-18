// ─── Authentication Controller ───
// Demonstrates: bcrypt password hashing, JWT token generation (Module 6)

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/db');

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Find user by email with role name
    const result = await query(
      `SELECT u.id, u.email, u.password_hash, u.employee_id, r.name AS role
       FROM users u
       JOIN roles r ON r.id = u.role_id
       WHERE u.email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user = result.rows[0];

    // Compare password with hash
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Get employee details if linked
    let employeeName = 'Admin User';
    let employeePosition = 'Administrator';
    if (user.employee_id) {
      const empResult = await query(
        `SELECT e.full_name, p.title AS position FROM employees e
         JOIN positions p ON p.id = e.position_id
         WHERE e.id = $1`,
        [user.employee_id]
      );
      if (empResult.rows.length > 0) {
        employeeName = empResult.rows[0].full_name;
        employeePosition = empResult.rows[0].position;
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        employeeId: user.employee_id,
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        employeeId: user.employee_id,
        name: employeeName,
        position: employeePosition,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// POST /api/auth/register (for seeding/admin use)
const register = async (req, res) => {
  try {
    const { email, password, roleId, employeeId } = req.body;

    if (!email || !password || !roleId) {
      return res.status(400).json({ error: 'Email, password, and roleId are required.' });
    }

    // Check if user already exists
    const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'User already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const result = await query(
      `INSERT INTO users (email, password_hash, role_id, employee_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email`,
      [email, passwordHash, roleId, employeeId || null]
    );

    res.status(201).json({ message: 'User registered successfully.', user: result.rows[0] });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

module.exports = { login, register };
