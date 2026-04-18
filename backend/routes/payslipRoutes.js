// ─── Payslip Routes ───
const express = require('express');
const router = express.Router();
const { getPayslipsByMonth, getPayslipsByEmployee } = require('../controllers/payslipController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

// GET /api/payslips?year=2026&month=3
router.get('/', getPayslipsByMonth);

// GET /api/payslips/employee/:employeeCode
router.get('/employee/:employeeCode', getPayslipsByEmployee);

module.exports = router;
