CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE departments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE positions (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  department_id INTEGER NULL REFERENCES departments(id),
  UNIQUE (title, department_id)
);

CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_code VARCHAR(20) NOT NULL UNIQUE,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  department_id INTEGER NOT NULL REFERENCES departments(id),
  position_id INTEGER NOT NULL REFERENCES positions(id),
  annual_salary NUMERIC(12,2) NOT NULL CHECK (annual_salary >= 0),
  status VARCHAR(20) NOT NULL CHECK (status IN ('Active', 'Inactive')),
  joining_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role_id INTEGER NOT NULL REFERENCES roles(id),
  employee_id UUID NULL UNIQUE REFERENCES employees(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE attendance_monthly (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  pay_year INTEGER NOT NULL CHECK (pay_year >= 2000),
  pay_month INTEGER NOT NULL CHECK (pay_month BETWEEN 1 AND 12),
  total_days INTEGER NOT NULL CHECK (total_days >= 0),
  present_days INTEGER NOT NULL CHECK (present_days >= 0),
  absent_days INTEGER NOT NULL CHECK (absent_days >= 0),
  leave_days INTEGER NOT NULL CHECK (leave_days >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (employee_id, pay_year, pay_month),
  CHECK (present_days + absent_days + leave_days <= total_days)
);

CREATE TABLE payroll_periods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pay_year INTEGER NOT NULL CHECK (pay_year >= 2000),
  pay_month INTEGER NOT NULL CHECK (pay_month BETWEEN 1 AND 12),
  period_label VARCHAR(30) NOT NULL,
  payment_date DATE NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'calculated', 'paid', 'closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (pay_year, pay_month)
);

CREATE TABLE payroll_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payroll_period_id UUID NOT NULL REFERENCES payroll_periods(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id),
  basic_salary NUMERIC(12,2) NOT NULL CHECK (basic_salary >= 0),
  allowances NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (allowances >= 0),
  deductions NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (deductions >= 0),
  gross_salary NUMERIC(12,2) GENERATED ALWAYS AS (basic_salary + allowances) STORED,
  net_salary NUMERIC(12,2) GENERATED ALWAYS AS (basic_salary + allowances - deductions) STORED,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (payroll_period_id, employee_id)
);

CREATE TABLE payslips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payroll_item_id UUID NOT NULL UNIQUE REFERENCES payroll_items(id) ON DELETE CASCADE,
  payslip_number VARCHAR(50) NOT NULL UNIQUE,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  downloaded_at TIMESTAMPTZ NULL,
  pdf_url TEXT NULL
);

CREATE TABLE leave_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  leave_year INTEGER NOT NULL CHECK (leave_year >= 2000),
  total_allocated INTEGER NOT NULL DEFAULT 0 CHECK (total_allocated >= 0),
  used_days INTEGER NOT NULL DEFAULT 0 CHECK (used_days >= 0),
  remaining_days INTEGER GENERATED ALWAYS AS (total_allocated - used_days) STORED,
  UNIQUE (employee_id, leave_year)
);

CREATE VIEW monthly_payroll_expenses AS
SELECT
  pp.pay_year,
  pp.pay_month,
  SUM(pi.net_salary) AS amount
FROM payroll_periods pp
JOIN payroll_items pi ON pi.payroll_period_id = pp.id
GROUP BY pp.pay_year, pp.pay_month;

CREATE VIEW department_expenses AS
SELECT
  pp.pay_year,
  pp.pay_month,
  d.name AS department,
  SUM(pi.net_salary) AS amount
FROM payroll_periods pp
JOIN payroll_items pi ON pi.payroll_period_id = pp.id
JOIN employees e ON e.id = pi.employee_id
JOIN departments d ON d.id = e.department_id
GROUP BY pp.pay_year, pp.pay_month, d.name;

CREATE VIEW employee_count_by_department AS
SELECT
  d.name AS department,
  COUNT(e.id) AS employee_count
FROM departments d
LEFT JOIN employees e ON e.department_id = d.id
GROUP BY d.name;

SELECT tablename
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN (
  'roles',
  'users',
  'departments',
  'positions',
  'employees',
  'attendance_monthly',
  'payroll_periods',
  'payroll_items',
  'payslips',
  'leave_balances'
)
ORDER BY tablename;
