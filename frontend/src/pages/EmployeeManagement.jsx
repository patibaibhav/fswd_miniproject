import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { api } from '../utils/api';

function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    position: '',
    salary: '',
    status: 'Active',
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const data = await api.get('/employees');
      setEmployees(data);
    } catch (err) {
      console.error('Fetch employees error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddEmployee = async () => {
    try {
      const newEmployee = await api.post('/employees', {
        name: formData.name,
        email: formData.email,
        department: formData.department,
        position: formData.position,
        salary: Number(formData.salary),
        status: formData.status,
      });
      setEmployees([...employees, newEmployee]);
      setIsAddModalOpen(false);
      resetForm();
    } catch (err) {
      alert(err.message || 'Failed to add employee');
    }
  };

  const handleEditEmployee = async () => {
    if (!currentEmployee) return;
    try {
      const updated = await api.put(`/employees/${currentEmployee.id}`, {
        name: formData.name,
        email: formData.email,
        department: formData.department,
        position: formData.position,
        salary: Number(formData.salary),
        status: formData.status,
      });
      setEmployees(
        employees.map((emp) => (emp.id === currentEmployee.id ? updated : emp))
      );
      setIsEditModalOpen(false);
      setCurrentEmployee(null);
      resetForm();
    } catch (err) {
      alert(err.message || 'Failed to update employee');
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      try {
        await api.delete(`/employees/${id}`);
        setEmployees(employees.filter((emp) => emp.id !== id));
      } catch (err) {
        alert(err.message || 'Failed to delete employee');
      }
    }
  };

  const openEditModal = (employee) => {
    setCurrentEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      department: employee.department,
      position: employee.position,
      salary: employee.salary.toString(),
      status: employee.status,
    });
    setIsEditModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      department: '',
      position: '',
      salary: '',
      status: 'Active',
    });
  };

  const renderForm = (isEdit) => (
    <div className="modal-body">
      <div className="form-group">
        <label className="form-label">Full Name</label>
        <input
          className="form-input"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="John Doe"
        />
      </div>
      <div className="form-group">
        <label className="form-label">Email</label>
        <input
          className="form-input"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="john.doe@company.com"
        />
      </div>
      <div className="form-group">
        <label className="form-label">Department</label>
        <input
          className="form-input"
          value={formData.department}
          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          placeholder="Engineering"
        />
      </div>
      <div className="form-group">
        <label className="form-label">Position</label>
        <input
          className="form-input"
          value={formData.position}
          onChange={(e) => setFormData({ ...formData, position: e.target.value })}
          placeholder="Software Developer"
        />
      </div>
      <div className="form-group">
        <label className="form-label">Annual Salary</label>
        <input
          className="form-input"
          type="number"
          value={formData.salary}
          onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
          placeholder="75000"
        />
      </div>
      <div className="form-group">
        <label className="form-label">Status</label>
        <select
          className="form-select"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>Loading employees...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Employee Management</h1>
          <p className="page-subtitle">Manage your team and employee information</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={16} />
          Add Employee
        </button>
      </div>

      {/* Employee Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-header-row">
            <h3 className="card-title">All Employees</h3>
            <div className="search-wrapper">
              <Search size={16} className="icon" />
              <input
                className="form-input"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Position</th>
                <th>Salary</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => (
                <tr key={employee.id}>
                  <td className="td-id">{employee.id}</td>
                  <td className="td-name">{employee.name}</td>
                  <td className="td-muted">{employee.email}</td>
                  <td className="td-muted">{employee.department}</td>
                  <td className="td-muted">{employee.position}</td>
                  <td className="td-accent">${Number(employee.salary).toLocaleString()}</td>
                  <td>
                    <span className={`status-badge ${employee.status === 'Active' ? 'active' : 'inactive'}`}>
                      {employee.status}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="actions-cell">
                      <button className="btn-ghost" onClick={() => openEditModal(employee)}>
                        <Edit size={16} />
                      </button>
                      <button className="btn-ghost danger" onClick={() => handleDeleteEmployee(employee.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Employee Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-content small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Add New Employee</h2>
              <p className="modal-description">Fill in the employee information below</p>
            </div>
            {renderForm(false)}
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => { setIsAddModalOpen(false); resetForm(); }}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleAddEmployee}>
                Add Employee
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {isEditModalOpen && (
        <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="modal-content small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Edit Employee</h2>
              <p className="modal-description">Update employee information</p>
            </div>
            {renderForm(true)}
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => { setIsEditModalOpen(false); setCurrentEmployee(null); resetForm(); }}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleEditEmployee}>
                Update Employee
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeManagement;
