import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  getFixedDepositsByUserId,
  getAccountsByUserId,
  saveFixedDeposit,
  updateAccount,
  saveTransaction,
  saveNotification,
} from '../../utils/storage';
import {
  formatCurrency,
  formatDate,
  calculateFDMaturityAmount,
  getMaturityDate,
  generateId,
} from '../../utils/helpers';
import './Customer.css';

const FixedDeposit = () => {
  const { user } = useAuth();
  const [fixedDeposits, setFixedDeposits] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [showCreateFD, setShowCreateFD] = useState(false);
  const [fdData, setFdData] = useState({
    accountId: '',
    amount: '',
    tenure: '6',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const INTEREST_RATE = 6.5;

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = () => {
    const userFDs = getFixedDepositsByUserId(user.id);
    const userAccounts = getAccountsByUserId(user.id);
    setFixedDeposits(userFDs);
    setAccounts(userAccounts);
  };

  const handleCreateFD = () => {
    setError('');

    if (!fdData.accountId || !fdData.amount) {
      setError('Please fill all fields');
      return;
    }

    const amount = parseFloat(fdData.amount);
    if (amount < 5000) {
      setError('Minimum FD amount is ₹5,000');
      return;
    }

    const account = accounts.find(a => a.id === fdData.accountId);

    if (account.balance < amount) {
      setError('Insufficient balance');
      return;
    }

    const now = new Date().toISOString();
    const tenure = parseInt(fdData.tenure);
    const maturityAmount = calculateFDMaturityAmount(amount, INTEREST_RATE, tenure);
    const maturityDate = getMaturityDate(now, tenure);

    const fd = {
      id: generateId(),
      userId: user.id,
      accountId: fdData.accountId,
      amount: amount,
      interestRate: INTEREST_RATE,
      tenure: tenure,
      maturityAmount: maturityAmount,
      maturityDate: maturityDate,
      createdAt: now,
      status: 'active',
    };

    saveFixedDeposit(fd);

    updateAccount(fdData.accountId, { balance: account.balance - amount });

    saveTransaction({
      id: generateId(),
      userId: user.id,
      accountId: fdData.accountId,
      type: 'debit',
      amount: -amount,
      description: `Fixed Deposit created for ${tenure} months`,
      date: now,
      category: 'fixed_deposit',
    });

    saveNotification({
      id: generateId(),
      userId: user.id,
      title: 'Fixed Deposit Created',
      message: `Your FD of ${formatCurrency(amount)} has been created successfully.`,
      date: now,
      read: false,
      type: 'success',
    });

    loadData();
    setShowCreateFD(false);
    setFdData({ accountId: '', amount: '', tenure: '6' });
    setSuccess('Fixed Deposit created successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="page-content">
      <div className="page-header-row">
        <h1 className="page-title">Fixed Deposits</h1>
        <button onClick={() => setShowCreateFD(true)} className="btn btn-primary">
          + Create FD
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="info-card">
        <h3>Fixed Deposit Interest Rate: {INTEREST_RATE}% per annum</h3>
        <p>Simple interest calculated on your deposit amount</p>
      </div>

      <div className="fd-grid">
        {fixedDeposits.length === 0 ? (
          <p className="empty-state">No fixed deposits yet</p>
        ) : (
          fixedDeposits.map(fd => {
            const account = accounts.find(a => a.id === fd.accountId);
            return (
              <div key={fd.id} className="fd-card">
                <div className="fd-header">
                  <span className={`badge badge-${fd.status === 'active' ? 'success' : 'warning'}`}>
                    {fd.status.toUpperCase()}
                  </span>
                  <span className="fd-tenure">{fd.tenure} Months</span>
                </div>
                <div className="fd-amount">
                  <div className="fd-label">Deposit Amount</div>
                  <div className="fd-value">{formatCurrency(fd.amount)}</div>
                </div>
                <div className="fd-details">
                  <div className="fd-detail-item">
                    <span className="fd-detail-label">Interest Rate:</span>
                    <span className="fd-detail-value">{fd.interestRate}%</span>
                  </div>
                  <div className="fd-detail-item">
                    <span className="fd-detail-label">Maturity Amount:</span>
                    <span className="fd-detail-value">{formatCurrency(fd.maturityAmount)}</span>
                  </div>
                  <div className="fd-detail-item">
                    <span className="fd-detail-label">Maturity Date:</span>
                    <span className="fd-detail-value">{formatDate(fd.maturityDate)}</span>
                  </div>
                  <div className="fd-detail-item">
                    <span className="fd-detail-label">Account:</span>
                    <span className="fd-detail-value">
                      {account ? account.type.toUpperCase() : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {showCreateFD && (
        <div className="modal-overlay" onClick={() => setShowCreateFD(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Create Fixed Deposit</h2>
            <div className="info-box">
              <p>Interest Rate: {INTEREST_RATE}% per annum (Simple Interest)</p>
              <p>Minimum Amount: ₹5,000</p>
            </div>
            <div className="input-group">
              <label>Select Account</label>
              <select
                value={fdData.accountId}
                onChange={(e) => setFdData({ ...fdData, accountId: e.target.value })}
              >
                <option value="">Select Account</option>
                {accounts.map(account => (
                  <option key={account.id} value={account.id}>
                    {account.type.toUpperCase()} - {formatCurrency(account.balance)}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label>Amount</label>
              <input
                type="number"
                value={fdData.amount}
                onChange={(e) => setFdData({ ...fdData, amount: e.target.value })}
                placeholder="Minimum ₹5,000"
                min="5000"
                step="1000"
              />
            </div>
            <div className="input-group">
              <label>Tenure</label>
              <select
                value={fdData.tenure}
                onChange={(e) => setFdData({ ...fdData, tenure: e.target.value })}
              >
                <option value="6">6 Months</option>
                <option value="12">12 Months</option>
                <option value="24">24 Months</option>
              </select>
            </div>
            {fdData.amount >= 5000 && (
              <div className="calculation-preview">
                <p><strong>Maturity Amount:</strong> {formatCurrency(
                  calculateFDMaturityAmount(parseFloat(fdData.amount), INTEREST_RATE, parseInt(fdData.tenure))
                )}</p>
                <p><strong>Interest Earned:</strong> {formatCurrency(
                  calculateFDMaturityAmount(parseFloat(fdData.amount), INTEREST_RATE, parseInt(fdData.tenure)) - parseFloat(fdData.amount)
                )}</p>
              </div>
            )}
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="modal-actions">
              <button onClick={handleCreateFD} className="btn btn-primary">
                Create FD
              </button>
              <button onClick={() => {
                setShowCreateFD(false);
                setError('');
              }} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FixedDeposit;
