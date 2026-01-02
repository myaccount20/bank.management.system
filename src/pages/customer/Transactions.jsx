import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  getTransactionsByUserId,
  getAccountsByUserId,
  saveTransaction,
  updateAccount,
  saveNotification,
} from '../../utils/storage';
import { formatCurrency, formatDateTime, generateId } from '../../utils/helpers';
import './Customer.css';

const Transactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [transactionData, setTransactionData] = useState({
    accountId: '',
    type: 'credit',
    amount: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  useEffect(() => {
    filterTransactions();
  }, [transactions, searchTerm, filterType]);

  const loadData = () => {
    const userTransactions = getTransactionsByUserId(user.id);
    const userAccounts = getAccountsByUserId(user.id);
    setTransactions(userTransactions);
    setAccounts(userAccounts);
  };

  const filterTransactions = () => {
    let filtered = [...transactions];

    if (filterType !== 'all') {
      filtered = filtered.filter(t => t.type === filterType);
    }

    if (searchTerm) {
      filtered = filtered.filter(t =>
        t.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTransactions(filtered);
  };

  const handleAddTransaction = () => {
    setError('');

    if (!transactionData.accountId || !transactionData.amount || !transactionData.description) {
      setError('Please fill all fields');
      return;
    }

    const amount = parseFloat(transactionData.amount);
    if (amount <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    const account = accounts.find(a => a.id === transactionData.accountId);

    if (transactionData.type === 'debit' && account.balance < amount) {
      setError('Insufficient balance');
      return;
    }

    const now = new Date().toISOString();
    const transactionAmount = transactionData.type === 'credit' ? amount : -amount;

    saveTransaction({
      id: generateId(),
      userId: user.id,
      accountId: transactionData.accountId,
      type: transactionData.type,
      amount: transactionAmount,
      description: transactionData.description,
      date: now,
      category: transactionData.type === 'credit' ? 'deposit' : 'withdrawal',
    });

    const newBalance = transactionData.type === 'credit'
      ? account.balance + amount
      : account.balance - amount;

    updateAccount(transactionData.accountId, { balance: newBalance });

    if (newBalance < 1000) {
      saveNotification({
        id: generateId(),
        userId: user.id,
        title: 'Low Balance Alert',
        message: `Your ${account.type} account balance is below ₹1,000.`,
        date: now,
        read: false,
        type: 'warning',
      });
    }

    if (amount >= 50000) {
      saveNotification({
        id: generateId(),
        userId: user.id,
        title: 'Large Transaction Alert',
        message: `A ${transactionData.type} of ${formatCurrency(amount)} was made to your ${account.type} account.`,
        date: now,
        read: false,
        type: 'warning',
      });
    }

    loadData();
    setShowAddTransaction(false);
    setTransactionData({ accountId: '', type: 'credit', amount: '', description: '' });
    setSuccess('Transaction added successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="page-content">
      <div className="page-header-row">
        <h1 className="page-title">Transactions</h1>
        <button onClick={() => setShowAddTransaction(true)} className="btn btn-primary">
          + Add Transaction
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="filters-section">
        <div className="input-group" style={{ flex: 1 }}>
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginBottom: 0 }}
          />
        </div>
        <div className="input-group" style={{ width: '200px' }}>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{ marginBottom: 0 }}
          >
            <option value="all">All Types</option>
            <option value="credit">Credit Only</option>
            <option value="debit">Debit Only</option>
          </select>
        </div>
      </div>

      <div className="transactions-table">
        {filteredTransactions.length === 0 ? (
          <p className="empty-state">No transactions found</p>
        ) : (
          filteredTransactions.map(transaction => {
            const account = accounts.find(a => a.id === transaction.accountId);
            return (
              <div key={transaction.id} className="transaction-row">
                <div className="transaction-icon">
                  {transaction.type === 'credit' ? '💵' : '💸'}
                </div>
                <div className="transaction-info">
                  <div className="transaction-desc">{transaction.description}</div>
                  <div className="transaction-meta">
                    <span className="transaction-date">{formatDateTime(transaction.date)}</span>
                    <span className="transaction-account">
                      {account ? `${account.type.toUpperCase()}` : 'N/A'}
                    </span>
                  </div>
                </div>
                <div className={`transaction-amount ${transaction.type === 'credit' ? 'credit' : 'debit'}`}>
                  {transaction.type === 'credit' ? '+' : '-'}
                  {formatCurrency(Math.abs(transaction.amount))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {showAddTransaction && (
        <div className="modal-overlay" onClick={() => setShowAddTransaction(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add Transaction</h2>
            <div className="input-group">
              <label>Account</label>
              <select
                value={transactionData.accountId}
                onChange={(e) => setTransactionData({ ...transactionData, accountId: e.target.value })}
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
              <label>Type</label>
              <select
                value={transactionData.type}
                onChange={(e) => setTransactionData({ ...transactionData, type: e.target.value })}
              >
                <option value="credit">Credit (Deposit)</option>
                <option value="debit">Debit (Withdrawal)</option>
              </select>
            </div>
            <div className="input-group">
              <label>Amount</label>
              <input
                type="number"
                value={transactionData.amount}
                onChange={(e) => setTransactionData({ ...transactionData, amount: e.target.value })}
                placeholder="Enter amount"
                step="0.01"
              />
            </div>
            <div className="input-group">
              <label>Description</label>
              <input
                type="text"
                value={transactionData.description}
                onChange={(e) => setTransactionData({ ...transactionData, description: e.target.value })}
                placeholder="Enter description"
              />
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="modal-actions">
              <button onClick={handleAddTransaction} className="btn btn-primary">
                Add Transaction
              </button>
              <button onClick={() => {
                setShowAddTransaction(false);
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

export default Transactions;
