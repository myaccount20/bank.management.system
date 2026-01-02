import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  getAccountsByUserId,
  getTransactionsByUserId,
  getNotificationsByUserId,
} from '../../utils/storage';
import { formatCurrency, formatDateTime } from '../../utils/helpers';
import './Customer.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);

  useEffect(() => {
    if (user) {
      const userAccounts = getAccountsByUserId(user.id);
      const userTransactions = getTransactionsByUserId(user.id).slice(0, 5);
      const userNotifications = getNotificationsByUserId(user.id).filter(n => !n.read).slice(0, 3);

      setAccounts(userAccounts);
      setTransactions(userTransactions);
      setNotifications(userNotifications);

      const total = userAccounts.reduce((sum, account) => sum + account.balance, 0);
      setTotalBalance(total);
    }
  }, [user]);

  return (
    <div className="page-content">
      <h1 className="page-title">Dashboard</h1>

      <div className="dashboard-grid">
        <div className="stat-card-large">
          <div className="stat-icon">💰</div>
          <div>
            <div className="stat-label">Total Balance</div>
            <div className="stat-value">{formatCurrency(totalBalance)}</div>
          </div>
        </div>

        <div className="stat-card-large">
          <div className="stat-icon">💳</div>
          <div>
            <div className="stat-label">Active Accounts</div>
            <div className="stat-value">{accounts.length}</div>
          </div>
        </div>

        <div className="stat-card-large">
          <div className="stat-icon">📊</div>
          <div>
            <div className="stat-label">Transactions</div>
            <div className="stat-value">{transactions.length}</div>
          </div>
        </div>

        <div className="stat-card-large">
          <div className="stat-icon">🔔</div>
          <div>
            <div className="stat-label">Unread Alerts</div>
            <div className="stat-value">{notifications.length}</div>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-section">
          <h2 className="section-heading">Your Accounts</h2>
          <div className="accounts-list">
            {accounts.map(account => (
              <div key={account.id} className="account-card-mini">
                <div className="account-info">
                  <div className="account-type">{account.type.toUpperCase()}</div>
                  <div className="account-number-small">****{account.accountNumber.slice(-4)}</div>
                </div>
                <div className="account-balance-large">
                  {formatCurrency(account.balance)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-section">
          <h2 className="section-heading">Recent Transactions</h2>
          {transactions.length === 0 ? (
            <p className="empty-state">No transactions yet</p>
          ) : (
            <div className="transactions-list">
              {transactions.map(transaction => (
                <div key={transaction.id} className="transaction-item">
                  <div className="transaction-details">
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
      </div>

      {notifications.length > 0 && (
        <div className="alerts-section">
          <h2 className="section-heading">Recent Alerts</h2>
          <div className="alerts-list">
            {notifications.map(notification => (
              <div key={notification.id} className="alert-item">
                <div className="alert-icon">
                  {notification.type === 'warning' ? '⚠️' : notification.type === 'success' ? '✓' : 'ℹ️'}
                </div>
                <div className="alert-content">
                  <div className="alert-title">{notification.title}</div>
                  <div className="alert-message">{notification.message}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
