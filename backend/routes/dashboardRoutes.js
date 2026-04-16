// ─── Dashboard Routes ───
const express = require('express');
const router = express.Router();
const {
  getStats,
  getMonthlyExpenses,
  getDepartmentExpenses,
  getDepartmentCount,
  getLeaveBalance,
} = require('../controllers/dashboardController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

// GET /api/dashboard/stats
router.get('/stats', getStats);

// GET /api/dashboard/monthly-expenses
router.get('/monthly-expenses', getMonthlyExpenses);

// GET /api/dashboard/department-expenses
router.get('/department-expenses', getDepartmentExpenses);

// GET /api/dashboard/department-count
router.get('/department-count', getDepartmentCount);

// GET /api/dashboard/leave-balance/:employeeCode
router.get('/leave-balance/:employeeCode', getLeaveBalance);

module.exports = router;
