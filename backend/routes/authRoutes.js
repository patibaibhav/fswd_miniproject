// ─── Auth Routes ───
// Demonstrates: Express Router (Module 6)

const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/authController');

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/register
router.post('/register', register);

module.exports = router;
