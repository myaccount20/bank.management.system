import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useEffect } from 'react';
import { initializeStorage } from './utils/storage';

import PublicLayout from './components/layouts/PublicLayout';
import DashboardLayout from './components/layouts/DashboardLayout';
import AdminLayout from './components/layouts/AdminLayout';

import Home from './pages/public/Home';
import About from './pages/public/About';
import Services from './pages/public/Services';
import Contact from './pages/public/Contact';
import OpenAccount from './pages/public/OpenAccount';
import Login from './pages/public/Login';

import Dashboard from './pages/customer/Dashboard';
import Accounts from './pages/customer/Accounts';
import Transactions from './pages/customer/Transactions';
import FixedDeposit from './pages/customer/FixedDeposit';
import BankingTools from './pages/customer/BankingTools';
import Cards from './pages/customer/Cards';
import Notifications from './pages/customer/Notifications';
import Security from './pages/customer/Security';
import Profile from './pages/customer/Profile';

import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminTransactions from './pages/admin/AdminTransactions';
import AdminFixedDeposits from './pages/admin/AdminFixedDeposits';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }

  return user && !user.isAdmin ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }

  return user && isAdmin ? children : <Navigate to="/admin/login" replace />;
};

function AppRoutes() {
  useEffect(() => {
    initializeStorage();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="contact" element={<Contact />} />
          <Route path="open-account" element={<OpenAccount />} />
          <Route path="login" element={<Login />} />
        </Route>

        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="fixed-deposits" element={<FixedDeposit />} />
          <Route path="banking-tools" element={<BankingTools />} />
          <Route path="cards" element={<Cards />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="security" element={<Security />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="transactions" element={<AdminTransactions />} />
          <Route path="fixed-deposits" element={<AdminFixedDeposits />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
