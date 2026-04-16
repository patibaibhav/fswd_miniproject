// ─── Employee Controller ───
// Demonstrates: Full CRUD REST API, PostgreSQL JOINs, async/await (Modules 5 & 6)

const { query } = require('../config/db');

// GET /api/employees — List all employees (with department & position names)
const getAllEmployees = async (req, res) => {
  try {
    const result = await query(
      `SELECT
         e.employee_code AS id,
         e.id AS uuid,
         e.full_name AS name,
         e.email,
         d.name AS department,
         p.title AS position,
         e.annual_salary AS salary,
         e.status,
         e.joining_date AS "joiningDate"
       FROM employees e
       JOIN departments d ON d.id = e.department_id
       JOIN positions p ON p.id = e.position_id
       ORDER BY e.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Get employees error:', err);
    res.status(500).json({ error: 'Failed to fetch employees.' });
  }
};

// GET /api/employees/:id — Get single employee by employee_code
const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      `SELECT
         e.employee_code AS id,
         e.id AS uuid,
         e.full_name AS name,
         e.email,
         d.name AS department,
         p.title AS position,
         e.annual_salary AS salary,
         e.status,
         e.joining_date AS "joiningDate"
       FROM employees e
       JOIN departments d ON d.id = e.department_id
       JOIN positions p ON p.id = e.position_id
       WHERE e.employee_code = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get employee error:', err);
    res.status(500).json({ error: 'Failed to fetch employee.' });
  }
};

// GET /api/employees/by-uuid/:uuid — Get single employee by UUID (for employee portal)
const getEmployeeByUuid = async (req, res) => {
  try {
    const { uuid } = req.params;
    const result = await query(
      `SELECT
         e.employee_code AS id,
         e.id AS uuid,
         e.full_name AS name,
         e.email,
         d.name AS department,
         p.title AS position,
         e.annual_salary AS salary,
         e.status,
         e.joining_date AS "joiningDate"
       FROM employees e
       JOIN departments d ON d.id = e.department_id
       JOIN positions p ON p.id = e.position_id
       WHERE e.id = $1`,
      [uuid]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get employee by uuid error:', err);
    res.status(500).json({ error: 'Failed to fetch employee.' });
  }
};

// POST /api/employees — Create new employee
const createEmployee = async (req, res) => {
  try {
    const { name, email, department, position, salary, status } = req.body;

    // Find or create department
    let deptResult = await query('SELECT id FROM departments WHERE name = $1', [department]);
    let departmentId;
    if (deptResult.rows.length === 0) {
      deptResult = await query('INSERT INTO departments (name) VALUES ($1) RETURNING id', [department]);
    }
    departmentId = deptResult.rows[0].id;

    // Find or create position
    let posResult = await query(
      'SELECT id FROM positions WHERE title = $1 AND department_id = $2',
      [position, departmentId]
    );
    let positionId;
    if (posResult.rows.length === 0) {
      posResult = await query(
        'INSERT INTO positions (title, department_id) VALUES ($1, $2) RETURNING id',
        [position, departmentId]
      );
    }
    positionId = posResult.rows[0].id;

    // Generate employee code
    const countResult = await query('SELECT COUNT(*) FROM employees');
    const nextNum = parseInt(countResult.rows[0].count) + 1;
    const employeeCode = `EMP${String(nextNum).padStart(3, '0')}`;

    const result = await query(
      `INSERT INTO employees (employee_code, full_name, email, department_id, position_id, annual_salary, status, joining_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_DATE)
       RETURNING id, employee_code`,
      [employeeCode, name, email, departmentId, positionId, salary, status || 'Active']
    );

    // Return the full employee object
    const newEmployee = {
      id: result.rows[0].employee_code,
      uuid: result.rows[0].id,
      name,
      email,
      department,
      position,
      salary: Number(salary),
      status: status || 'Active',
      joiningDate: new Date().toISOString().split('T')[0],
    };

    res.status(201).json(newEmployee);
  } catch (err) {
    console.error('Create employee error:', err);
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Employee with this email already exists.' });
    }
    res.status(500).json({ error: 'Failed to create employee.' });
  }
};

// PUT /api/employees/:id — Update employee
const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, department, position, salary, status } = req.body;

    // Find or create department
    let deptResult = await query('SELECT id FROM departments WHERE name = $1', [department]);
    let departmentId;
    if (deptResult.rows.length === 0) {
      deptResult = await query('INSERT INTO departments (name) VALUES ($1) RETURNING id', [department]);
    }
    departmentId = deptResult.rows[0].id;

    // Find or create position
    let posResult = await query(
      'SELECT id FROM positions WHERE title = $1 AND department_id = $2',
      [position, departmentId]
    );
    let positionId;
    if (posResult.rows.length === 0) {
      posResult = await query(
        'INSERT INTO positions (title, department_id) VALUES ($1, $2) RETURNING id',
        [position, departmentId]
      );
    }
    positionId = posResult.rows[0].id;

    const result = await query(
      `UPDATE employees
       SET full_name = $1, email = $2, department_id = $3, position_id = $4,
           annual_salary = $5, status = $6, updated_at = now()
       WHERE employee_code = $7
       RETURNING id, employee_code, joining_date`,
      [name, email, departmentId, positionId, salary, status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found.' });
    }

    res.json({
      id,
      uuid: result.rows[0].id,
      name,
      email,
      department,
      position,
      salary: Number(salary),
      status,
      joiningDate: result.rows[0].joining_date,
    });
  } catch (err) {
    console.error('Update employee error:', err);
    res.status(500).json({ error: 'Failed to update employee.' });
  }
};

// DELETE /api/employees/:id — Delete employee
const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      'DELETE FROM employees WHERE employee_code = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found.' });
    }

    res.json({ message: 'Employee deleted successfully.' });
  } catch (err) {
    console.error('Delete employee error:', err);
    res.status(500).json({ error: 'Failed to delete employee.' });
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  getEmployeeByUuid,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
