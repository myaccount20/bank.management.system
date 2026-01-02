import { useEffect, useState } from 'react';
import { getAllUsers, updateUser, getAccountsByUserId } from '../../utils/storage';
import { formatCurrency, formatDate } from '../../utils/helpers';
import './Admin.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const allUsers = getAllUsers();
    setUsers(allUsers);
  };

  const handleToggleLock = (userId, currentStatus) => {
    updateUser(userId, { locked: !currentStatus, failedAttempts: 0 });
    loadUsers();
    if (selectedUser?.id === userId) {
      setSelectedUser({ ...selectedUser, locked: !currentStatus });
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.accountNumber.includes(searchTerm);
    const matchesFilter = filterStatus === 'all' ||
                         (filterStatus === 'active' && !user.locked) ||
                         (filterStatus === 'locked' && user.locked);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="admin-content">
      <h1 className="page-title">User Management</h1>

      <div className="admin-filters">
        <div className="input-group" style={{ flex: 1 }}>
          <input
            type="text"
            placeholder="Search by name, email, or account number..."
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
            <option value="all">All Users</option>
            <option value="active">Active Only</option>
            <option value="locked">Locked Only</option>
          </select>
        </div>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Account Number</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.accountNumber}</td>
                  <td>{user.phone}</td>
                  <td>
                    <span className={`badge badge-${user.locked ? 'danger' : 'success'}`}>
                      {user.locked ? 'LOCKED' : 'ACTIVE'}
                    </span>
                  </td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td>
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="btn btn-secondary btn-sm"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleToggleLock(user.id, user.locked)}
                      className={`btn btn-sm ${user.locked ? 'btn-success' : 'btn-danger'}`}
                      style={{ marginLeft: '0.5rem' }}
                    >
                      {user.locked ? 'Unlock' : 'Lock'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>User Details</h2>
            <div className="user-details">
              <div className="detail-row">
                <span className="detail-label">Name:</span>
                <span className="detail-value">{selectedUser.name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{selectedUser.email}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Phone:</span>
                <span className="detail-value">{selectedUser.phone}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Account Number:</span>
                <span className="detail-value">{selectedUser.accountNumber}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <span className={`badge badge-${selectedUser.locked ? 'danger' : 'success'}`}>
                  {selectedUser.locked ? 'LOCKED' : 'ACTIVE'}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Failed Attempts:</span>
                <span className="detail-value">{selectedUser.failedAttempts || 0}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Joined:</span>
                <span className="detail-value">{formatDate(selectedUser.createdAt)}</span>
              </div>

              <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Accounts</h3>
              {getAccountsByUserId(selectedUser.id).map(account => (
                <div key={account.id} className="account-summary">
                  <span>{account.type.toUpperCase()}</span>
                  <span>{formatCurrency(account.balance)}</span>
                </div>
              ))}
            </div>
            <div className="modal-actions">
              <button onClick={() => setSelectedUser(null)} className="btn btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
