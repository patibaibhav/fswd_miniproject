// ─── Payslip Controller ───
const { query } = require('../config/db');

// GET /api/payslips?year=2026&month=3
const getPayslipsByMonth = async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const month = parseInt(req.query.month) || new Date().getMonth() + 1;

    const monthNames = ['', 'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];

    const result = await query(
      `SELECT
         e.employee_code AS "employeeId",
         e.full_name AS "employeeName",
         d.name AS department,
         p.title AS position,
         pi.basic_salary AS "basicSalary",
         pi.allowances,
         pi.gross_salary AS "grossSalary",
         pi.deductions,
         pi.net_salary AS "netSalary",
         pp.pay_year AS year,
         pp.pay_month
       FROM payroll_items pi
       JOIN payroll_periods pp ON pp.id = pi.payroll_period_id
       JOIN employees e ON e.id = pi.employee_id
       JOIN departments d ON d.id = e.department_id
       JOIN positions p ON p.id = e.position_id
       WHERE pp.pay_year = $1 AND pp.pay_month = $2
       ORDER BY e.employee_code`,
      [year, month]
    );

    // Add month name
    const payslips = result.rows.map(row => ({
      ...row,
      month: monthNames[row.pay_month],
      basicSalary: parseFloat(row.basicSalary),
      allowances: parseFloat(row.allowances),
      grossSalary: parseFloat(row.grossSalary),
      deductions: parseFloat(row.deductions),
      netSalary: parseFloat(row.netSalary),
      year: row.year,
    }));

    res.json(payslips);
  } catch (err) {
    console.error('Get payslips error:', err);
    res.status(500).json({ error: 'Failed to fetch payslips.' });
  }
};

// GET /api/payslips/employee/:employeeCode
const getPayslipsByEmployee = async (req, res) => {
  try {
    const { employeeCode } = req.params;

    const monthNames = ['', 'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];

    const result = await query(
      `SELECT
         e.employee_code AS "employeeId",
         e.full_name AS "employeeName",
         d.name AS department,
         p.title AS position,
         pi.basic_salary AS "basicSalary",
         pi.allowances,
         pi.gross_salary AS "grossSalary",
         pi.deductions,
         pi.net_salary AS "netSalary",
         pp.pay_year AS year,
         pp.pay_month
       FROM payroll_items pi
       JOIN payroll_periods pp ON pp.id = pi.payroll_period_id
       JOIN employees e ON e.id = pi.employee_id
       JOIN departments d ON d.id = e.department_id
       JOIN positions p ON p.id = e.position_id
       WHERE e.employee_code = $1
       ORDER BY pp.pay_year DESC, pp.pay_month DESC`,
      [employeeCode]
    );

    const payslips = result.rows.map(row => ({
      ...row,
      month: monthNames[row.pay_month],
      basicSalary: parseFloat(row.basicSalary),
      allowances: parseFloat(row.allowances),
      grossSalary: parseFloat(row.grossSalary),
      deductions: parseFloat(row.deductions),
      netSalary: parseFloat(row.netSalary),
      year: row.year,
    }));

    res.json(payslips);
  } catch (err) {
    console.error('Get employee payslips error:', err);
    res.status(500).json({ error: 'Failed to fetch payslips.' });
  }
};

module.exports = { getPayslipsByMonth, getPayslipsByEmployee };
