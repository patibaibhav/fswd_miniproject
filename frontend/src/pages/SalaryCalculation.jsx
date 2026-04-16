import { useState, useEffect } from 'react';
import { Calculator, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { api } from '../utils/api';

function SalaryCalculation() {
  const [salaryData, setSalaryData] = useState([]);
  const [calculating, setCalculating] = useState(false);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayroll();
  }, []);

  const fetchPayroll = async () => {
    try {
      const data = await api.get('/payroll?year=2026&month=3');
      setSalaryData(data.map(item => ({
        ...item,
        basicSalary: parseFloat(item.basicSalary),
        allowances: parseFloat(item.allowances),
        grossSalary: parseFloat(item.grossSalary),
        deductions: parseFloat(item.deductions),
        netSalary: parseFloat(item.netSalary),
      })));
    } catch (err) {
      console.error('Fetch payroll error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCalculateSalary = async () => {
    setCalculating(true);
    try {
      const result = await api.post('/payroll/calculate', { year: 2026, month: 3 });
      setToast(result.message || 'Salary calculated successfully for all employees!');
      // Refresh payroll data
      await fetchPayroll();
    } catch (err) {
      setToast('Failed to calculate salary: ' + (err.message || 'Unknown error'));
    } finally {
      setCalculating(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  const totalGrossSalary = salaryData.reduce((sum, s) => sum + s.grossSalary, 0);
  const totalDeductions = salaryData.reduce((sum, s) => sum + s.deductions, 0);
  const totalNetSalary = salaryData.reduce((sum, s) => sum + s.netSalary, 0);

  if (loading) {
    return (
      <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>Loading payroll...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Salary Calculation</h1>
          <p className="page-subtitle">Calculate and manage employee payroll</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={handleCalculateSalary}
          disabled={calculating}
        >
          <Calculator size={16} />
          {calculating ? 'Calculating...' : 'Calculate All Salaries'}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid-3">
        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p className="stat-label">Total Gross Salary</p>
              <p className="stat-value">${totalGrossSalary.toLocaleString()}</p>
            </div>
            <div className="stat-icon amber">
              <DollarSign size={24} />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p className="stat-label">Total Deductions</p>
              <p className="stat-value" style={{ color: 'var(--danger-light)' }}>
                ${totalDeductions.toLocaleString()}
              </p>
            </div>
            <div className="stat-icon red">
              <TrendingDown size={24} />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p className="stat-label">Total Net Salary</p>
              <p className="stat-value" style={{ color: 'var(--success)' }}>
                ${totalNetSalary.toLocaleString()}
              </p>
            </div>
            <div className="stat-icon green">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Salary Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Salary Breakdown - March 2026</h3>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th className="text-right">Basic Salary</th>
                <th className="text-right">Allowances</th>
                <th className="text-right">Gross Salary</th>
                <th className="text-right">Deductions</th>
                <th className="text-right">Net Salary</th>
              </tr>
            </thead>
            <tbody>
              {salaryData.map((salary) => (
                <tr key={salary.employeeId}>
                  <td className="td-id">{salary.employeeId}</td>
                  <td className="td-name">{salary.employeeName}</td>
                  <td className="text-right td-muted">${salary.basicSalary.toLocaleString()}</td>
                  <td className="text-right td-success">+${salary.allowances.toLocaleString()}</td>
                  <td className="text-right" style={{ fontWeight: 600, color: 'var(--text-white)' }}>
                    ${salary.grossSalary.toLocaleString()}
                  </td>
                  <td className="text-right td-danger">-${salary.deductions.toLocaleString()}</td>
                  <td className="text-right td-accent">${salary.netSalary.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Salary Calculation Formula */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Salary Calculation Formula</h3>
        </div>
        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="info-box amber">
            <h3 className="info-box-title amber">Gross Salary</h3>
            <p className="info-box-text">Gross Salary = Basic Salary + Allowances (20% of Basic)</p>
          </div>
          <div className="info-box green">
            <h3 className="info-box-title green">Net Salary</h3>
            <p className="info-box-text">Net Salary = Gross Salary - Deductions (10% of Basic)</p>
          </div>
          <div className="info-box muted">
            <h3 className="info-box-title white">Deductions Include</h3>
            <ul>
              <li>Income Tax</li>
              <li>Professional Tax</li>
              <li>Provident Fund (PF)</li>
              <li>Health Insurance</li>
            </ul>
          </div>
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

export default SalaryCalculation;
