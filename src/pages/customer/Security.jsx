import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { updateUser, getLoginHistoryByUserId } from '../../utils/storage';
import { validatePIN, formatDateTime } from '../../utils/helpers';
import './Customer.css';

const Security = () => {
  const { user, logout } = useAuth();
  const [loginHistory, setLoginHistory] = useState([]);
  const [showChangePin, setShowChangePin] = useState(false);
  const [pinData, setPinData] = useState({
    currentPin: '',
    newPin: '',
    confirmPin: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      const history = getLoginHistoryByUserId(user.id).slice(0, 10);
      setLoginHistory(history);
    }
  }, [user]);

  const handleChangePin = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (pinData.currentPin !== user.pin) {
      setError('Current PIN is incorrect');
      return;
    }

    if (!validatePIN(pinData.newPin)) {
      setError('New PIN must be 4 digits');
      return;
    }

    if (pinData.newPin !== pinData.confirmPin) {
      setError('New PINs do not match');
      return;
    }

    if (pinData.newPin === pinData.currentPin) {
      setError('New PIN must be different from current PIN');
      return;
    }

    updateUser(user.id, { pin: pinData.newPin });
    setSuccess('PIN changed successfully! Please login again.');
    setPinData({ currentPin: '', newPin: '', confirmPin: '' });
    setShowChangePin(false);

    setTimeout(() => {
      logout();
    }, 2000);
  };

  return (
    <div className="page-content">
      <h1 className="page-title">Security Settings</h1>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="security-sections">
        <div className="security-card">
          <h2>PIN Management</h2>
          <p>Change your 4-digit PIN to keep your account secure</p>
          {!showChangePin ? (
            <button onClick={() => setShowChangePin(true)} className="btn btn-primary">
              Change PIN
            </button>
          ) : (
            <form onSubmit={handleChangePin} className="pin-form">
              <div className="input-group">
                <label>Current PIN</label>
                <input
                  type="password"
                  value={pinData.currentPin}
                  onChange={(e) => setPinData({ ...pinData, currentPin: e.target.value })}
                  maxLength="4"
                  placeholder="Enter current PIN"
                  required
                />
              </div>
              <div className="input-group">
                <label>New PIN</label>
                <input
                  type="password"
                  value={pinData.newPin}
                  onChange={(e) => setPinData({ ...pinData, newPin: e.target.value })}
                  maxLength="4"
                  placeholder="Enter new PIN"
                  required
                />
              </div>
              <div className="input-group">
                <label>Confirm New PIN</label>
                <input
                  type="password"
                  value={pinData.confirmPin}
                  onChange={(e) => setPinData({ ...pinData, confirmPin: e.target.value })}
                  maxLength="4"
                  placeholder="Confirm new PIN"
                  required
                />
              </div>
              <div className="button-group">
                <button type="submit" className="btn btn-primary">
                  Update PIN
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowChangePin(false);
                    setPinData({ currentPin: '', newPin: '', confirmPin: '' });
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

        <div className="security-card">
          <h2>Session Information</h2>
          <div className="info-list">
            <div className="info-item">
              <span className="info-label">Account Status:</span>
              <span className={`badge ${user.locked ? 'badge-danger' : 'badge-success'}`}>
                {user.locked ? 'LOCKED' : 'ACTIVE'}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Session Timeout:</span>
              <span className="info-value">10 minutes of inactivity</span>
            </div>
            <div className="info-item">
              <span className="info-label">Failed Login Attempts:</span>
              <span className="info-value">{user.failedAttempts || 0} / 3</span>
            </div>
          </div>
        </div>

        <div className="security-card full-width">
          <h2>Login History</h2>
          <p>Recent login activity on your account</p>
          <div className="login-history-table">
            {loginHistory.length === 0 ? (
              <p className="empty-state">No login history available</p>
            ) : (
              loginHistory.map(entry => (
                <div key={entry.id} className="history-row">
                  <div className="history-icon">
                    {entry.status === 'success' ? '✓' : '✗'}
                  </div>
                  <div className="history-info">
                    <div className="history-status">
                      Login {entry.status === 'success' ? 'Successful' : 'Failed'}
                    </div>
                    <div className="history-details">
                      {formatDateTime(entry.date)} • IP: {entry.ip}
                    </div>
                  </div>
                  <span className={`badge badge-${entry.status === 'success' ? 'success' : 'danger'}`}>
                    {entry.status.toUpperCase()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="security-card full-width">
          <h2>Security Tips</h2>
          <div className="tips-list">
            <div className="tip-item">
              <span className="tip-icon">🔒</span>
              <p>Never share your PIN with anyone, including bank staff</p>
            </div>
            <div className="tip-item">
              <span className="tip-icon">🔄</span>
              <p>Change your PIN regularly to maintain security</p>
            </div>
            <div className="tip-item">
              <span className="tip-icon">📱</span>
              <p>Always logout after completing your banking session</p>
            </div>
            <div className="tip-item">
              <span className="tip-icon">⚠️</span>
              <p>Report any suspicious activity immediately</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Security;
