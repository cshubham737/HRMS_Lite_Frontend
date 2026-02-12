import React, { useState } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import EmployeeList from './components/EmployeeList';
import Attendance from './components/Attendance';

// MUI Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import EventNoteIcon from '@mui/icons-material/EventNote';
import BusinessIcon from '@mui/icons-material/Business';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'employees':
        return <EmployeeList />;
      case 'attendance':
        return <Attendance />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="header-title">
            <BusinessIcon className="header-icon" />
            <h1>HRMS Lite</h1>
          </div>
          <nav className="nav">
            <button
              className={`nav-btn ${currentPage === 'dashboard' ? 'active' : ''}`}
              onClick={() => setCurrentPage('dashboard')}
            >
              <DashboardIcon style={{ fontSize: '1.125rem' }} />
              Dashboard
            </button>
            <button
              className={`nav-btn ${currentPage === 'employees' ? 'active' : ''}`}
              onClick={() => setCurrentPage('employees')}
            >
              <PeopleIcon style={{ fontSize: '1.125rem' }} />
              Employees
            </button>
            <button
              className={`nav-btn ${currentPage === 'attendance' ? 'active' : ''}`}
              onClick={() => setCurrentPage('attendance')}
            >
              <EventNoteIcon style={{ fontSize: '1.125rem' }} />
              Attendance
            </button>
          </nav>
        </div>
      </header>

      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;