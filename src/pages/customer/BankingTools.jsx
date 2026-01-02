import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { calculateEMI, formatCurrency } from '../../utils/helpers';
import {
  getRecurringTransfersByUserId,
  getAccountsByUserId,
  saveRecurringTransfer,
  updateRecurringTransfer,
} from '../../utils/storage';
import { generateId } from '../../utils/helpers';
import { useEffect } from 'react';
import './Customer.css';

const BankingTools = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('emi');

  const [emiData, setEmiData] = useState({
    principal: '',
    rate: '',
    months: '',
  });
  const [emiResult, setEmiResult] = useState(null);

  const [accounts, setAccounts] = useState([]);
  const [recurringTransfers, setRecurringTransfers] = useState([]);
  const [showAddTransfer, setShowAddTransfer] = useState(false);
  const [transferData, setTransferData] = useState({
    fromAccount: '',
    toAccount: '',
    amount: '',
    frequency: 'monthly',
    description: '',
  });
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      const userAccounts = getAccountsByUserId(user.id);
      const userTransfers = getRecurringTransfersByUserId(user.id);
      setAccounts(userAccounts);
      setRecurringTransfers(userTransfers);
    }
  }, [user]);

  const handleEMICalculate = (e) => {
    e.preventDefault();
    const principal = parseFloat(emiData.principal);
    const rate = parseFloat(emiData.rate);
    const months = parseInt(emiData.months);

    if (principal > 0 && rate >= 0 && months > 0) {
      const emi = calculateEMI(principal, rate, months);
      const totalAmount = emi * months;
      const totalInterest = totalAmount - principal;

      setEmiResult({
        emi,
        totalAmount,
        totalInterest,
        principal,
        months,
      });
    }
  };

  const handleAddRecurringTransfer = () => {
    const newTransfer = {
      id: generateId(),
      userId: user.id,
      fromAccount: transferData.fromAccount,
      toAccount: transferData.toAccount,
      amount: parseFloat(transferData.amount),
      frequency: transferData.frequency,
      description: transferData.description || 'Recurring Transfer',
      status: 'active',
      createdAt: new Date().toISOString(),
      nextExecution: new Date().toISOString(),
    };

    saveRecurringTransfer(newTransfer);
    setRecurringTransfers([...recurringTransfers, newTransfer]);
    setShowAddTransfer(false);
    setTransferData({ fromAccount: '', toAccount: '', amount: '', frequency: 'monthly', description: '' });
    setSuccess('Recurring transfer setup successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const toggleTransferStatus = (transferId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    updateRecurringTransfer(transferId, { status: newStatus });
    setRecurringTransfers(recurringTransfers.map(t =>
      t.id === transferId ? { ...t, status: newStatus } : t
    ));
  };

  return (
    <div className="page-content">
      <h1 className="page-title">Banking Tools</h1>

      {success && <div className="alert alert-success">{success}</div>}

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'emi' ? 'active' : ''}`}
          onClick={() => setActiveTab('emi')}
        >
          EMI Calculator
        </button>
        <button
          className={`tab ${activeTab === 'recurring' ? 'active' : ''}`}
          onClick={() => setActiveTab('recurring')}
        >
          Recurring Transfers
        </button>
      </div>

      {activeTab === 'emi' && (
        <div className="tool-section">
          <div className="tool-grid">
            <div className="tool-form">
              <h2>Loan EMI Calculator</h2>
              <form onSubmit={handleEMICalculate}>
                <div className="input-group">
                  <label>Loan Amount (₹)</label>
                  <input
                    type="number"
                    value={emiData.principal}
                    onChange={(e) => setEmiData({ ...emiData, principal: e.target.value })}
                    placeholder="Enter loan amount"
                    step="1000"
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Interest Rate (% per annum)</label>
                  <input
                    type="number"
                    value={emiData.rate}
                    onChange={(e) => setEmiData({ ...emiData, rate: e.target.value })}
                    placeholder="Enter interest rate"
                    step="0.1"
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Loan Tenure (months)</label>
                  <input
                    type="number"
                    value={emiData.months}
                    onChange={(e) => setEmiData({ ...emiData, months: e.target.value })}
                    placeholder="Enter tenure"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-block">
                  Calculate EMI
                </button>
              </form>
            </div>

            <div className="tool-result">
              <h2>EMI Breakdown</h2>
              {emiResult ? (
                <div className="result-details">
                  <div className="result-item highlight">
                    <span className="result-label">Monthly EMI</span>
                    <span className="result-value">{formatCurrency(emiResult.emi)}</span>
                  </div>
                  <div className="result-item">
                    <span className="result-label">Principal Amount</span>
                    <span className="result-value">{formatCurrency(emiResult.principal)}</span>
                  </div>
                  <div className="result-item">
                    <span className="result-label">Total Interest</span>
                    <span className="result-value">{formatCurrency(emiResult.totalInterest)}</span>
                  </div>
                  <div className="result-item">
                    <span className="result-label">Total Amount</span>
                    <span className="result-value">{formatCurrency(emiResult.totalAmount)}</span>
                  </div>
                  <div className="result-item">
                    <span className="result-label">Tenure</span>
                    <span className="result-value">{emiResult.months} months</span>
                  </div>
                </div>
              ) : (
                <p className="empty-state">Enter loan details to calculate EMI</p>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'recurring' && (
        <div className="tool-section">
          <div className="section-header">
            <h2>Recurring Transfers</h2>
            <button onClick={() => setShowAddTransfer(true)} className="btn btn-primary">
              + Add Recurring Transfer
            </button>
          </div>

          <p className="section-description">
            Set up automatic transfers between your accounts. Transfers will be simulated based on frequency.
          </p>

          <div className="recurring-transfers-list">
            {recurringTransfers.length === 0 ? (
              <p className="empty-state">No recurring transfers set up</p>
            ) : (
              recurringTransfers.map(transfer => {
                const fromAcc = accounts.find(a => a.id === transfer.fromAccount);
                const toAcc = accounts.find(a => a.id === transfer.toAccount);
                return (
                  <div key={transfer.id} className="recurring-transfer-card">
                    <div className="transfer-info">
                      <h3>{transfer.description}</h3>
                      <p>
                        From: {fromAcc?.type.toUpperCase()} → To: {toAcc?.type.toUpperCase()}
                      </p>
                      <p>Amount: {formatCurrency(transfer.amount)} • Frequency: {transfer.frequency}</p>
                    </div>
                    <div className="transfer-actions">
                      <span className={`badge badge-${transfer.status === 'active' ? 'success' : 'warning'}`}>
                        {transfer.status.toUpperCase()}
                      </span>
                      <button
                        onClick={() => toggleTransferStatus(transfer.id, transfer.status)}
                        className={`btn ${transfer.status === 'active' ? 'btn-secondary' : 'btn-success'}`}
                      >
                        {transfer.status === 'active' ? 'Pause' : 'Resume'}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {showAddTransfer && (
            <div className="modal-overlay" onClick={() => setShowAddTransfer(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Setup Recurring Transfer</h2>
                <div className="input-group">
                  <label>From Account</label>
                  <select
                    value={transferData.fromAccount}
                    onChange={(e) => setTransferData({ ...transferData, fromAccount: e.target.value })}
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
                  <label>To Account</label>
                  <select
                    value={transferData.toAccount}
                    onChange={(e) => setTransferData({ ...transferData, toAccount: e.target.value })}
                  >
                    <option value="">Select Account</option>
                    {accounts.filter(a => a.id !== transferData.fromAccount).map(account => (
                      <option key={account.id} value={account.id}>
                        {account.type.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label>Amount</label>
                  <input
                    type="number"
                    value={transferData.amount}
                    onChange={(e) => setTransferData({ ...transferData, amount: e.target.value })}
                    placeholder="Enter amount"
                    step="0.01"
                  />
                </div>
                <div className="input-group">
                  <label>Frequency</label>
                  <select
                    value={transferData.frequency}
                    onChange={(e) => setTransferData({ ...transferData, frequency: e.target.value })}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Description (Optional)</label>
                  <input
                    type="text"
                    value={transferData.description}
                    onChange={(e) => setTransferData({ ...transferData, description: e.target.value })}
                    placeholder="Enter description"
                  />
                </div>
                <div className="modal-actions">
                  <button onClick={handleAddRecurringTransfer} className="btn btn-primary">
                    Setup Transfer
                  </button>
                  <button onClick={() => setShowAddTransfer(false)} className="btn btn-secondary">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BankingTools;
