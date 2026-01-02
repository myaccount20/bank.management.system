import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getAdmin } from '../../utils/storage';
import '../public/Auth.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { adminLogin } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const admin = getAdmin();

    if (formData.username !== admin.username || formData.password !== admin.password) {
      setError('Invalid credentials');
      return;
    }

    adminLogin();
    navigate('/admin');
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-container">
          <h1>Admin Login</h1>
          <p className="subtitle">Access the administrative dashboard</p>

          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <label>Username *</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter admin username"
                required
              />
            </div>

            <div className="input-group">
              <label>Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter admin password"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              Login as Admin
            </button>

            <p className="auth-footer">
              <a href="/">Back to Home</a>
            </p>
          </form>

          <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '0.5rem', fontSize: '0.875rem' }}>
            <strong>Demo Credentials:</strong><br />
            Username: admin<br />
            Password: admin123
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
