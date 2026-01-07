import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import './AdminLayout.css';

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
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <Link to="/admin" className="admin-logo">
            <span className="admin-logo-icon">ADMIN PORTAL</span>
          </Link>
        </div>

        <nav className="admin-sidebar-nav">
          <Link to="/admin" className={isActive('/admin')}>
            <span>Dashboard</span>
          </Link>
          <Link to="/admin/users" className={isActive('/admin/users')}>
            <span>User Management</span>
          </Link>
          <Link to="/admin/transactions" className={isActive('/admin/transactions')}>
            <span>Transactions</span>
          </Link>
          <Link to="/admin/fixed-deposits" className={isActive('/admin/fixed-deposits')}>
            <span>Fixed Deposits</span>
          </Link>
        </nav>

        <div className="admin-sidebar-footer">
          <button onClick={handleLogout} className="admin-logout-btn">
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-header">
          <h2>SecureBank Administration</h2>
          <div className="admin-header-right">
            <button onClick={toggleTheme} className="admin-theme-toggle">
              {theme === 'light' ? 'Dark' : 'Light'}
            </button>
          </div>
        </header>

        <div className="admin-content-wrapper">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
