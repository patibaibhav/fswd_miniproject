import {
  Users,
  DollarSign,
  Clock,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react';
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
import { employees, monthlyExpenses, departmentExpenses } from '../data/mockData';

function AdminDashboard() {
  const totalEmployees = employees.filter((e) => e.status === 'Active').length;
  const totalSalary = employees
    .filter((e) => e.status === 'Active')
    .reduce((sum, e) => sum + e.salary, 0);
  const pendingPayroll = 3;
  const attendanceRate = 94.5;

  const COLORS = ['#fbbf24', '#60a5fa', '#34d399', '#a78bfa', '#f472b6'];

  const stats = [
    {
      title: 'Total Employees',
      value: totalEmployees.toString(),
      iconClass: 'blue',
      icon: <Users size={24} />,
      trend: '+5%',
    },
    {
      title: 'Total Salary Paid',
      value: `$${(totalSalary / 1000).toFixed(0)}K`,
      iconClass: 'amber',
      icon: <DollarSign size={24} />,
      trend: '+12%',
    },
    {
      title: 'Pending Payroll',
      value: pendingPayroll.toString(),
      iconClass: 'orange',
      icon: <Clock size={24} />,
      trend: '-2',
    },
    {
      title: 'Attendance Rate',
      value: `${attendanceRate}%`,
      iconClass: 'purple',
      icon: <TrendingUp size={24} />,
      trend: '+2.3%',
    },
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
        <h1 className="page-title">Dashboard Overview</h1>
        <p className="page-subtitle">
          Welcome back! Here's what's happening with your payroll today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid-4">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-card-header">
              <div className={`stat-icon ${stat.iconClass}`}>{stat.icon}</div>
              <div className="trend-badge positive">
                <ArrowUpRight size={16} />
                {stat.trend}
              </div>
            </div>
            <p className="stat-label">{stat.title}</p>
            <p className="stat-value">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid-2">
        {/* Monthly Salary Expenses */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 className="card-title" style={{ fontSize: '1.125rem' }}>Monthly Salary Expenses</h3>
            <p className="card-subtitle">Last 7 months</p>
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
                name="Salary Expenses"
                dot={{ fill: '#fbbf24', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Department-wise Expenses */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 className="card-title" style={{ fontSize: '1.125rem' }}>Department-wise Expenses</h3>
            <p className="card-subtitle">Current month breakdown</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentExpenses}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
              <XAxis dataKey="department" stroke="#a1a1aa" />
              <YAxis stroke="#a1a1aa" />
              <Tooltip
                formatter={(value) => `$${value.toLocaleString()}`}
                contentStyle={tooltipStyle}
              />
              <Bar dataKey="amount" fill="#fbbf24" name="Amount" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity Row */}
      <div className="grid-2">
        {/* Recent Employees */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 className="card-title" style={{ fontSize: '1.125rem' }}>Recent Employees</h3>
            <p className="card-subtitle">Latest additions to the team</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {employees.slice(0, 5).map((employee) => (
              <div key={employee.id} className="employee-item">
                <div className="employee-item-left">
                  <div className="avatar amber">
                    {employee.name.charAt(0)}
                  </div>
                  <div>
                    <p className="employee-item-name">{employee.name}</p>
                    <p className="employee-item-dept">{employee.department}</p>
                  </div>
                </div>
                <span className={`status-badge ${employee.status === 'Active' ? 'active' : 'inactive'}`}>
                  {employee.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Employee Distribution */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 className="card-title" style={{ fontSize: '1.125rem' }}>Employee Distribution</h3>
            <p className="card-subtitle">By department</p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={departmentExpenses}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ department, percent }) =>
                  `${department} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="amount"
              >
                {departmentExpenses.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
