import { useState, useEffect } from 'react';
import { Edit, Calendar, Users } from 'lucide-react';
import { api } from '../utils/api';

function AttendanceManagement() {
  const [attendance, setAttendance] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentAttendance, setCurrentAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    present: 0,
    absent: 0,
    leave: 0,
  });

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const data = await api.get('/attendance?year=2026&month=3');
      setAttendance(data);
    } catch (err) {
      console.error('Fetch attendance error:', err);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (att) => {
    setCurrentAttendance(att);
    setFormData({
      present: att.present,
      absent: att.absent,
      leave: att.leave,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateAttendance = async () => {
    if (!currentAttendance) return;
    try {
      await api.put(`/attendance/${currentAttendance.employeeId}`, {
        present: formData.present,
        absent: formData.absent,
        leave: formData.leave,
        year: 2026,
        month: 3,
      });
      setAttendance(
        attendance.map((att) =>
          att.employeeId === currentAttendance.employeeId
            ? {
              ...att,
              present: formData.present,
              absent: formData.absent,
              leave: formData.leave,
            }
            : att
        )
      );
      setIsEditModalOpen(false);
      setCurrentAttendance(null);
    } catch (err) {
      alert(err.message || 'Failed to update attendance');
    }
  };

  const totalPresent = attendance.reduce((sum, att) => sum + att.present, 0);
  const totalAbsent = attendance.reduce((sum, att) => sum + att.absent, 0);
  const totalLeave = attendance.reduce((sum, att) => sum + att.leave, 0);

  if (loading) {
    return (
      <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>Loading attendance...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div>
        <h1 className="page-title">Attendance Management</h1>
        <p className="page-subtitle">Track and manage employee attendance records</p>
      </div>

      {/* Summary Cards
      <div className="grid-3">
        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p className="stat-label">Total Present Days</p>
              <p className="stat-value" style={{ color: 'var(--success)' }}>{totalPresent}</p>
            </div>
            <div className="stat-icon green">
              <Users size={24} />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p className="stat-label">Total Absent Days</p>
              <p className="stat-value" style={{ color: 'var(--danger-light)' }}>{totalAbsent}</p>
            </div>
            <div className="stat-icon red">
              <Calendar size={24} />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p className="stat-label">Total Leave Days</p>
              <p className="stat-value" style={{ color: 'var(--accent)' }}>{totalLeave}</p>
            </div>
            <div className="stat-icon amber">
              <Calendar size={24} />
            </div>
          </div>
        </div>
      </div> */}

      {/* Attendance Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">March 2026 Attendance</h3>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th className="text-center">Total Days</th>
                <th className="text-center">Present</th>
                <th className="text-center">Absent</th>
                <th className="text-center">Leave</th>
                <th className="text-center">Attendance %</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((att) => {
                const attendancePercentage = ((att.present / att.totalDays) * 100).toFixed(1);
                const pctClass =
                  Number(attendancePercentage) >= 90
                    ? 'green'
                    : Number(attendancePercentage) >= 75
                      ? 'amber'
                      : 'red';
                return (
                  <tr key={att.employeeId}>
                    <td className="td-id">{att.employeeId}</td>
                    <td className="td-name">{att.employeeName}</td>
                    <td className="text-center td-muted">{att.totalDays}</td>
                    <td className="text-center">
                      <span className="color-badge green">{att.present}</span>
                    </td>
                    <td className="text-center">
                      <span className="color-badge red">{att.absent}</span>
                    </td>
                    <td className="text-center">
                      <span className="color-badge amber">{att.leave}</span>
                    </td>
                    <td className="text-center">
                      <span className={`color-badge ${pctClass}`}>{attendancePercentage}%</span>
                    </td>
                    <td className="text-right">
                      <button className="btn-ghost" onClick={() => openEditModal(att)}>
                        <Edit size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Attendance Modal */}
      {isEditModalOpen && (
        <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="modal-content small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Edit Attendance</h2>
              <p className="modal-description">
                Update attendance for {currentAttendance?.employeeName}
              </p>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Present Days</label>
                <input
                  className="form-input"
                  type="number"
                  value={formData.present}
                  onChange={(e) => setFormData({ ...formData, present: Number(e.target.value) })}
                  min="0"
                  max="22"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Absent Days</label>
                <input
                  className="form-input"
                  type="number"
                  value={formData.absent}
                  onChange={(e) => setFormData({ ...formData, absent: Number(e.target.value) })}
                  min="0"
                  max="22"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Leave Days</label>
                <input
                  className="form-input"
                  type="number"
                  value={formData.leave}
                  onChange={(e) => setFormData({ ...formData, leave: Number(e.target.value) })}
                  min="0"
                  max="22"
                />
              </div>
              <div className="info-box muted">
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  Total:{' '}
                  <span style={{ color: 'var(--text-white)', fontWeight: 600 }}>
                    {formData.present + formData.absent + formData.leave} / 22 days
                  </span>
                </p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => { setIsEditModalOpen(false); setCurrentAttendance(null); }}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleUpdateAttendance}>
                Update Attendance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AttendanceManagement;
