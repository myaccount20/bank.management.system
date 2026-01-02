import { createContext, useContext, useState, useEffect } from 'react';
import {
  getCurrentUser,
  setCurrentUser,
  clearCurrentUser,
  getUserById,
  updateUser,
  saveLoginHistory,
} from '../utils/storage';
import { isSessionExpired, generateId } from '../utils/helpers';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastActivity, setLastActivity] = useState(new Date().toISOString());

  useEffect(() => {
    const storedUser = getCurrentUser();
    if (storedUser) {
      if (storedUser.isAdmin) {
        setUser(storedUser);
        setIsAdmin(true);
        setLastActivity(storedUser.lastActivity || new Date().toISOString());
      } else if (isSessionExpired(storedUser.lastActivity)) {
        clearCurrentUser();
        setUser(null);
      } else {
        const freshUser = getUserById(storedUser.id);
        if (freshUser && !freshUser.locked) {
          setUser(freshUser);
          setLastActivity(storedUser.lastActivity);
        } else {
          clearCurrentUser();
          setUser(null);
        }
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user && !isAdmin) {
      const interval = setInterval(() => {
        if (isSessionExpired(lastActivity)) {
          logout();
        }
      }, 60000);

      return () => clearInterval(interval);
    }
  }, [user, lastActivity, isAdmin]);

  const updateActivity = () => {
    const now = new Date().toISOString();
    setLastActivity(now);
    if (user && !isAdmin) {
      const currentSession = getCurrentUser();
      if (currentSession) {
        setCurrentUser({ ...currentSession, lastActivity: now });
      }
    }
  };

  useEffect(() => {
    const handleActivity = () => {
      updateActivity();
    };

    if (user && !isAdmin) {
      window.addEventListener('mousemove', handleActivity);
      window.addEventListener('keypress', handleActivity);
      window.addEventListener('click', handleActivity);
      window.addEventListener('scroll', handleActivity);

      return () => {
        window.removeEventListener('mousemove', handleActivity);
        window.removeEventListener('keypress', handleActivity);
        window.removeEventListener('click', handleActivity);
        window.removeEventListener('scroll', handleActivity);
      };
    }
  }, [user, isAdmin]);

  const login = (userData) => {
    const now = new Date().toISOString();
    const sessionData = { ...userData, lastActivity: now };
    setUser(userData);
    setIsAdmin(false);
    setLastActivity(now);
    setCurrentUser(sessionData);

    saveLoginHistory({
      id: generateId(),
      userId: userData.id,
      date: now,
      status: 'success',
      ip: 'N/A',
    });

    if (userData.failedAttempts > 0) {
      updateUser(userData.id, { failedAttempts: 0 });
    }
  };

  const adminLogin = () => {
    const adminData = {
      id: 'admin',
      name: 'Administrator',
      isAdmin: true,
      lastActivity: new Date().toISOString(),
    };
    setUser(adminData);
    setIsAdmin(true);
    setCurrentUser(adminData);
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    clearCurrentUser();
  };

  const value = {
    user,
    isAdmin,
    loading,
    login,
    adminLogin,
    logout,
    updateActivity,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
