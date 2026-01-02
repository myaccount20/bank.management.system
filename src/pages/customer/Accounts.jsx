import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  getAccountsByUserId,
  getTransactionsByAccountId,
  saveAccount,
  updateAccount,
  saveTransaction,
  saveNotification,
} from '../../utils/storage';
import { formatCurrency, formatDateTime, generateId, getAccountTypeColor } from '../../utils/helpers';
import './Customer.css';

const Accounts = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [newAccountType, setNewAccountType] = useState('savings');
  const [transferData, setTransferData] = useState({
    fromAccount: '',
    toAccount: '',
    amount: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      loadAccounts();
    }
  }, [user]);

  const loadAccounts = () => {
    const userAccounts = getAccountsByUserId(user.id);
    setAccounts(userAccounts);
    if (userAccounts.length > 0 && !selectedAccount) {
      setSelectedAccount(userAccounts[0]);
    }
  };

  useEffect(() => {
    if (selectedAccount) {
      const accountTransactions = getTransactionsByAccountId(selectedAccount.id);
      setTransactions(accountTransactions);
    }
  }, [selectedAccount]);

  const handleAddAccount = () => {
    const newAccount = {
      id: generateId(),
      userId: user.id,
      accountNumber: user.accountNumber,
      type: newAccountType,
      balance: 0,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    saveAccount(newAccount);
    loadAccounts();
    setShowAddAccount(false);
    setSuccess('New account added successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleTransfer = () => {
    setError('');

    if (!transferData.fromAccount || !transferData.toAccount || !transferData.amount) {
      setError('Please fill all fields');
      return;
    }

    const amount = parseFloat(transferData.amount);
    if (amount <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    const fromAcc = accounts.find(a => a.id === transferData.fromAccount);
    const toAcc = accounts.find(a => a.id === transferData.toAccount);

    if (!fromAcc || !toAcc) {
      setError('Invalid accounts selected');
      return;
    }

    if (fromAcc.balance < amount) {
      setError('Insufficient balance');
      return;
    }

    const now = new Date().toISOString();

    updateAccount(fromAcc.id, { balance: fromAcc.balance - amount });
    updateAccount(toAcc.id, { balance: toAcc.balance + amount });

    saveTransaction({
      id: generateId(),
      userId: user.id,
      accountId: fromAcc.id,
      type: 'debit',
      amount: -amount,
      description: transferData.description || `Transfer to ${toAcc.type} account`,
      date: now,
      category: 'transfer',
    });

    saveTransaction({
      id: generateId(),
      userId: user.id,
      accountId: toAcc.id,
      type: 'credit',
      amount: amount,
      description: transferData.description || `Transfer from ${fromAcc.type} account`,
      date: now,
      category: 'transfer',
    });

    if (amount >= 50000) {
      saveNotification({
        id: generateId(),
        userId: user.id,
        title: 'Large Transaction Alert',
        message: `A transfer of ${formatCurrency(amount)} was made from your ${fromAcc.type} account.`,
        date: now,
        read: false,
        type: 'warning',
      });
    }

    loadAccounts();
    setShowTransfer(false);
    setTransferData({ fromAccount: '', toAccount: '', amount: '', description: '' });
    setSuccess('Transfer completed successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="page-content">
      <div className="page-header-row">
        <h1 className="page-title">My Accounts</h1>
        <div className="button-group">
          <button onClick={() => setShowAddAccount(true)} className="btn btn-primary">
            + Add Account
          </button>
          <button onClick={() => setShowTransfer(true)} className="btn btn-success">
            Transfer Money
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="accounts-grid">
        {accounts.map(account => (
          <div
            key={account.id}
            className={`account-card ${selectedAccount?.id === account.id ? 'selected' : ''}`}
            onClick={() => setSelectedAccount(account)}
          >
            <div className="account-card-header">
              <span className={`badge badge-${getAccountTypeColor(account.type)}`}>
                {account.type.toUpperCase()}
              </span>
              <span className="account-status">{account.status}</span>
            </div>
            <div className="account-card-balance">
              {formatCurrency(account.balance)}
            </div>
            <div className="account-card-number">
              A/C: ****{account.accountNumber.slice(-4)}
            </div>
          </div>
        ))}
      </div>

      {selectedAccount && (
        <div className="account-details-section">
          <h2 className="section-heading">Transaction History - {selectedAccount.type.toUpperCase()}</h2>
          {transactions.length === 0 ? (
            <p className="empty-state">No transactions yet</p>
          ) : (
            <div className="transactions-table">
              {transactions.map(transaction => (
                <div key={transaction.id} className="transaction-row">
                  <div className="transaction-icon">
                    {transaction.type === 'credit' ? '💵' : '💸'}
                  </div>
                  <div className="transaction-info">
                    <div className="transaction-desc">{transaction.description}</div>
                    <div className="transaction-date">{formatDateTime(transaction.date)}</div>
                  </div>
                  <div className={`transaction-amount ${transaction.type === 'credit' ? 'credit' : 'debit'}`}>
                    {transaction.type === 'credit' ? '+' : '-'}
                    {formatCurrency(Math.abs(transaction.amount))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showAddAccount && (
        <div className="modal-overlay" onClick={() => setShowAddAccount(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Account</h2>
            <div className="input-group">
              <label>Account Type</label>
              <select value={newAccountType} onChange={(e) => setNewAccountType(e.target.value)}>
                <option value="savings">Savings Account</option>
                <option value="current">Current Account</option>
                <option value="salary">Salary Account</option>
              </select>
            </div>
            <div className="modal-actions">
              <button onClick={handleAddAccount} className="btn btn-primary">
                Add Account
              </button>
              <button onClick={() => setShowAddAccount(false)} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showTransfer && (
        <div className="modal-overlay" onClick={() => setShowTransfer(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Transfer Money</h2>
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
              <label>Description (Optional)</label>
              <input
                type="text"
                value={transferData.description}
                onChange={(e) => setTransferData({ ...transferData, description: e.target.value })}
                placeholder="Enter description"
              />
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="modal-actions">
              <button onClick={handleTransfer} className="btn btn-success">
                Transfer
              </button>
              <button onClick={() => {
                setShowTransfer(false);
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

export default Accounts;
