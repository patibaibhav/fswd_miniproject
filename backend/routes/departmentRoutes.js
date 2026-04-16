// ─── Department Routes ───
const express = require('express');
const router = express.Router();
const { getAllDepartments } = require('../controllers/departmentController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', getAllDepartments);

module.exports = router;
