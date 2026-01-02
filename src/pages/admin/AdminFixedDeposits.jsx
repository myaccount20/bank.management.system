import { useEffect, useState } from 'react';
import { getAllFixedDeposits, getAllUsers } from '../../utils/storage';
import { formatCurrency, formatDate } from '../../utils/helpers';
import './Admin.css';

const AdminFixedDeposits = () => {
  const [fixedDeposits, setFixedDeposits] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const allFDs = getAllFixedDeposits();
    const allUsers = getAllUsers();
    setFixedDeposits(allFDs);
    setUsers(allUsers);
  }, []);

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unknown User';
  };

  const filteredFDs = fixedDeposits.filter(fd => {
    const userName = getUserName(fd.userId);
    const matchesSearch = userName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || fd.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalFDAmount = filteredFDs.reduce((sum, fd) => sum + fd.amount, 0);
  const totalMaturityAmount = filteredFDs.reduce((sum, fd) => sum + fd.maturityAmount, 0);
  const totalInterest = totalMaturityAmount - totalFDAmount;

  return (
    <div className="admin-content">
      <h1 className="page-title">Fixed Deposits</h1>

      <div className="summary-stats">
        <div className="stat-mini primary">
          <div className="stat-mini-label">Total FDs</div>
          <div className="stat-mini-value">{filteredFDs.length}</div>
        </div>
        <div className="stat-mini success">
          <div className="stat-mini-label">Total Deposited</div>
          <div className="stat-mini-value">{formatCurrency(totalFDAmount)}</div>
        </div>
        <div className="stat-mini warning">
          <div className="stat-mini-label">Total Interest</div>
          <div className="stat-mini-value">{formatCurrency(totalInterest)}</div>
        </div>
        <div className="stat-mini primary">
          <div className="stat-mini-label">Total Maturity</div>
          <div className="stat-mini-value">{formatCurrency(totalMaturityAmount)}</div>
        </div>
      </div>

      <div className="admin-filters">
        <div className="input-group" style={{ flex: 1 }}>
          <input
            type="text"
            placeholder="Search by user name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginBottom: 0 }}
          />
        </div>
        <div className="input-group" style={{ width: '200px' }}>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ marginBottom: 0 }}
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="matured">Matured Only</option>
          </select>
        </div>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Amount</th>
              <th>Interest Rate</th>
              <th>Tenure</th>
              <th>Maturity Amount</th>
              <th>Maturity Date</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {filteredFDs.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>
                  No fixed deposits found
                </td>
              </tr>
            ) : (
              filteredFDs.map(fd => (
                <tr key={fd.id}>
                  <td>{getUserName(fd.userId)}</td>
                  <td>{formatCurrency(fd.amount)}</td>
                  <td>{fd.interestRate}%</td>
                  <td>{fd.tenure} months</td>
                  <td>{formatCurrency(fd.maturityAmount)}</td>
                  <td>{formatDate(fd.maturityDate)}</td>
                  <td>
                    <span className={`badge badge-${fd.status === 'active' ? 'success' : 'warning'}`}>
                      {fd.status.toUpperCase()}
                    </span>
                  </td>
                  <td>{formatDate(fd.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminFixedDeposits;
