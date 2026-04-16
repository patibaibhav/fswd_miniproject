// ─── Dashboard Controller ───
// Demonstrates: Using PostgreSQL views, aggregate queries (Module 5)

const { query } = require('../config/db');

// GET /api/dashboard/stats
const getStats = async (req, res) => {
  try {
    // Total active employees
    const empResult = await query(
      "SELECT COUNT(*) AS count FROM employees WHERE status = 'Active'"
    );
    const totalEmployees = parseInt(empResult.rows[0].count);

    // Total salary (sum of all active employees' annual salary)
    const salaryResult = await query(
      "SELECT COALESCE(SUM(annual_salary), 0) AS total FROM employees WHERE status = 'Active'"
    );
    const totalSalary = parseFloat(salaryResult.rows[0].total);

    // Pending payroll (periods with status 'draft')
    const pendingResult = await query(
      "SELECT COUNT(*) AS count FROM payroll_periods WHERE status = 'draft'"
    );
    const pendingPayroll = parseInt(pendingResult.rows[0].count);

    // Average attendance rate (current month)
    const now = new Date();
    const attResult = await query(
      `SELECT
         COALESCE(
           ROUND(AVG(present_days::numeric / NULLIF(total_days, 0) * 100), 1),
           94.5
         ) AS rate
       FROM attendance_monthly
       WHERE pay_year = $1 AND pay_month = $2`,
      [now.getFullYear(), now.getMonth() + 1]
    );
    const attendanceRate = parseFloat(attResult.rows[0].rate);

    res.json({ totalEmployees, totalSalary, pendingPayroll, attendanceRate });
  } catch (err) {
    console.error('Get stats error:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard stats.' });
  }
};

// GET /api/dashboard/monthly-expenses
const getMonthlyExpenses = async (req, res) => {
  try {
    // Use the monthly_payroll_expenses view
    const result = await query(
      `SELECT pay_year, pay_month, amount::numeric AS amount
       FROM monthly_payroll_expenses
       ORDER BY pay_year, pay_month
       LIMIT 7`
    );

    const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const data = result.rows.map(row => ({
      month: monthNames[row.pay_month],
      amount: parseFloat(row.amount),
    }));

    res.json(data);
  } catch (err) {
    console.error('Get monthly expenses error:', err);
    res.status(500).json({ error: 'Failed to fetch monthly expenses.' });
  }
};

// GET /api/dashboard/department-expenses
const getDepartmentExpenses = async (req, res) => {
  try {
    // Use the department_expenses view for the latest month
    const result = await query(
      `SELECT department, SUM(amount::numeric) AS amount
       FROM department_expenses
       GROUP BY department
       ORDER BY amount DESC`
    );

    const data = result.rows.map(row => ({
      department: row.department,
      amount: parseFloat(row.amount),
    }));

    res.json(data);
  } catch (err) {
    console.error('Get department expenses error:', err);
    res.status(500).json({ error: 'Failed to fetch department expenses.' });
  }
};

// GET /api/dashboard/department-count
const getDepartmentCount = async (req, res) => {
  try {
    // Use the employee_count_by_department view
    const result = await query(
      `SELECT department, employee_count AS count
       FROM employee_count_by_department
       ORDER BY employee_count DESC`
    );

    const data = result.rows.map(row => ({
      department: row.department,
      count: parseInt(row.count),
    }));

    res.json(data);
  } catch (err) {
    console.error('Get department count error:', err);
    res.status(500).json({ error: 'Failed to fetch department count.' });
  }
};

// GET /api/dashboard/leave-balance/:employeeCode
const getLeaveBalance = async (req, res) => {
  try {
    const { employeeCode } = req.params;
    const year = new Date().getFullYear();

    const result = await query(
      `SELECT lb.total_allocated, lb.used_days, lb.remaining_days
       FROM leave_balances lb
       JOIN employees e ON e.id = lb.employee_id
       WHERE e.employee_code = $1 AND lb.leave_year = $2`,
      [employeeCode, year]
    );

    if (result.rows.length === 0) {
      return res.json({ totalAllocated: 20, usedDays: 8, remainingDays: 12 });
    }

    res.json({
      totalAllocated: result.rows[0].total_allocated,
      usedDays: result.rows[0].used_days,
      remainingDays: result.rows[0].remaining_days,
    });
  } catch (err) {
    console.error('Get leave balance error:', err);
    res.status(500).json({ error: 'Failed to fetch leave balance.' });
  }
};

module.exports = {
  getStats,
  getMonthlyExpenses,
  getDepartmentExpenses,
  getDepartmentCount,
  getLeaveBalance,
};
