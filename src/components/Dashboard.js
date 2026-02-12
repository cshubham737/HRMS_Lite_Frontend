import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../services/api';

// MUI Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getSummary();
      setStats(response.data.data);
      setError('');
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <p style={{ color: '#ef4444', textAlign: 'center' }}>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">
            <DashboardIcon className="page-title-icon" />
            Dashboard
          </h2>
          <p className="page-subtitle">Welcome to your HR Management System</p>
        </div>
      </div>

      <div className="dashboard-cards">
        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-card-info">
              <h3>Total Employees</h3>
              <p>{stats?.total_employees || 0}</p>
            </div>
            <PeopleIcon className="stat-card-icon employees" />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-card-info">
              <h3>Attendance Records</h3>
              <p>{stats?.total_attendance_records || 0}</p>
            </div>
            <AssignmentIcon className="stat-card-icon records" />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-card-info">
              <h3>Today Present</h3>
              <p>{stats?.today_present || 0}</p>
            </div>
            <CheckCircleIcon className="stat-card-icon present" />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-card-info">
              <h3>Today Absent</h3>
              <p>{stats?.today_absent || 0}</p>
            </div>
            <CancelIcon className="stat-card-icon absent" />
          </div>
        </div>
      </div>

      <div className="welcome-card">
        <h3>Getting Started</h3>
        <p>
          Manage your workforce efficiently with HRMS Lite. Add employees, track daily attendance, 
          and view comprehensive reports all in one place. Navigate using the menu above to get started.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;