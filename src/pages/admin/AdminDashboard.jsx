import { useEffect, useState } from 'react';
import {
  getAllUsers,
  getAllAccounts,
  getAllTransactions,
  getAllFixedDeposits,
} from '../../utils/storage';
import { formatCurrency } from '../../utils/helpers';
import './Admin.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAccounts: 0,
    totalBalance: 0,
    totalTransactions: 0,
    totalDeposits: 0,
    totalFDs: 0,
    activeUsers: 0,
    lockedUsers: 0,
  });

  useEffect(() => {
    const users = getAllUsers();
    const accounts = getAllAccounts();
    const transactions = getAllTransactions();
    const fds = getAllFixedDeposits();

    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    const totalDeposits = transactions
      .filter(t => t.type === 'credit')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const totalFDAmount = fds.reduce((sum, fd) => sum + fd.amount, 0);
    const activeUsers = users.filter(u => !u.locked).length;
    const lockedUsers = users.filter(u => u.locked).length;

    setStats({
      totalUsers: users.length,
      totalAccounts: accounts.length,
      totalBalance,
      totalTransactions: transactions.length,
      totalDeposits,
      totalFDs: totalFDAmount,
      activeUsers,
      lockedUsers,
    });
  }, []);

  return (
    <div className="admin-content">
      <h1 className="page-title">Admin Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-box">
          <div className="stat-icon">👥</div>
          <div className="stat-details">
            <div className="stat-label">Total Users</div>
            <div className="stat-value">{stats.totalUsers}</div>
            <div className="stat-meta">
              {stats.activeUsers} active, {stats.lockedUsers} locked
            </div>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-icon">💳</div>
          <div className="stat-details">
            <div className="stat-label">Total Accounts</div>
            <div className="stat-value">{stats.totalAccounts}</div>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-icon">💰</div>
          <div className="stat-details">
            <div className="stat-label">Total Balance</div>
            <div className="stat-value">{formatCurrency(stats.totalBalance)}</div>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-icon">💸</div>
          <div className="stat-details">
            <div className="stat-label">Total Transactions</div>
            <div className="stat-value">{stats.totalTransactions}</div>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-icon">💵</div>
          <div className="stat-details">
            <div className="stat-label">Total Deposits</div>
            <div className="stat-value">{formatCurrency(stats.totalDeposits)}</div>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-icon">📈</div>
          <div className="stat-details">
            <div className="stat-label">Fixed Deposits</div>
            <div className="stat-value">{formatCurrency(stats.totalFDs)}</div>
          </div>
        </div>
      </div>

      <div className="summary-section">
        <h2 className="section-heading">System Overview</h2>
        <div className="summary-grid">
          <div className="summary-card">
            <h3>User Statistics</h3>
            <div className="summary-item">
              <span>Active Users:</span>
              <span className="value">{stats.activeUsers}</span>
            </div>
            <div className="summary-item">
              <span>Locked Users:</span>
              <span className="value">{stats.lockedUsers}</span>
            </div>
            <div className="summary-item">
              <span>Average Balance:</span>
              <span className="value">
                {formatCurrency(stats.totalUsers > 0 ? stats.totalBalance / stats.totalUsers : 0)}
              </span>
            </div>
          </div>

          <div className="summary-card">
            <h3>Financial Summary</h3>
            <div className="summary-item">
              <span>Total in Accounts:</span>
              <span className="value">{formatCurrency(stats.totalBalance)}</span>
            </div>
            <div className="summary-item">
              <span>Total in FDs:</span>
              <span className="value">{formatCurrency(stats.totalFDs)}</span>
            </div>
            <div className="summary-item">
              <span>Grand Total:</span>
              <span className="value success">{formatCurrency(stats.totalBalance + stats.totalFDs)}</span>
            </div>
          </div>

          <div className="summary-card">
            <h3>Activity</h3>
            <div className="summary-item">
              <span>Total Transactions:</span>
              <span className="value">{stats.totalTransactions}</span>
            </div>
            <div className="summary-item">
              <span>Avg. per User:</span>
              <span className="value">
                {stats.totalUsers > 0 ? Math.round(stats.totalTransactions / stats.totalUsers) : 0}
              </span>
            </div>
            <div className="summary-item">
              <span>Accounts per User:</span>
              <span className="value">
                {stats.totalUsers > 0 ? (stats.totalAccounts / stats.totalUsers).toFixed(1) : 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
