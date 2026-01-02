import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useState } from 'react';
import './DashboardLayout.css';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="dashboard-layout">
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <Link to="/dashboard" className="sidebar-logo">
            <span className="logo-icon">🏦</span>
            {sidebarOpen && <span className="logo-text">SecureBank</span>}
          </Link>
        </div>

        <nav className="sidebar-nav">
          <Link to="/dashboard" className={isActive('/dashboard')}>
            <span className="nav-icon">📊</span>
            {sidebarOpen && <span>Dashboard</span>}
          </Link>
          <Link to="/dashboard/accounts" className={isActive('/dashboard/accounts')}>
            <span className="nav-icon">💳</span>
            {sidebarOpen && <span>Accounts</span>}
          </Link>
          <Link to="/dashboard/transactions" className={isActive('/dashboard/transactions')}>
            <span className="nav-icon">💸</span>
            {sidebarOpen && <span>Transactions</span>}
          </Link>
          <Link to="/dashboard/fixed-deposits" className={isActive('/dashboard/fixed-deposits')}>
            <span className="nav-icon">📈</span>
            {sidebarOpen && <span>Fixed Deposits</span>}
          </Link>
          <Link to="/dashboard/banking-tools" className={isActive('/dashboard/banking-tools')}>
            <span className="nav-icon">🧮</span>
            {sidebarOpen && <span>Banking Tools</span>}
          </Link>
          <Link to="/dashboard/cards" className={isActive('/dashboard/cards')}>
            <span className="nav-icon">💎</span>
            {sidebarOpen && <span>Cards</span>}
          </Link>
          <Link to="/dashboard/notifications" className={isActive('/dashboard/notifications')}>
            <span className="nav-icon">🔔</span>
            {sidebarOpen && <span>Notifications</span>}
          </Link>
          <Link to="/dashboard/security" className={isActive('/dashboard/security')}>
            <span className="nav-icon">🔒</span>
            {sidebarOpen && <span>Security</span>}
          </Link>
          <Link to="/dashboard/profile" className={isActive('/dashboard/profile')}>
            <span className="nav-icon">👤</span>
            {sidebarOpen && <span>Profile</span>}
          </Link>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <span className="nav-icon">🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-header">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="sidebar-toggle">
            ☰
          </button>
          <div className="header-right">
            <span className="user-name">Welcome, {user?.name}</span>
            <button onClick={toggleTheme} className="theme-toggle">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </header>

        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
