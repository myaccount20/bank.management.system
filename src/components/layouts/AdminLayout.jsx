import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import './DashboardLayout.css';

const AdminLayout = () => {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar open">
        <div className="sidebar-header">
          <Link to="/admin" className="sidebar-logo">
            <span className="logo-text">ADMIN</span>
          </Link>
        </div>

        <nav className="sidebar-nav">
          <Link to="/admin" className={isActive('/admin')}>
            <span>Dashboard</span>
          </Link>
          <Link to="/admin/users" className={isActive('/admin/users')}>
            <span>Users</span>
          </Link>
          <Link to="/admin/transactions" className={isActive('/admin/transactions')}>
            <span>Transactions</span>
          </Link>
          <Link to="/admin/fixed-deposits" className={isActive('/admin/fixed-deposits')}>
            <span>Fixed Deposits</span>
          </Link>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-header">
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)' }}>
            SecureBank Admin
          </h2>
          <div className="header-right">
            <button onClick={toggleTheme} className="theme-toggle">
              {theme === 'light' ? 'Dark' : 'Light'}
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

export default AdminLayout;
