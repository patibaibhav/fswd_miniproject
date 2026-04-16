import {
  DollarSign,
  Calendar,
  FileText,
  TrendingUp,
  User,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { employees, payslips, attendance } from '../data/mockData';

function EmployeeDashboard() {
  // For demo, we'll use John Doe as the logged-in employee
  const currentEmployee = employees[0]; // John Doe
  const currentPayslip = payslips[0];
  const currentAttendance = attendance[0];

  const attendancePercentage = (
    (currentAttendance.present / currentAttendance.totalDays) *
    100
  ).toFixed(1);

  // Mock monthly salary data for the employee
  const monthlySalaryData = [
    { month: 'Sep', salary: 76500 },
    { month: 'Oct', salary: 76500 },
    { month: 'Nov', salary: 76500 },
    { month: 'Dec', salary: 76500 },
    { month: 'Jan', salary: 76500 },
    { month: 'Feb', salary: 76500 },
    { month: 'Mar', salary: currentPayslip.netSalary },
  ];

  const tooltipStyle = {
    backgroundColor: '#27272a',
    border: '1px solid #3f3f46',
    borderRadius: '8px',
    color: '#fafafa',
  };

  return (
    <div className="page-container">
      <div>
        <h1 className="page-title">Welcome, {currentEmployee.name}!</h1>
        <p className="page-subtitle">Here's your payroll summary and information</p>
      </div>

      {/* Profile Card */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
          <div style={{
            width: '4rem', height: '4rem', background: 'var(--accent)',
            borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: 'var(--accent-dark)', flexShrink: 0
          }}>
            <User size={32} />
          </div>
          <div className="grid-4" style={{ flex: 1 }}>
            <div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Employee ID</p>
              <p style={{ fontWeight: 600, marginTop: '0.25rem' }}>{currentEmployee.id}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Email</p>
              <p style={{ fontWeight: 600, marginTop: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentEmployee.email}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Department</p>
              <p style={{ fontWeight: 600, marginTop: '0.25rem' }}>{currentEmployee.department}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Position</p>
              <p style={{ fontWeight: 600, marginTop: '0.25rem' }}>{currentEmployee.position}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid-4">
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-icon amber">
              <DollarSign size={24} />
            </div>
          </div>
          <p className="stat-label">Current Month Salary</p>
          <p className="stat-value">${currentPayslip.netSalary.toLocaleString()}</p>
          <p className="stat-note">March 2026</p>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-icon green">
              <TrendingUp size={24} />
            </div>
          </div>
          <p className="stat-label">Annual Salary</p>
          <p className="stat-value">${currentEmployee.salary.toLocaleString()}</p>
          <p className="stat-note">Base salary</p>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-icon orange">
              <Calendar size={24} />
            </div>
          </div>
          <p className="stat-label">Attendance Rate</p>
          <p className="stat-value">{attendancePercentage}%</p>
          <p className="stat-note">This month</p>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-icon purple">
              <FileText size={24} />
            </div>
          </div>
          <p className="stat-label">Leave Balance</p>
          <p className="stat-value">12 Days</p>
          <p className="stat-note">Available</p>
        </div>
      </div>

      {/* Charts and Details */}
      <div className="grid-2">
        {/* Salary Trend */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 className="card-title">Your Salary Trend</h3>
            <p className="card-subtitle">Last 7 months</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlySalaryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
              <XAxis dataKey="month" stroke="#a1a1aa" />
              <YAxis stroke="#a1a1aa" />
              <Tooltip
                formatter={(value) => `$${value.toLocaleString()}`}
                contentStyle={tooltipStyle}
              />
              <Bar dataKey="salary" fill="#fbbf24" name="Net Salary" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Current Month Breakdown */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 className="card-title">Current Month Breakdown</h3>
            <p className="card-subtitle">March 2026</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div className="detail-row">
              <span style={{ color: 'var(--text-muted)' }}>Basic Salary</span>
              <span style={{ fontWeight: 600 }}>${currentPayslip.basicSalary.toLocaleString()}</span>
            </div>
            <div className="detail-row">
              <span style={{ color: 'var(--text-muted)' }}>Allowances</span>
              <span style={{ fontWeight: 600, color: 'var(--success)' }}>
                +${currentPayslip.allowances.toLocaleString()}
              </span>
            </div>
            <div className="detail-row" style={{ borderTop: '1px solid var(--border-color)' }}>
              <span style={{ fontWeight: 600 }}>Gross Salary</span>
              <span style={{ fontWeight: 700 }}>${currentPayslip.grossSalary.toLocaleString()}</span>
            </div>
            <div className="detail-row">
              <span style={{ color: 'var(--text-muted)' }}>Deductions</span>
              <span style={{ fontWeight: 600, color: 'var(--danger-light)' }}>
                -${currentPayslip.deductions.toLocaleString()}
              </span>
            </div>
            <div className="detail-row highlight">
              <span style={{ fontWeight: 700, fontSize: '1.125rem' }}>Net Salary</span>
              <span style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--accent)' }}>
                ${currentPayslip.netSalary.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Details */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Attendance Summary - March 2026</h3>
        </div>
        <div className="card-body">
          <div className="grid-4">
            <div className="att-stat default">
              <p className="att-stat-label">Total Days</p>
              <p className="att-stat-value">{currentAttendance.totalDays}</p>
            </div>
            <div className="att-stat green">
              <p className="att-stat-label">Present</p>
              <p className="att-stat-value" style={{ color: 'var(--success)' }}>
                {currentAttendance.present}
              </p>
            </div>
            <div className="att-stat red">
              <p className="att-stat-label">Absent</p>
              <p className="att-stat-value" style={{ color: 'var(--danger-light)' }}>
                {currentAttendance.absent}
              </p>
            </div>
            <div className="att-stat amber">
              <p className="att-stat-label">Leave</p>
              <p className="att-stat-value" style={{ color: 'var(--accent)' }}>
                {currentAttendance.leave}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDashboard;
