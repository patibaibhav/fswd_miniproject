import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, Mail, Lock } from 'lucide-react';
import { api } from '../utils/api';
import '../styles/LoginPage.css';

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await api.post('/auth/login', { email, password });

      // Store token and user info
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Navigate based on role
      if (data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/employee');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Left Side - Illustration */}
        <div className="login-left">
          <div className="login-logo-icon">
            <DollarSign size={40} />
          </div>
          <h2>Streamline Your Payroll</h2>
          <p>
            Manage employee salaries, attendance, and payslips all in one
            place. Professional payroll management made simple.
          </p>
          <div className="login-features">
            <div className="login-feature">
              <div className="feature-dot-box">
                <div className="feature-dot"></div>
              </div>
              <div>
                <h3>Automated Salary Calculations</h3>
                <p>Calculate salaries with deductions automatically</p>
              </div>
            </div>
            <div className="login-feature">
              <div className="feature-dot-box">
                <div className="feature-dot"></div>
              </div>
              <div>
                <h3>Attendance Tracking</h3>
                <p>Monitor employee attendance and leave records</p>
              </div>
            </div>
            <div className="login-feature">
              <div className="feature-dot-box">
                <div className="feature-dot"></div>
              </div>
              <div>
                <h3>Digital Payslips</h3>
                <p>Generate and download payslips instantly</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="login-right">
          <div className="login-brand">
            <div className="login-brand-icon">
              <DollarSign size={28} />
            </div>
            <div>
              <h1>Payroll Management</h1>
              <p>System</p>
            </div>
          </div>
          <h2>Login to Your Account</h2>
          <p>Enter your credentials to access the system</p>

          {error && (
            <div style={{ color: 'var(--danger-light)', background: 'rgba(239,68,68,0.1)', padding: '0.75rem 1rem', borderRadius: 'var(--radius)', marginBottom: '1rem', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label className="form-label" htmlFor="role">Login As</label>
              <select
                id="role"
                className="form-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="admin">Admin / HR</option>
                <option value="employee">Employee</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <div className="form-input-icon">
                <Mail size={20} className="icon" />
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <div className="form-input-icon">
                <Lock size={20} className="icon" />
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="checkbox-row">
              <label className="checkbox-label">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <button type="button" className="link-btn">
                Forgot Password?
              </button>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <div className="demo-box">
              <p>
                Demo Credentials:<br />
                <span style={{ color: 'var(--text-white)', fontWeight: 500 }}>
                  admin@company.com / employee@company.com
                </span>
                <br />
                <span style={{ color: 'var(--text-white)', fontWeight: 500 }}>
                  Password: password123
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
