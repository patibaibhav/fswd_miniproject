// ─── Attendance Controller ───
// Demonstrates: PostgreSQL queries with JOINs, parameterized queries (Module 5)

const { query } = require('../config/db');

// GET /api/attendance?year=2026&month=3
const getMonthlyAttendance = async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const month = parseInt(req.query.month) || new Date().getMonth() + 1;

    const result = await query(
      `SELECT
         e.employee_code AS "employeeId",
         e.full_name AS "employeeName",
         a.total_days AS "totalDays",
         a.present_days AS present,
         a.absent_days AS absent,
         a.leave_days AS leave
       FROM attendance_monthly a
       JOIN employees e ON e.id = a.employee_id
       WHERE a.pay_year = $1 AND a.pay_month = $2
       ORDER BY e.employee_code`,
      [year, month]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Get attendance error:', err);
    res.status(500).json({ error: 'Failed to fetch attendance.' });
  }
};

// GET /api/attendance/employee/:employeeCode?year=2026&month=3
const getEmployeeAttendance = async (req, res) => {
  try {
    const { employeeCode } = req.params;
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const month = parseInt(req.query.month) || new Date().getMonth() + 1;

    const result = await query(
      `SELECT
         e.employee_code AS "employeeId",
         e.full_name AS "employeeName",
         a.total_days AS "totalDays",
         a.present_days AS present,
         a.absent_days AS absent,
         a.leave_days AS leave
       FROM attendance_monthly a
       JOIN employees e ON e.id = a.employee_id
       WHERE e.employee_code = $1 AND a.pay_year = $2 AND a.pay_month = $3`,
      [employeeCode, year, month]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Attendance record not found.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get employee attendance error:', err);
    res.status(500).json({ error: 'Failed to fetch attendance.' });
  }
};

// PUT /api/attendance/:employeeId — Update attendance record
const updateAttendance = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { present, absent, leave } = req.body;
    const year = parseInt(req.body.year) || new Date().getFullYear();
    const month = parseInt(req.body.month) || new Date().getMonth() + 1;

    // Find employee UUID from employee_code
    const empResult = await query(
      'SELECT id FROM employees WHERE employee_code = $1',
      [employeeId]
    );
    if (empResult.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found.' });
    }
    const empUuid = empResult.rows[0].id;

    const result = await query(
      `UPDATE attendance_monthly
       SET present_days = $1, absent_days = $2, leave_days = $3, updated_at = now()
       WHERE employee_id = $4 AND pay_year = $5 AND pay_month = $6
       RETURNING *`,
      [present, absent, leave, empUuid, year, month]
    );

    if (result.rows.length === 0) {
      // Insert if not exists
      await query(
        `INSERT INTO attendance_monthly (employee_id, pay_year, pay_month, total_days, present_days, absent_days, leave_days)
         VALUES ($1, $2, $3, 22, $4, $5, $6)`,
        [empUuid, year, month, present, absent, leave]
      );
    }

    res.json({ message: 'Attendance updated successfully.' });
  } catch (err) {
    console.error('Update attendance error:', err);
    res.status(500).json({ error: 'Failed to update attendance.' });
  }
};

module.exports = { getMonthlyAttendance, getEmployeeAttendance, updateAttendance };
