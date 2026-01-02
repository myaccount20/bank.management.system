import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import './PublicLayout.css';

const PublicLayout = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="public-layout">
      <nav className="public-nav">
        <div className="container">
          <div className="nav-content">
            <Link to="/" className="logo">
              <span className="logo-icon">🏦</span>
              <span className="logo-text">SecureBank</span>
            </Link>

            <div className="nav-links">
              <Link to="/" className={isActive('/')}>Home</Link>
              <Link to="/about" className={isActive('/about')}>About</Link>
              <Link to="/services" className={isActive('/services')}>Services</Link>
              <Link to="/contact" className={isActive('/contact')}>Contact</Link>
              <Link to="/open-account" className="btn btn-primary">Open Account</Link>
              <Link to="/login" className="btn btn-secondary">Login</Link>
              <button onClick={toggleTheme} className="theme-toggle" title="Toggle theme">
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="public-main">
        <Outlet />
      </main>

      <footer className="public-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>SecureBank</h3>
              <p>Your trusted banking partner</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <Link to="/about">About Us</Link>
              <Link to="/services">Services</Link>
              <Link to="/contact">Contact</Link>
            </div>
            <div className="footer-section">
              <h4>Support</h4>
              <p>Email: support@securebank.com</p>
              <p>Phone: 1800-123-4567</p>
            </div>
            <div className="footer-section">
              <h4>Admin</h4>
              <Link to="/admin/login">Admin Portal</Link>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 SecureBank. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
