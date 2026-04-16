import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Download, Eye, DollarSign } from 'lucide-react';
import { api } from '../utils/api';

function PayslipGeneration() {
  const location = useLocation();
  const isEmployee = location.pathname.startsWith('/employee');
  const [payslips, setPayslips] = useState([]);
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayslips();
  }, []);

  const fetchPayslips = async () => {
    try {
      let data;
      if (isEmployee) {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        // Get employee code from the employees endpoint using employeeId
        if (user.employeeId) {
          const emp = await api.get(`/employees/by-uuid/${user.employeeId}`);
          data = await api.get(`/payslips/employee/${emp.id}`);
        } else {
          data = await api.get('/payslips?year=2026&month=3');
        }
      } else {
        data = await api.get('/payslips?year=2026&month=3');
      }
      setPayslips(data);
    } catch (err) {
      console.error('Fetch payslips error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPayslip = (payslip) => {
    setToast(`Downloading payslip for ${payslip.employeeName}`);
    setTimeout(() => setToast(null), 3000);
  };

  const handleViewPayslip = (payslip) => {
    setSelectedPayslip(payslip);
    setIsViewModalOpen(true);
  };

  if (loading) {
    return (
      <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>Loading payslips...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div>
        <h1 className="page-title">
          {isEmployee ? 'My Payslips' : 'Payslip Management'}
        </h1>
        <p className="page-subtitle">
          {isEmployee
            ? 'View and download your salary payslips'
            : 'View and manage employee payslips'}
        </p>
      </div>

      {/* Payslips List */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title" style={{ fontSize: '1.125rem' }}>
            {isEmployee ? 'Your Payslips' : 'All Employee Payslips'} - March 2026
          </h3>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Employee Name</th>
                {!isEmployee && <th>Department</th>}
                {!isEmployee && <th>Position</th>}
                <th className="text-right">Net Salary</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payslips.map((payslip) => (
                <tr key={payslip.employeeId}>
                  <td className="td-id">{payslip.employeeId}</td>
                  <td className="td-name">{payslip.employeeName}</td>
                  {!isEmployee && <td className="td-muted">{payslip.department}</td>}
                  {!isEmployee && <td className="td-muted">{payslip.position}</td>}
                  <td className="text-right" style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '1.125rem' }}>
                    ${payslip.netSalary.toLocaleString()}
                  </td>
                  <td className="text-right">
                    <div className="actions-cell">
                      <button className="btn-ghost" onClick={() => handleViewPayslip(payslip)}>
                        <Eye size={16} />
                      </button>
                      <button className="btn-ghost" onClick={() => handleDownloadPayslip(payslip)}>
                        <Download size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payslip View Modal */}
      {isViewModalOpen && selectedPayslip && (
        <div className="modal-overlay" onClick={() => setIsViewModalOpen(false)}>
          <div className="modal-content medium" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title" style={{ fontSize: '1.25rem' }}>
                Payslip - {selectedPayslip.month} {selectedPayslip.year}
              </h2>
            </div>
            <div className="modal-body" style={{ gap: '1.5rem' }}>
              {/* Company Header */}
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{
                    width: '3rem', height: '3rem', background: 'var(--accent)',
                    borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', color: 'var(--accent-dark)'
                  }}>
                    <DollarSign size={28} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Tech Solutions Inc.</h2>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                      123 Business Avenue, Tech City, TC 12345
                    </p>
                  </div>
                </div>
              </div>

              {/* Employee Details */}
              <div className="info-grid">
                <div className="info-cell">
                  <p className="info-cell-label">Employee ID</p>
                  <p className="info-cell-value">{selectedPayslip.employeeId}</p>
                </div>
                <div className="info-cell">
                  <p className="info-cell-label">Employee Name</p>
                  <p className="info-cell-value">{selectedPayslip.employeeName}</p>
                </div>
                <div className="info-cell">
                  <p className="info-cell-label">Department</p>
                  <p className="info-cell-value">{selectedPayslip.department}</p>
                </div>
                <div className="info-cell">
                  <p className="info-cell-label">Position</p>
                  <p className="info-cell-value">{selectedPayslip.position}</p>
                </div>
                <div className="info-cell">
                  <p className="info-cell-label">Pay Period</p>
                  <p className="info-cell-value">{selectedPayslip.month} {selectedPayslip.year}</p>
                </div>
                <div className="info-cell">
                  <p className="info-cell-label">Payment Date</p>
                  <p className="info-cell-value">March 31, 2026</p>
                </div>
              </div>

              {/* Salary Breakdown */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Salary Breakdown</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  <div className="detail-row">
                    <span style={{ color: 'var(--text-muted)' }}>Basic Salary</span>
                    <span style={{ fontWeight: 600 }}>${selectedPayslip.basicSalary.toLocaleString()}</span>
                  </div>
                  <div className="detail-row">
                    <span style={{ color: 'var(--text-muted)' }}>Allowances</span>
                    <span style={{ fontWeight: 600, color: 'var(--success)' }}>
                      +${selectedPayslip.allowances.toLocaleString()}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span style={{ fontWeight: 600 }}>Gross Salary</span>
                    <span style={{ fontWeight: 700 }}>${selectedPayslip.grossSalary.toLocaleString()}</span>
                  </div>
                  <div className="detail-row">
                    <span style={{ color: 'var(--text-muted)' }}>Deductions (Tax, PF, etc.)</span>
                    <span style={{ fontWeight: 600, color: 'var(--danger-light)' }}>
                      -${selectedPayslip.deductions.toLocaleString()}
                    </span>
                  </div>
                  <div className="detail-row highlight">
                    <span style={{ fontWeight: 700, fontSize: '1.125rem' }}>Net Salary</span>
                    <span style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--accent)' }}>
                      ${selectedPayslip.netSalary.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="payslip-footer">
                <p style={{ marginBottom: '0.5rem' }}>
                  This is a computer-generated payslip and does not require a signature.
                </p>
                <p>For any queries, please contact HR at hr@techsolutions.com</p>
              </div>

              {/* Download Button */}
              <button
                className="btn btn-primary"
                style={{ width: '100%' }}
                onClick={() => handleDownloadPayslip(selectedPayslip)}
              >
                <Download size={20} />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

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

export default PayslipGeneration;
