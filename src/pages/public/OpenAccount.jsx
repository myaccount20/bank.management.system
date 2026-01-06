import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  generateAccountNumber,
  saveUser,
  saveAccount,
  saveCard,
  generateCardNumber,
  generateCVV,
  saveNotification,
} from '../../utils/storage';
import { validateEmail, validatePhone, validatePIN, validateName, generateId } from '../../utils/helpers';
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
  const [copied, setCopied] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'name') {
      newValue = value.replace(/[^a-zA-Z\s]/g, '');
    } else if (name === 'phone') {
      newValue = value.replace(/[^0-9]/g, '').slice(0, 10);
    } else if (name === 'pin' || name === 'confirmPin') {
      newValue = value.replace(/[^0-9]/g, '').slice(0, 4);
    }

    setFormData({
      ...formData,
      [name]: newValue,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  useEffect(() => {
    const isValid =
      validateName(formData.name) &&
      validateEmail(formData.email) &&
      validatePhone(formData.phone) &&
      parseFloat(formData.initialDeposit) >= 1000 &&
      validatePIN(formData.pin) &&
      formData.pin === formData.confirmPin;

    setIsFormValid(isValid);
  }, [formData]);

  const validate = () => {
    const newErrors = {};

    if (!validateName(formData.name)) {
      newErrors.name = 'Name must contain only letters and spaces';
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Email must end with @gmail.com';
    }

    if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Phone must be exactly 10 digits';
    }

    if (!formData.initialDeposit || parseFloat(formData.initialDeposit) < 1000) {
      newErrors.initialDeposit = 'Minimum initial deposit is ₹1,000';
    }

    if (!validatePIN(formData.pin)) {
      newErrors.pin = 'PIN must be exactly 4 digits';
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
      title: 'Welcome to SecureBank',
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

  const handleCopy = () => {
    navigator.clipboard.writeText(accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (success) {
    return (
      <div className="auth-page">
        <div className="container">
          <div className="auth-container">
            <div className="success-message">
              <div className="success-checkmark">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                  <circle cx="40" cy="40" r="38" stroke="#059669" strokeWidth="4" fill="none"/>
                  <path d="M25 40L35 50L55 30" stroke="#059669" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2>Account Created Successfully</h2>
              <p className="success-subtitle">Your account number:</p>
              <div className="account-number-box">
                <div className="account-number-value">{accountNumber}</div>
                <button onClick={handleCopy} className="copy-button" title="Copy to clipboard">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                </button>
              </div>
              {copied && <p className="copy-success">Copied to clipboard</p>}
              <p className="info-notice">
                Please save this account number securely. You will need it along with your PIN to login.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="btn btn-primary btn-block"
              >
                Continue to Login
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
          <p className="subtitle">Join SecureBank and experience modern banking</p>

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
                placeholder="yourname@gmail.com"
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>

            <div className="input-group">
              <label>Phone Number *</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="10-digit phone number"
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
              />
              {errors.confirmPin && <span className="error">{errors.confirmPin}</span>}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={!isFormValid}
            >
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
