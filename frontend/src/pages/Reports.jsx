import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Download, FileText, TrendingUp } from 'lucide-react';
import { api } from '../utils/api';

function Reports() {
  const [toast, setToast] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [payslips, setPayslips] = useState([]);
  const [monthlyExpenses, setMonthlyExpenses] = useState([]);
  const [departmentExpenses, setDepartmentExpenses] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [emps, slips, monthly, deptExp, deptCount] = await Promise.all([
          api.get('/employees'),
          api.get('/payslips?year=2026&month=3'),
          api.get('/dashboard/monthly-expenses'),
          api.get('/dashboard/department-expenses'),
          api.get('/dashboard/department-count'),
        ]);
        setEmployees(emps);
        setPayslips(slips);
        setMonthlyExpenses(monthly.length > 0 ? monthly : [
          { month: 'Sep', amount: 520000 }, { month: 'Oct', amount: 540000 },
          { month: 'Nov', amount: 535000 }, { month: 'Dec', amount: 550000 },
          { month: 'Jan', amount: 545000 }, { month: 'Feb', amount: 540000 },
          { month: 'Mar', amount: 535000 },
        ]);
        setDepartmentExpenses(deptExp.length > 0 ? deptExp : [
          { department: 'Engineering', amount: 220000 }, { department: 'Marketing', amount: 125000 },
          { department: 'HR', amount: 70000 }, { department: 'Finance', amount: 65000 },
          { department: 'Sales', amount: 60000 },
        ]);
        setDepartmentData(deptCount);
      } catch (err) {
        console.error('Reports fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalPayroll = payslips.reduce((sum, p) => sum + p.netSalary, 0);
  const averageSalary = payslips.length > 0 ? totalPayroll / payslips.length : 0;
  const highestSalary = payslips.length > 0 ? Math.max(...payslips.map((p) => p.netSalary)) : 0;
  const lowestSalary = payslips.length > 0 ? Math.min(...payslips.map((p) => p.netSalary)) : 0;

  const COLORS = ['#fbbf24', '#60a5fa', '#34d399', '#a78bfa', '#f472b6'];

  const handleDownloadReport = (reportType) => {
    setToast(`Downloading ${reportType} report...`);
    setTimeout(() => setToast(null), 3000);
  };

  const tooltipStyle = {
    backgroundColor: '#27272a',
    border: '1px solid #3f3f46',
    borderRadius: '8px',
    color: '#fafafa',
  };

  if (loading) {
    return (
      <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>Loading reports...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Payroll Reports & Analytics</h1>
          <p className="page-subtitle">View comprehensive payroll insights and trends</p>
        </div>
        <button className="btn btn-primary" onClick={() => handleDownloadReport('Comprehensive')}>
          <Download size={16} />
          Download Full Report
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid-4">
        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <p className="stat-label">Total Payroll</p>
            <div className="stat-icon amber" style={{ padding: '0.625rem' }}>
              <FileText size={20} />
            </div>
          </div>
          <p className="stat-value">${totalPayroll.toLocaleString()}</p>
          <p className="stat-note">March 2026</p>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <p className="stat-label">Average Salary</p>
            <div className="stat-icon green" style={{ padding: '0.625rem' }}>
              <TrendingUp size={20} />
            </div>
          </div>
          <p className="stat-value">${Math.round(averageSalary).toLocaleString()}</p>
          <p className="stat-note">Per employee</p>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <p className="stat-label">Highest Salary</p>
            <div className="stat-icon purple" style={{ padding: '0.625rem' }}>
              <TrendingUp size={20} />
            </div>
          </div>
          <p className="stat-value">${highestSalary.toLocaleString()}</p>
          <p className="stat-note">Individual</p>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <p className="stat-label">Lowest Salary</p>
            <div className="stat-icon orange" style={{ padding: '0.625rem' }}>
              <TrendingUp size={20} />
            </div>
          </div>
          <p className="stat-value">${lowestSalary.toLocaleString()}</p>
          <p className="stat-note">Individual</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid-2">
        {/* Monthly Payroll Trend */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div className="card-header-row" style={{ marginBottom: '1.5rem' }}>
            <div>
              <h3 className="card-title">Monthly Payroll Trend</h3>
              <p className="card-subtitle">Last 7 months</p>
            </div>
            <button className="btn-ghost" onClick={() => handleDownloadReport('Monthly Trend')}>
              <Download size={16} />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyExpenses}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
              <XAxis dataKey="month" stroke="#a1a1aa" />
              <YAxis stroke="#a1a1aa" />
              <Tooltip
                formatter={(value) => `$${value.toLocaleString()}`}
                contentStyle={tooltipStyle}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#fbbf24"
                strokeWidth={2.5}
                name="Payroll"
                dot={{ fill: '#fbbf24', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Department-wise Distribution */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div className="card-header-row" style={{ marginBottom: '1.5rem' }}>
            <div>
              <h3 className="card-title">Department-wise Expenses</h3>
              <p className="card-subtitle">Current month</p>
            </div>
            <button className="btn-ghost" onClick={() => handleDownloadReport('Department Analysis')}>
              <Download size={16} />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={departmentExpenses}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ department, percent }) =>
                  `${department} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="amount"
              >
                {departmentExpenses.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => `$${value.toLocaleString()}`}
                contentStyle={tooltipStyle}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Employee Count by Department */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div className="card-header-row" style={{ marginBottom: '1.5rem' }}>
            <div>
              <h3 className="card-title">Employee Count by Department</h3>
              <p className="card-subtitle">Active employees</p>
            </div>
            <button className="btn-ghost" onClick={() => handleDownloadReport('Employee Count')}>
              <Download size={16} />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
              <XAxis dataKey="department" stroke="#a1a1aa" />
              <YAxis stroke="#a1a1aa" />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" fill="#fbbf24" name="Employees" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Payroll Summary */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 className="card-title">Payroll Summary</h3>
            <p className="card-subtitle">Quick insights</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="summary-row">
              <span className="summary-row-label">Total Active Employees</span>
              <span className="summary-row-value" style={{ color: 'var(--accent)' }}>
                {employees.filter((e) => e.status === 'Active').length}
              </span>
            </div>
            <div className="summary-row">
              <span className="summary-row-label">Total Monthly Payroll</span>
              <span className="summary-row-value" style={{ color: 'var(--success)' }}>
                ${totalPayroll.toLocaleString()}
              </span>
            </div>
            <div className="summary-row">
              <span className="summary-row-label">Average Salary</span>
              <span className="summary-row-value" style={{ color: '#a78bfa' }}>
                ${Math.round(averageSalary).toLocaleString()}
              </span>
            </div>
            <div className="summary-row">
              <span className="summary-row-label">Total Departments</span>
              <span className="summary-row-value" style={{ color: '#fb923c' }}>
                {departmentData.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Employee Payment History */}
      <div className="card">
        <div className="card-header">
          <div className="card-header-row">
            <div>
              <h3 className="card-title">Employee Payment History</h3>
              <p className="card-subtitle">March 2026</p>
            </div>
            <button
              className="btn btn-ghost"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              onClick={() => handleDownloadReport('Payment History')}
            >
              <Download size={16} />
              Export
            </button>
          </div>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Department</th>
                <th className="text-right">Basic Salary</th>
                <th className="text-right">Allowances</th>
                <th className="text-right">Deductions</th>
                <th className="text-right">Net Salary</th>
              </tr>
            </thead>
            <tbody>
              {payslips.map((payslip) => (
                <tr key={payslip.employeeId}>
                  <td className="td-id">{payslip.employeeId}</td>
                  <td className="td-name">{payslip.employeeName}</td>
                  <td className="td-muted">{payslip.department}</td>
                  <td className="text-right td-muted">${payslip.basicSalary.toLocaleString()}</td>
                  <td className="text-right td-success">+${payslip.allowances.toLocaleString()}</td>
                  <td className="text-right td-danger">-${payslip.deductions.toLocaleString()}</td>
                  <td className="text-right td-accent">${payslip.netSalary.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="toast-container">
          <div className="toast">
            <span className="toast-icon">✓</span>
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}

export default Reports;
