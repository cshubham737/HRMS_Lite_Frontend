import React, { useState, useEffect } from 'react';
import { employeeAPI } from '../services/api';
import Swal from 'sweetalert2';

// MUI Icons
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import BusinessIcon from '@mui/icons-material/Business';

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    department: 'Engineering'
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await employeeAPI.getAll();
      setEmployees(response.data.data);
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to load employees',
        icon: 'error',
        confirmButtonColor: '#0078d4'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.full_name.trim()) {
      errors.full_name = 'Full name is required';
    } else if (formData.full_name.trim().length < 2) {
      errors.full_name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }

    if (!formData.department) {
      errors.department = 'Department is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const response = await employeeAPI.create(formData);
      
      await Swal.fire({
        title: 'Success!',
        text: response.data.message || 'Employee added successfully!',
        icon: 'success',
        confirmButtonColor: '#0078d4',
        timer: 2000,
        showConfirmButton: false
      });
      
      setShowModal(false);
      setFormData({
        full_name: '',
        email: '',
        department: 'Engineering'
      });
      fetchEmployees();
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to add employee';
      Swal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
        confirmButtonColor: '#0078d4'
      });
    }
  };

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: 'Delete Employee?',
      text: `Remove ${name} and all their attendance records?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await employeeAPI.delete(id);
        
        await Swal.fire({
          title: 'Deleted!',
          text: 'Employee removed successfully.',
          icon: 'success',
          confirmButtonColor: '#0078d4',
          timer: 2000,
          showConfirmButton: false
        });
        
        fetchEmployees();
      } catch (err) {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete employee',
          icon: 'error',
          confirmButtonColor: '#0078d4'
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading employees...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">
            <PeopleIcon className="page-title-icon" />
            Employees
          </h2>
          <p className="page-subtitle">Manage your employee records</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <PersonAddIcon style={{ fontSize: '1.125rem' }} />
          Add Employee
        </button>
      </div>

      {employees.length === 0 ? (
        <div className="empty-state">
          <PeopleIcon className="empty-state-icon" />
          <h3>No employees found</h3>
          <p>Get started by adding your first employee</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee._id}>
                  <td><strong>{employee.employee_id}</strong></td>
                  <td>{employee.full_name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.department}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="icon-btn delete"
                        onClick={() => handleDelete(employee._id, employee.full_name)}
                        title="Delete employee"
                      >
                        <DeleteIcon style={{ fontSize: '1.125rem' }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>
              <PersonAddIcon style={{ fontSize: '1.5rem' }} />
              Add New Employee
            </h2>
            <p className="modal-subtitle">
              Employee ID will be auto-generated
            </p>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>
                  <PersonIcon style={{ fontSize: '1rem' }} />
                  Full Name *
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  placeholder="e.g., John Doe"
                />
                {formErrors.full_name && (
                  <span className="form-error">{formErrors.full_name}</span>
                )}
              </div>

              <div className="form-group">
                <label>
                  <EmailIcon style={{ fontSize: '1rem' }} />
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="e.g., john@company.com"
                />
                {formErrors.email && (
                  <span className="form-error">{formErrors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label>
                  <BusinessIcon style={{ fontSize: '1rem' }} />
                  Department *
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                >
                  <option value="Engineering">Engineering</option>
                  <option value="HR">HR</option>
                  <option value="Sales">Sales</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Finance">Finance</option>
                  <option value="Operations">Operations</option>
                  <option value="IT">IT</option>
                  <option value="Other">Other</option>
                </select>
                {formErrors.department && (
                  <span className="form-error">{formErrors.department}</span>
                )}
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <PersonAddIcon style={{ fontSize: '1rem' }} />
                  Add Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeList;