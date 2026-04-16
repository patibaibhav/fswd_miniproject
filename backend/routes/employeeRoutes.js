// ─── Employee Routes ───
// Demonstrates: Express Router, REST API with full CRUD (Module 6)

const express = require('express');
const router = express.Router();
const {
  getAllEmployees,
  getEmployeeById,
  getEmployeeByUuid,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employeeController');
const { authenticateToken } = require('../middleware/auth');

// All routes are protected
router.use(authenticateToken);

// GET /api/employees
router.get('/', getAllEmployees);

// GET /api/employees/by-uuid/:uuid
router.get('/by-uuid/:uuid', getEmployeeByUuid);

// GET /api/employees/:id
router.get('/:id', getEmployeeById);

// POST /api/employees
router.post('/', createEmployee);

// PUT /api/employees/:id
router.put('/:id', updateEmployee);

// DELETE /api/employees/:id
router.delete('/:id', deleteEmployee);

module.exports = router;
