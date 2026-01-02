import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  getUserByAccountNumber,
  updateUser,
  saveNotification,
} from '../../utils/storage';
import { generateId } from '../../utils/helpers';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    accountNumber: '',
    pin: '',
  });
  const [error, setError] = useState('');
  const [showForgotPin, setShowForgotPin] = useState(false);
  const [forgotPinAccount, setForgotPinAccount] = useState('');
  const [recoveredPin, setRecoveredPin] = useState('');

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

    if (!formData.accountNumber || !formData.pin) {
      setError('Please enter both account number and PIN');
      return;
    }

    const user = getUserByAccountNumber(formData.accountNumber);

    if (!user) {
      setError('Invalid account number');
      return;
    }

    if (user.locked) {
      setError('Account is locked due to multiple failed attempts. Please contact support.');
      return;
    }

    if (user.pin !== formData.pin) {
      const failedAttempts = (user.failedAttempts || 0) + 1;

      if (failedAttempts >= 3) {
        updateUser(user.id, { locked: true, failedAttempts });
        saveNotification({
          id: generateId(),
          userId: user.id,
          title: 'Account Locked',
          message: 'Your account has been locked due to multiple failed login attempts.',
          date: new Date().toISOString(),
          read: false,
          type: 'warning',
        });
        setError('Account locked due to multiple failed attempts. Please contact support.');
      } else {
        updateUser(user.id, { failedAttempts });
        setError(`Invalid PIN. ${3 - failedAttempts} attempts remaining.`);
      }
      return;
    }

    login(user);
    navigate('/dashboard');
  };

  const handleForgotPin = (e) => {
    e.preventDefault();
    const user = getUserByAccountNumber(forgotPinAccount);

    if (!user) {
      setError('Account number not found');
      return;
    }

    setRecoveredPin(user.pin);
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-container">
          {!showForgotPin ? (
            <>
              <h1>Login to Your Account</h1>
              <p className="subtitle">Enter your credentials to access your account</p>

              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="auth-form">
                <div className="input-group">
                  <label>Account Number *</label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    placeholder="Enter your account number"
                  />
                </div>

                <div className="input-group">
                  <label>PIN *</label>
                  <input
                    type="password"
                    name="pin"
                    value={formData.pin}
                    onChange={handleChange}
                    placeholder="4-digit PIN"
                    maxLength="4"
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-block">
                  Login
                </button>

                <div className="auth-links">
                  <button
                    type="button"
                    onClick={() => setShowForgotPin(true)}
                    className="link-button"
                  >
                    Forgot PIN?
                  </button>
                </div>

                <p className="auth-footer">
                  Don't have an account? <a href="/open-account">Open Account</a>
                </p>
              </form>
            </>
          ) : (
            <>
              <h1>Recover Your PIN</h1>
              <p className="subtitle">Enter your account number to retrieve your PIN</p>

              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}

              {recoveredPin && (
                <div className="alert alert-success">
                  Your PIN is: <strong>{recoveredPin}</strong>
                </div>
              )}

              <form onSubmit={handleForgotPin} className="auth-form">
                <div className="input-group">
                  <label>Account Number *</label>
                  <input
                    type="text"
                    value={forgotPinAccount}
                    onChange={(e) => {
                      setForgotPinAccount(e.target.value);
                      setError('');
                      setRecoveredPin('');
                    }}
                    placeholder="Enter your account number"
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-block">
                  Recover PIN
                </button>

                <div className="auth-links">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPin(false);
                      setError('');
                      setRecoveredPin('');
                    }}
                    className="link-button"
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
