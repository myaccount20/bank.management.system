export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
};

export const formatDateTime = (date) => {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

export const maskAccountNumber = (accountNumber) => {
  if (!accountNumber) return '';
  const lastFour = accountNumber.slice(-4);
  return `****${lastFour}`;
};

export const maskCardNumber = (cardNumber) => {
  if (!cardNumber) return '';
  return cardNumber.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '$1 **** **** $4');
};

export const calculateEMI = (principal, annualRate, months) => {
  const monthlyRate = annualRate / 12 / 100;
  if (monthlyRate === 0) return principal / months;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
               (Math.pow(1 + monthlyRate, months) - 1);
  return emi;
};

export const calculateFDMaturityAmount = (principal, annualRate, months) => {
  const interest = (principal * annualRate * (months / 12)) / 100;
  return principal + interest;
};

export const getMaturityDate = (startDate, months) => {
  const date = new Date(startDate);
  date.setMonth(date.getMonth() + months);
  return date.toISOString();
};

export const isSessionExpired = (lastActivity, timeoutMinutes = 10) => {
  if (!lastActivity) return true;
  const now = new Date().getTime();
  const lastActivityTime = new Date(lastActivity).getTime();
  const diffMinutes = (now - lastActivityTime) / (1000 * 60);
  return diffMinutes >= timeoutMinutes;
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^[0-9]{10}$/;
  return re.test(phone);
};

export const validatePIN = (pin) => {
  const re = /^[0-9]{4}$/;
  return re.test(pin);
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const getAccountTypeColor = (type) => {
  const colors = {
    savings: 'success',
    current: 'primary',
    salary: 'warning',
  };
  return colors[type.toLowerCase()] || 'primary';
};

export const getTransactionTypeColor = (type) => {
  const colors = {
    credit: 'success',
    debit: 'danger',
  };
  return colors[type.toLowerCase()] || 'primary';
};
