import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { DollarSign, Mail, Lock, UserPlus, Eye, EyeOff, CheckCircle, Shield, Users } from 'lucide-react';
import { api } from '../utils/api';
import '../styles/LoginPage.css';
import '../styles/SignUpPage.css';

function SignUpPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('2'); // default to employee (roleId 2)
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
  };

  const isPasswordStrong = passwordChecks.length && passwordChecks.uppercase && passwordChecks.number;

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!isPasswordStrong) {
      setError('Password does not meet the strength requirements.');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/register', {
        email,
        password,
        roleId: parseInt(role),
      });

      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
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
            <UserPlus size={40} />
          </div>
          <h2>Join Payroll System</h2>
          <p>
            Create your account and get instant access to the payroll
            management platform. Start managing your work today.
          </p>
          <div className="login-features">
            <div className="login-feature">
              <div className="feature-dot-box">
                <Shield size={16} className="feature-icon" />
              </div>
              <div>
                <h3>Secure Access</h3>
                <p>Enterprise-grade security for all your data</p>
              </div>
            </div>
            <div className="login-feature">
              <div className="feature-dot-box">
                <Users size={16} className="feature-icon" />
              </div>
              <div>
                <h3>Role-Based Dashboard</h3>
                <p>Tailored experience for admins and employees</p>
              </div>
            </div>
            <div className="login-feature">
              <div className="feature-dot-box">
                <CheckCircle size={16} className="feature-icon" />
              </div>
              <div>
                <h3>Instant Setup</h3>
                <p>Get started in under a minute with quick registration</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Sign Up Form */}
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
          <h2>Create Your Account</h2>
          <p>Fill in your details to get started</p>

          {error && (
            <div className="signup-alert signup-alert-error">
              {error}
            </div>
          )}

          {success && (
            <div className="signup-alert signup-alert-success">
              <CheckCircle size={16} />
              {success}
            </div>
          )}

          <form onSubmit={handleSignUp} className="login-form">
            <div className="form-group">
              <label className="form-label" htmlFor="signup-role">Register As</label>
              <select
                id="signup-role"
                className="form-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="1">Admin / HR</option>
                <option value="2">Employee</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signup-email">Email Address</label>
              <div className="form-input-icon">
                <Mail size={20} className="icon" />
                <input
                  id="signup-email"
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
              <label className="form-label" htmlFor="signup-password">Password</label>
              <div className="form-input-icon">
                <Lock size={20} className="icon" />
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {/* Password strength indicators */}
              {password.length > 0 && (
                <div className="password-checks">
                  <span className={`password-check ${passwordChecks.length ? 'pass' : ''}`}>
                    <CheckCircle size={12} /> 8+ characters
                  </span>
                  <span className={`password-check ${passwordChecks.uppercase ? 'pass' : ''}`}>
                    <CheckCircle size={12} /> Uppercase letter
                  </span>
                  <span className={`password-check ${passwordChecks.number ? 'pass' : ''}`}>
                    <CheckCircle size={12} /> Number
                  </span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signup-confirm-password">Confirm Password</label>
              <div className="form-input-icon">
                <Lock size={20} className="icon" />
                <input
                  id="signup-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="form-input"
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%' }}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <div className="signup-footer">
              <p>
                Already have an account?{' '}
                <Link to="/" className="link-btn">Login here</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
