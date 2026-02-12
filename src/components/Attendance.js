import React, { useState, useEffect, useCallback } from 'react';
import { attendanceAPI, employeeAPI } from '../services/api';
import DeleteIcon from '@mui/icons-material/Delete';

function Attendance() {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    employee_id: '',
    date: ''
  });
  const [formData, setFormData] = useState({
    employee_id: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Present'
  });
  const [formErrors, setFormErrors] = useState({});
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
  fetchEmployees();
  fetchAttendance();
}, [fetchEmployees, fetchAttendance]);


  const fetchEmployees = useCallback(async () => {
    try {
      const response = await employeeAPI.getAll();
      setEmployees(response.data.data);
    } catch (err) {
      console.error('Failed to load employees', err);
    }
  }, []);

  const fetchAttendance = useCallback(async () => {
  try {
    setLoading(true);
    const response = await attendanceAPI.getAll(filters);
    setAttendanceRecords(response.data.data);
    setError('');
  } catch (err) {
    setError('Failed to load attendance records');
    console.error(err);
  } finally {
    setLoading(false);
  }
}, [filters]);


  const fetchSummary = async (employeeId) => {
    if (!employeeId) {
      setSummary(null);
      return;
    }
    try {
      const response = await attendanceAPI.getSummary(employeeId);
      setSummary(response.data.data);
    } catch (err) {
      console.error('Failed to load summary', err);
      setSummary(null);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApplyFilters = () => {
    fetchAttendance();
    if (filters.employee_id) {
      fetchSummary(filters.employee_id);
      const emp = employees.find(e => e.employee_id === filters.employee_id);
      setSelectedEmployee(emp);
    } else {
      setSummary(null);
      setSelectedEmployee(null);
    }
  };

  const handleClearFilters = () => {
    setFilters({ employee_id: '', date: '' });
    setSummary(null);
    setSelectedEmployee(null);
    // Trigger fetch with empty filters
    setTimeout(() => {
      fetchAttendance();
    }, 0);
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

    if (!formData.employee_id) {
      errors.employee_id = 'Please select an employee';
    }

    if (!formData.date) {
      errors.date = 'Date is required';
    }

    if (!formData.status) {
      errors.status = 'Status is required';
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
      await attendanceAPI.mark(formData);
      setSuccess('Attendance marked successfully!');
      setShowModal(false);
      setFormData({
        employee_id: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Present'
      });
      fetchAttendance();
      if (filters.employee_id) {
        fetchSummary(filters.employee_id);
      }
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to mark attendance';
      setError(errorMessage);
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this attendance record?')) {
      try {
        await attendanceAPI.delete(id);
        setSuccess('Attendance record deleted successfully!');
        fetchAttendance();
        if (filters.employee_id) {
          fetchSummary(filters.employee_id);
        }
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to delete attendance record');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h2 className="page-title">Attendance</h2>
          <p className="page-subtitle">Track daily employee attendance</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Mark Attendance
        </button>
      </div>

      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}

    
      {/* Filters */}
      <div className="card">
        <h3 style={{ marginBottom: '1rem' }}>Filters</h3>

        <div className="filters-modern">

          <div className="filter-field">
            <label>Employee</label>
            <select
              name="employee_id"
              value={filters.employee_id}
              onChange={handleFilterChange}
              className="input-modern"
            >
              <option value="">All Employees</option>
              {employees.map(emp => (
                <option key={emp._id} value={emp.employee_id}>
                  {emp.employee_id} - {emp.full_name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-field">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
              className="input-modern"
            />
          </div>

          <div className="filter-buttons">
            <button className="btn btn-primary" onClick={handleApplyFilters}>
              Apply
            </button>
            <button className="btn btn-secondary" onClick={handleClearFilters}>
              Clear
            </button>
          </div>

        </div>
      </div>

      {/* Summary Card */}
      {summary && selectedEmployee && (
        <div className="card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: 600 }}>
            Attendance Summary - {selectedEmployee.full_name}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
            <div>
              <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>Total Days</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{summary.total_days}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>Present</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{summary.total_present}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>Absent</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{summary.total_absent}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>Attendance %</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{summary.attendance_percentage}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Records Table */}
      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading attendance records...</p>
        </div>
      ) : attendanceRecords.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📅</div>
          <h3>No attendance records found</h3>
          <p>Start marking attendance for your employees</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {attendanceRecords.map((record) => (
                <tr key={record._id}>
                  <td><strong>{record.employee_id}</strong></td>
                  <td>{record.employee_name}</td>
                  <td>{record.date}</td>
                  <td>
                    <span className={`status-badge ${record.status === 'Present' ? 'status-present' : 'status-absent'}`}>
                      {record.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="icon-btn delete"
                      onClick={() => handleDelete(record._id)}
                      title="Delete record"
                    >
                      <DeleteIcon style={{ fontSize: '1.125rem' }} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mark Attendance Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Mark Attendance</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Employee *</label>
                <select
                  name="employee_id"
                  value={formData.employee_id}
                  onChange={handleInputChange}
                >
                  <option value="">Select Employee</option>
                  {employees.map(emp => (
                    <option key={emp._id} value={emp.employee_id}>
                      {emp.employee_id} - {emp.full_name}
                    </option>
                  ))}
                </select>
                {formErrors.employee_id && (
                  <span style={{ color: '#EF4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                    {formErrors.employee_id}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  max={new Date().toISOString().split('T')[0]}
                />
                {formErrors.date && (
                  <span style={{ color: '#EF4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                    {formErrors.date}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label>Status *</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                </select>
                {formErrors.status && (
                  <span style={{ color: '#EF4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                    {formErrors.status}
                  </span>
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
                <button type="submit" className="btn btn-success">
                  Mark Attendance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Attendance;
