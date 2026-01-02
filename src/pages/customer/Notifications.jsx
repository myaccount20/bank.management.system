import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getNotificationsByUserId, markNotificationAsRead } from '../../utils/storage';
import { formatDateTime } from '../../utils/helpers';
import './Customer.css';

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = () => {
    const userNotifications = getNotificationsByUserId(user.id);
    setNotifications(userNotifications);
  };

  const handleMarkAsRead = (notificationId) => {
    markNotificationAsRead(notificationId);
    loadNotifications();
  };

  const handleMarkAllAsRead = () => {
    notifications.forEach(notif => {
      if (!notif.read) {
        markNotificationAsRead(notif.id);
      }
    });
    loadNotifications();
  };

  const filteredNotifications = filter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="page-content">
      <div className="page-header-row">
        <h1 className="page-title">Notifications</h1>
        {unreadCount > 0 && (
          <button onClick={handleMarkAllAsRead} className="btn btn-secondary">
            Mark All as Read
          </button>
        )}
      </div>

      <div className="notification-filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({notifications.length})
        </button>
        <button
          className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
          onClick={() => setFilter('unread')}
        >
          Unread ({unreadCount})
        </button>
      </div>

      <div className="notifications-list">
        {filteredNotifications.length === 0 ? (
          <p className="empty-state">No notifications</p>
        ) : (
          filteredNotifications.map(notification => (
            <div
              key={notification.id}
              className={`notification-card ${notification.read ? 'read' : 'unread'}`}
              onClick={() => !notification.read && handleMarkAsRead(notification.id)}
            >
              <div className="notification-icon">
                {notification.type === 'warning' && '⚠️'}
                {notification.type === 'success' && '✓'}
                {notification.type === 'info' && 'ℹ️'}
              </div>
              <div className="notification-content">
                <div className="notification-header">
                  <h3>{notification.title}</h3>
                  {!notification.read && <span className="unread-dot"></span>}
                </div>
                <p>{notification.message}</p>
                <span className="notification-time">{formatDateTime(notification.date)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
