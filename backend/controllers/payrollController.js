// ─── Payroll Controller ───
// Demonstrates: Complex SQL queries, computed columns, async programming (Module 5)

const { query } = require('../config/db');

// GET /api/payroll?year=2026&month=3
const getPayrollByMonth = async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const month = parseInt(req.query.month) || new Date().getMonth() + 1;

    const result = await query(
      `SELECT
         e.employee_code AS "employeeId",
         e.full_name AS "employeeName",
         pi.basic_salary AS "basicSalary",
         pi.allowances,
         pi.gross_salary AS "grossSalary",
         pi.deductions,
         pi.net_salary AS "netSalary"
       FROM payroll_items pi
       JOIN payroll_periods pp ON pp.id = pi.payroll_period_id
       JOIN employees e ON e.id = pi.employee_id
       WHERE pp.pay_year = $1 AND pp.pay_month = $2
       ORDER BY e.employee_code`,
      [year, month]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Get payroll error:', err);
    res.status(500).json({ error: 'Failed to fetch payroll data.' });
  }
};

// POST /api/payroll/calculate — Calculate salaries for all employees for a given period
const calculatePayroll = async (req, res) => {
  try {
    const year = parseInt(req.body.year) || new Date().getFullYear();
    const month = parseInt(req.body.month) || new Date().getMonth() + 1;

    const monthNames = ['', 'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    const periodLabel = `${monthNames[month]} ${year}`;

    // Create or get payroll period
    let periodResult = await query(
      'SELECT id FROM payroll_periods WHERE pay_year = $1 AND pay_month = $2',
      [year, month]
    );

    let periodId;
    if (periodResult.rows.length === 0) {
      periodResult = await query(
        `INSERT INTO payroll_periods (pay_year, pay_month, period_label, status)
         VALUES ($1, $2, $3, 'calculated')
         RETURNING id`,
        [year, month, periodLabel]
      );
      periodId = periodResult.rows[0].id;
    } else {
      periodId = periodResult.rows[0].id;
      // Clear existing items for recalculation
      await query('DELETE FROM payroll_items WHERE payroll_period_id = $1', [periodId]);
      await query(
        "UPDATE payroll_periods SET status = 'calculated', updated_at = now() WHERE id = $1",
        [periodId]
      );
    }

    // Get all active employees
    const employees = await query(
      "SELECT id, annual_salary FROM employees WHERE status = 'Active'"
    );

    // Calculate salary for each employee
    // Formula: basic = annual_salary, allowances = 20%, deductions = 10%
    for (const emp of employees.rows) {
      const basicSalary = parseFloat(emp.annual_salary);
      const allowances = Math.round(basicSalary * 0.2);
      const deductions = Math.round(basicSalary * 0.1);

      await query(
        `INSERT INTO payroll_items (payroll_period_id, employee_id, basic_salary, allowances, deductions)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (payroll_period_id, employee_id) DO UPDATE
         SET basic_salary = $3, allowances = $4, deductions = $5, updated_at = now()`,
        [periodId, emp.id, basicSalary, allowances, deductions]
      );
    }

    res.json({
      message: `Salary calculated successfully for ${employees.rows.length} employees.`,
      period: periodLabel,
      employeeCount: employees.rows.length,
    });
  } catch (err) {
    console.error('Calculate payroll error:', err);
    res.status(500).json({ error: 'Failed to calculate payroll.' });
  }
};

module.exports = { getPayrollByMonth, calculatePayroll };
