import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  generateAccountNumber,
  saveUser,
  saveAccount,
  saveCard,
  generateCardNumber,
  generateCVV,
  getUserByAccountNumber,
  saveNotification,
} from '../../utils/storage';
import { validateEmail, validatePhone, validatePIN, generateId } from '../../utils/helpers';
import './Auth.css';

const OpenAccount = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    accountType: 'savings',
    initialDeposit: '',
    pin: '',
    confirmPin: '',
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [accountNumber, setAccountNumber] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Valid email is required';
    }

    if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Valid 10-digit phone number is required';
    }

    if (!formData.initialDeposit || parseFloat(formData.initialDeposit) < 1000) {
      newErrors.initialDeposit = 'Minimum initial deposit is ₹1,000';
    }

    if (!validatePIN(formData.pin)) {
      newErrors.pin = 'PIN must be 4 digits';
    }

    if (formData.pin !== formData.confirmPin) {
      newErrors.confirmPin = 'PINs do not match';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newAccountNumber = generateAccountNumber();
    const userId = generateId();
    const accountId = generateId();
    const now = new Date().toISOString();

    const user = {
      id: userId,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      accountNumber: newAccountNumber,
      pin: formData.pin,
      createdAt: now,
      locked: false,
      failedAttempts: 0,
    };

    const account = {
      id: accountId,
      userId: userId,
      accountNumber: newAccountNumber,
      type: formData.accountType,
      balance: parseFloat(formData.initialDeposit),
      status: 'active',
      createdAt: now,
    };

    const card = {
      id: generateId(),
      userId: userId,
      accountId: accountId,
      cardNumber: generateCardNumber(),
      cvv: generateCVV(),
      expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 5)).toISOString(),
      frozen: false,
      type: 'debit',
      createdAt: now,
    };

    saveUser(user);
    saveAccount(account);
    saveCard(card);

    saveNotification({
      id: generateId(),
      userId: userId,
      title: 'Welcome to SecureBank!',
      message: 'Your account has been created successfully.',
      date: now,
      read: false,
      type: 'info',
    });

    setAccountNumber(newAccountNumber);
    setSuccess(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      accountType: 'savings',
      initialDeposit: '',
      pin: '',
      confirmPin: '',
    });
  };

  if (success) {
    return (
      <div className="auth-page">
        <div className="container">
          <div className="auth-container">
            <div className="success-message">
              <div className="success-icon">✓</div>
              <h2>Account Created Successfully!</h2>
              <p>Your account number is:</p>
              <div className="account-number-display">{accountNumber}</div>
              <p className="info-text">
                Please save this account number. You will need it along with your PIN to login.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="btn btn-primary btn-block"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-container">
          <h1>Open a New Account</h1>
          <p className="subtitle">Join SecureBank today and start banking with confidence</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
              {errors.name && <span className="error">{errors.name}</span>}
            </div>

            <div className="input-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>

            <div className="input-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="10-digit phone number"
                maxLength="10"
              />
              {errors.phone && <span className="error">{errors.phone}</span>}
            </div>

            <div className="input-group">
              <label>Account Type *</label>
              <select
                name="accountType"
                value={formData.accountType}
                onChange={handleChange}
              >
                <option value="savings">Savings Account</option>
                <option value="current">Current Account</option>
                <option value="salary">Salary Account</option>
              </select>
            </div>

            <div className="input-group">
              <label>Initial Deposit (₹) *</label>
              <input
                type="number"
                name="initialDeposit"
                value={formData.initialDeposit}
                onChange={handleChange}
                placeholder="Minimum ₹1,000"
                min="1000"
                step="0.01"
              />
              {errors.initialDeposit && <span className="error">{errors.initialDeposit}</span>}
            </div>

            <div className="input-group">
              <label>Create 4-digit PIN *</label>
              <input
                type="password"
                name="pin"
                value={formData.pin}
                onChange={handleChange}
                placeholder="4-digit PIN"
                maxLength="4"
              />
              {errors.pin && <span className="error">{errors.pin}</span>}
            </div>

            <div className="input-group">
              <label>Confirm PIN *</label>
              <input
                type="password"
                name="confirmPin"
                value={formData.confirmPin}
                onChange={handleChange}
                placeholder="Re-enter PIN"
                maxLength="4"
              />
              {errors.confirmPin && <span className="error">{errors.confirmPin}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              Create Account
            </button>

            <p className="auth-footer">
              Already have an account? <a href="/login">Login here</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OpenAccount;
