// ─── Payroll Routes ───
const express = require('express');
const router = express.Router();
const { getPayrollByMonth, calculatePayroll } = require('../controllers/payrollController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

// GET /api/payroll?year=2026&month=3
router.get('/', getPayrollByMonth);

// POST /api/payroll/calculate
router.post('/calculate', calculatePayroll);

module.exports = router;
