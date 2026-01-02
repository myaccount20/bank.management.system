import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { updateUser, getTransactionsByUserId } from '../../utils/storage';
import { validateEmail, validatePhone, formatDateTime } from '../../utils/helpers';
import './Customer.css';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [activityLog, setActivityLog] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
      });

      const transactions = getTransactionsByUserId(user.id).slice(0, 10);
      const activities = transactions.map(t => ({
        id: t.id,
        type: 'transaction',
        description: t.description,
        date: t.date,
      }));
      setActivityLog(activities);
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Valid email is required');
      return;
    }

    if (!validatePhone(formData.phone)) {
      setError('Valid 10-digit phone number is required');
      return;
    }

    updateUser(user.id, {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
    });

    setIsEditing(false);
    setSuccess('Profile updated successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="page-content">
      <h1 className="page-title">My Profile</h1>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="profile-sections">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="profile-basic-info">
              <h2>{user.name}</h2>
              <p>Account: {user.accountNumber}</p>
              <p className="profile-joined">
                Member since {new Date(user.createdAt).toLocaleDateString('en-IN', {
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>

          {!isEditing ? (
            <div className="profile-details">
              <div className="detail-row">
                <span className="detail-label">Full Name:</span>
                <span className="detail-value">{user.name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{user.email}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Phone:</span>
                <span className="detail-value">{user.phone}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Account Number:</span>
                <span className="detail-value">{user.accountNumber}</span>
              </div>
              <button onClick={() => setIsEditing(true)} className="btn btn-primary">
                Edit Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleSave} className="profile-edit-form">
              <div className="input-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength="10"
                  required
                />
              </div>
              <div className="button-group">
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: user.name,
                      email: user.email,
                      phone: user.phone,
                    });
                    setError('');
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="profile-card full-width">
          <h2>Recent Activity</h2>
          <div className="activity-log">
            {activityLog.length === 0 ? (
              <p className="empty-state">No recent activity</p>
            ) : (
              activityLog.map(activity => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-icon">📝</div>
                  <div className="activity-info">
                    <div className="activity-desc">{activity.description}</div>
                    <div className="activity-date">{formatDateTime(activity.date)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
