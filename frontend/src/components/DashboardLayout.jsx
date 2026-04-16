import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  DollarSign,
  FileText,
  BarChart3,
  LogOut,
  User,
  Menu,
} from 'lucide-react';
import '../styles/DashboardLayout.css';

function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isAdmin = location.pathname.startsWith('/admin');

  const adminNavItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin' },
    { name: 'Employees', icon: <Users size={20} />, path: '/admin/employees' },
    { name: 'Attendance', icon: <CalendarCheck size={20} />, path: '/admin/attendance' },
    { name: 'Payroll', icon: <DollarSign size={20} />, path: '/admin/payroll' },
    { name: 'Payslips', icon: <FileText size={20} />, path: '/admin/payslips' },
    { name: 'Reports', icon: <BarChart3 size={20} />, path: '/admin/reports' },
  ];

  const employeeNavItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/employee' },
    { name: 'My Payslips', icon: <FileText size={20} />, path: '/employee/payslips' },
  ];

  const navItems = isAdmin ? adminNavItems : employeeNavItems;

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <DollarSign size={24} />
          </div>
          {isSidebarOpen && (
            <div className="sidebar-logo-text">
              <h1>Payroll</h1>
              <p>Management System</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`nav-btn ${isActive ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                {isSidebarOpen && <span>{item.name}</span>}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={20} />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-area">
        {/* Header */}
        <header className="topbar">
          <div className="topbar-left">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="menu-btn"
            >
              <Menu size={20} />
            </button>
            <div>
              <h2 className="topbar-title">
                {isAdmin ? 'Admin Dashboard' : 'Employee Portal'}
              </h2>
              <p className="topbar-subtitle">
                Welcome back, {isAdmin ? 'Admin' : 'John Doe'}
              </p>
            </div>
          </div>

          <div className="topbar-user">
            <div className="topbar-avatar">
              <User size={20} />
            </div>
            <div>
              <p className="topbar-user-name">
                {isAdmin ? 'Admin User' : 'John Doe'}
              </p>
              <p className="topbar-user-role">
                {isAdmin ? 'Administrator' : 'Senior Developer'}
              </p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
