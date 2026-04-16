// ─── Database Seed Script ───
// Populates the database with demo data matching the frontend's mockData.js
// Run with: node seed.js

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { pool } = require('./config/db');

const seed = async () => {
  const client = await pool.connect();

  try {
    console.log('🌱 Starting database seed...\n');

    await client.query('BEGIN');

    // ─── 1. Roles ───
    console.log('📌 Seeding roles...');
    await client.query(`
      INSERT INTO roles (name) VALUES ('admin'), ('employee')
      ON CONFLICT (name) DO NOTHING
    `);

    // ─── 2. Departments ───
    console.log('📌 Seeding departments...');
    const departments = ['Engineering', 'Marketing', 'HR', 'Finance', 'Sales'];
    for (const dept of departments) {
      await client.query(
        'INSERT INTO departments (name) VALUES ($1) ON CONFLICT (name) DO NOTHING',
        [dept]
      );
    }

    // Get department IDs
    const deptResult = await client.query('SELECT id, name FROM departments ORDER BY id');
    const deptMap = {};
    deptResult.rows.forEach(d => { deptMap[d.name] = d.id; });

    // ─── 3. Positions ───
    console.log('📌 Seeding positions...');
    const positions = [
      { title: 'Senior Developer', dept: 'Engineering' },
      { title: 'Marketing Manager', dept: 'Marketing' },
      { title: 'DevOps Engineer', dept: 'Engineering' },
      { title: 'HR Manager', dept: 'HR' },
      { title: 'Accountant', dept: 'Finance' },
      { title: 'Junior Developer', dept: 'Engineering' },
      { title: 'Sales Executive', dept: 'Sales' },
      { title: 'Content Writer', dept: 'Marketing' },
    ];

    for (const pos of positions) {
      await client.query(
        `INSERT INTO positions (title, department_id) VALUES ($1, $2)
         ON CONFLICT (title, department_id) DO NOTHING`,
        [pos.title, deptMap[pos.dept]]
      );
    }

    // Get position IDs
    const posResult = await client.query('SELECT id, title, department_id FROM positions');
    const posMap = {};
    posResult.rows.forEach(p => { posMap[`${p.title}_${p.department_id}`] = p.id; });

    // ─── 4. Employees ───
    console.log('📌 Seeding employees...');
    const employees = [
      { code: 'EMP001', name: 'John Doe', email: 'john.doe@company.com', dept: 'Engineering', pos: 'Senior Developer', salary: 85000, status: 'Active', date: '2022-01-15' },
      { code: 'EMP002', name: 'Sarah Smith', email: 'sarah.smith@company.com', dept: 'Marketing', pos: 'Marketing Manager', salary: 75000, status: 'Active', date: '2021-06-20' },
      { code: 'EMP003', name: 'Michael Johnson', email: 'michael.johnson@company.com', dept: 'Engineering', pos: 'DevOps Engineer', salary: 80000, status: 'Active', date: '2022-03-10' },
      { code: 'EMP004', name: 'Emily Davis', email: 'emily.davis@company.com', dept: 'HR', pos: 'HR Manager', salary: 70000, status: 'Active', date: '2020-09-01' },
      { code: 'EMP005', name: 'David Wilson', email: 'david.wilson@company.com', dept: 'Finance', pos: 'Accountant', salary: 65000, status: 'Active', date: '2023-02-14' },
      { code: 'EMP006', name: 'Lisa Anderson', email: 'lisa.anderson@company.com', dept: 'Engineering', pos: 'Junior Developer', salary: 55000, status: 'Active', date: '2023-07-01' },
      { code: 'EMP007', name: 'Robert Brown', email: 'robert.brown@company.com', dept: 'Sales', pos: 'Sales Executive', salary: 60000, status: 'Inactive', date: '2021-11-05' },
      { code: 'EMP008', name: 'Jennifer Taylor', email: 'jennifer.taylor@company.com', dept: 'Marketing', pos: 'Content Writer', salary: 50000, status: 'Active', date: '2023-01-20' },
    ];

    const employeeIds = {};
    for (const emp of employees) {
      const deptId = deptMap[emp.dept];
      const posId = posMap[`${emp.pos}_${deptId}`];

      const result = await client.query(
        `INSERT INTO employees (employee_code, full_name, email, department_id, position_id, annual_salary, status, joining_date)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (employee_code) DO UPDATE SET full_name = $2
         RETURNING id`,
        [emp.code, emp.name, emp.email, deptId, posId, emp.salary, emp.status, emp.date]
      );
      employeeIds[emp.code] = result.rows[0].id;
    }

    // ─── 5. Attendance (March 2026) ───
    console.log('📌 Seeding attendance...');
    const attendanceData = [
      { code: 'EMP001', present: 21, absent: 0, leave: 1 },
      { code: 'EMP002', present: 20, absent: 1, leave: 1 },
      { code: 'EMP003', present: 22, absent: 0, leave: 0 },
      { code: 'EMP004', present: 20, absent: 1, leave: 1 },
      { code: 'EMP005', present: 21, absent: 1, leave: 0 },
      { code: 'EMP006', present: 20, absent: 0, leave: 2 },
      { code: 'EMP007', present: 18, absent: 2, leave: 2 },
      { code: 'EMP008', present: 21, absent: 0, leave: 1 },
    ];

    for (const att of attendanceData) {
      await client.query(
        `INSERT INTO attendance_monthly (employee_id, pay_year, pay_month, total_days, present_days, absent_days, leave_days)
         VALUES ($1, 2026, 3, 22, $2, $3, $4)
         ON CONFLICT (employee_id, pay_year, pay_month) DO UPDATE
         SET present_days = $2, absent_days = $3, leave_days = $4`,
        [employeeIds[att.code], att.present, att.absent, att.leave]
      );
    }

    // ─── 6. Payroll Periods & Items ───
    console.log('📌 Seeding payroll...');

    // Create payroll periods for Sep 2025 to Mar 2026
    const periods = [
      { year: 2025, month: 9, label: 'September 2025' },
      { year: 2025, month: 10, label: 'October 2025' },
      { year: 2025, month: 11, label: 'November 2025' },
      { year: 2025, month: 12, label: 'December 2025' },
      { year: 2026, month: 1, label: 'January 2026' },
      { year: 2026, month: 2, label: 'February 2026' },
      { year: 2026, month: 3, label: 'March 2026' },
    ];

    for (const period of periods) {
      const periodResult = await client.query(
        `INSERT INTO payroll_periods (pay_year, pay_month, period_label, status)
         VALUES ($1, $2, $3, 'calculated')
         ON CONFLICT (pay_year, pay_month) DO UPDATE SET status = 'calculated'
         RETURNING id`,
        [period.year, period.month, period.label]
      );
      const periodId = periodResult.rows[0].id;

      // Create payroll items for all active employees
      for (const emp of employees) {
        if (emp.status === 'Active') {
          const basicSalary = emp.salary;
          const allowances = Math.round(basicSalary * 0.2);
          const deductions = Math.round(basicSalary * 0.1);

          await client.query(
            `INSERT INTO payroll_items (payroll_period_id, employee_id, basic_salary, allowances, deductions)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (payroll_period_id, employee_id) DO UPDATE
             SET basic_salary = $3, allowances = $4, deductions = $5`,
            [periodId, employeeIds[emp.code], basicSalary, allowances, deductions]
          );
        }
      }
    }

    // ─── 7. Leave Balances ───
    console.log('📌 Seeding leave balances...');
    for (const emp of employees) {
      const used = Math.floor(Math.random() * 10) + 3;
      await client.query(
        `INSERT INTO leave_balances (employee_id, leave_year, total_allocated, used_days)
         VALUES ($1, 2026, 20, $2)
         ON CONFLICT (employee_id, leave_year) DO UPDATE SET used_days = $2`,
        [employeeIds[emp.code], used]
      );
    }

    // ─── 8. Users (login accounts) ───
    console.log('📌 Seeding users...');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    // Get role IDs
    const roleResult = await client.query('SELECT id, name FROM roles');
    const roleMap = {};
    roleResult.rows.forEach(r => { roleMap[r.name] = r.id; });

    // Admin user
    await client.query(
      `INSERT INTO users (email, password_hash, role_id, employee_id)
       VALUES ($1, $2, $3, NULL)
       ON CONFLICT (email) DO UPDATE SET password_hash = $2`,
      ['admin@company.com', passwordHash, roleMap['admin']]
    );

    // Employee user (linked to John Doe - EMP001)
    await client.query(
      `INSERT INTO users (email, password_hash, role_id, employee_id)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO UPDATE SET password_hash = $2`,
      ['employee@company.com', passwordHash, roleMap['employee'], employeeIds['EMP001']]
    );

    await client.query('COMMIT');

    console.log('\n✅ Database seeded successfully!');
    console.log('──────────────────────────────────');
    console.log('Demo Login Credentials:');
    console.log('  Admin:    admin@company.com / password123');
    console.log('  Employee: employee@company.com / password123');
    console.log('──────────────────────────────────');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Seed failed:', err);
  } finally {
    client.release();
    await pool.end();
  }
};

seed();
