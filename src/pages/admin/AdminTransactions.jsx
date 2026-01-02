import { useEffect, useState } from 'react';
import { getAllTransactions, getAllUsers } from '../../utils/storage';
import { formatCurrency, formatDateTime } from '../../utils/helpers';
import './Admin.css';

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    const allTransactions = getAllTransactions();
    const allUsers = getAllUsers();
    setTransactions(allTransactions);
    setUsers(allUsers);
  }, []);

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unknown User';
  };

  const filteredTransactions = transactions.filter(transaction => {
    const userName = getUserName(transaction.userId);
    const matchesSearch = userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || transaction.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const totalCredit = filteredTransactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalDebit = filteredTransactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <div className="admin-content">
      <h1 className="page-title">Transactions</h1>

      <div className="summary-stats">
        <div className="stat-mini success">
          <div className="stat-mini-label">Total Credits</div>
          <div className="stat-mini-value">{formatCurrency(totalCredit)}</div>
        </div>
        <div className="stat-mini danger">
          <div className="stat-mini-label">Total Debits</div>
          <div className="stat-mini-value">{formatCurrency(totalDebit)}</div>
        </div>
        <div className="stat-mini primary">
          <div className="stat-mini-label">Net Balance</div>
          <div className="stat-mini-value">{formatCurrency(totalCredit - totalDebit)}</div>
        </div>
      </div>

      <div className="admin-filters">
        <div className="input-group" style={{ flex: 1 }}>
          <input
            type="text"
            placeholder="Search by user name or description..."
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

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>User</th>
              <th>Description</th>
              <th>Type</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                  No transactions found
                </td>
              </tr>
            ) : (
              filteredTransactions.map(transaction => (
                <tr key={transaction.id}>
                  <td>{formatDateTime(transaction.date)}</td>
                  <td>{getUserName(transaction.userId)}</td>
                  <td>{transaction.description}</td>
                  <td>
                    <span className={`badge badge-${transaction.type === 'credit' ? 'success' : 'danger'}`}>
                      {transaction.type.toUpperCase()}
                    </span>
                  </td>
                  <td className={transaction.type === 'credit' ? 'amount-credit' : 'amount-debit'}>
                    {transaction.type === 'credit' ? '+' : '-'}
                    {formatCurrency(Math.abs(transaction.amount))}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTransactions;
