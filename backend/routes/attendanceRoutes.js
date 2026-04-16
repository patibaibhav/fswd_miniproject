// ─── Attendance Routes ───
const express = require('express');
const router = express.Router();
const {
  getMonthlyAttendance,
  getEmployeeAttendance,
  updateAttendance,
} = require('../controllers/attendanceController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

// GET /api/attendance?year=2026&month=3
router.get('/', getMonthlyAttendance);

// GET /api/attendance/employee/:employeeCode
router.get('/employee/:employeeCode', getEmployeeAttendance);

// PUT /api/attendance/:employeeId
router.put('/:employeeId', updateAttendance);

module.exports = router;
