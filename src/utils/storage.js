const STORAGE_KEYS = {
  USERS: 'bank_users',
  ACCOUNTS: 'bank_accounts',
  TRANSACTIONS: 'bank_transactions',
  FIXED_DEPOSITS: 'bank_fixed_deposits',
  CARDS: 'bank_cards',
  NOTIFICATIONS: 'bank_notifications',
  LOGIN_HISTORY: 'bank_login_history',
  RECURRING_TRANSFERS: 'bank_recurring_transfers',
  CURRENT_USER: 'bank_current_user',
  ADMIN: 'bank_admin',
};

export const generateAccountNumber = () => {
  return '10' + Date.now().toString().slice(-8) + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
};

export const generateCardNumber = () => {
  return '4532' + Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');
};

export const generateCVV = () => {
  return Math.floor(Math.random() * 900 + 100).toString();
};

export const getFromStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error reading ${key} from storage:`, error);
    return null;
  }
};

export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error saving ${key} to storage:`, error);
    return false;
  }
};

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing ${key} from storage:`, error);
    return false;
  }
};

export const initializeStorage = () => {
  if (!getFromStorage(STORAGE_KEYS.USERS)) {
    saveToStorage(STORAGE_KEYS.USERS, []);
  }
  if (!getFromStorage(STORAGE_KEYS.ACCOUNTS)) {
    saveToStorage(STORAGE_KEYS.ACCOUNTS, []);
  }
  if (!getFromStorage(STORAGE_KEYS.TRANSACTIONS)) {
    saveToStorage(STORAGE_KEYS.TRANSACTIONS, []);
  }
  if (!getFromStorage(STORAGE_KEYS.FIXED_DEPOSITS)) {
    saveToStorage(STORAGE_KEYS.FIXED_DEPOSITS, []);
  }
  if (!getFromStorage(STORAGE_KEYS.CARDS)) {
    saveToStorage(STORAGE_KEYS.CARDS, []);
  }
  if (!getFromStorage(STORAGE_KEYS.NOTIFICATIONS)) {
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, []);
  }
  if (!getFromStorage(STORAGE_KEYS.LOGIN_HISTORY)) {
    saveToStorage(STORAGE_KEYS.LOGIN_HISTORY, []);
  }
  if (!getFromStorage(STORAGE_KEYS.RECURRING_TRANSFERS)) {
    saveToStorage(STORAGE_KEYS.RECURRING_TRANSFERS, []);
  }
  if (!getFromStorage(STORAGE_KEYS.ADMIN)) {
    saveToStorage(STORAGE_KEYS.ADMIN, {
      username: 'admin',
      password: 'admin123',
    });
  }
};

export const getAllUsers = () => {
  return getFromStorage(STORAGE_KEYS.USERS) || [];
};

export const getUserById = (userId) => {
  const users = getAllUsers();
  return users.find(user => user.id === userId);
};

export const getUserByAccountNumber = (accountNumber) => {
  const users = getAllUsers();
  return users.find(user => user.accountNumber === accountNumber);
};

export const saveUser = (user) => {
  const users = getAllUsers();
  users.push(user);
  return saveToStorage(STORAGE_KEYS.USERS, users);
};

export const updateUser = (userId, updates) => {
  const users = getAllUsers();
  const index = users.findIndex(user => user.id === userId);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    return saveToStorage(STORAGE_KEYS.USERS, users);
  }
  return false;
};

export const getAllAccounts = () => {
  return getFromStorage(STORAGE_KEYS.ACCOUNTS) || [];
};

export const getAccountsByUserId = (userId) => {
  const accounts = getAllAccounts();
  return accounts.filter(account => account.userId === userId);
};

export const getAccountById = (accountId) => {
  const accounts = getAllAccounts();
  return accounts.find(account => account.id === accountId);
};

export const saveAccount = (account) => {
  const accounts = getAllAccounts();
  accounts.push(account);
  return saveToStorage(STORAGE_KEYS.ACCOUNTS, accounts);
};

export const updateAccount = (accountId, updates) => {
  const accounts = getAllAccounts();
  const index = accounts.findIndex(account => account.id === accountId);
  if (index !== -1) {
    accounts[index] = { ...accounts[index], ...updates };
    return saveToStorage(STORAGE_KEYS.ACCOUNTS, accounts);
  }
  return false;
};

export const getAllTransactions = () => {
  return getFromStorage(STORAGE_KEYS.TRANSACTIONS) || [];
};

export const getTransactionsByUserId = (userId) => {
  const transactions = getAllTransactions();
  return transactions.filter(transaction => transaction.userId === userId)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const getTransactionsByAccountId = (accountId) => {
  const transactions = getAllTransactions();
  return transactions.filter(transaction => transaction.accountId === accountId)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const saveTransaction = (transaction) => {
  const transactions = getAllTransactions();
  transactions.push(transaction);
  return saveToStorage(STORAGE_KEYS.TRANSACTIONS, transactions);
};

export const getAllFixedDeposits = () => {
  return getFromStorage(STORAGE_KEYS.FIXED_DEPOSITS) || [];
};

export const getFixedDepositsByUserId = (userId) => {
  const fds = getAllFixedDeposits();
  return fds.filter(fd => fd.userId === userId);
};

export const saveFixedDeposit = (fd) => {
  const fds = getAllFixedDeposits();
  fds.push(fd);
  return saveToStorage(STORAGE_KEYS.FIXED_DEPOSITS, fds);
};

export const updateFixedDeposit = (fdId, updates) => {
  const fds = getAllFixedDeposits();
  const index = fds.findIndex(fd => fd.id === fdId);
  if (index !== -1) {
    fds[index] = { ...fds[index], ...updates };
    return saveToStorage(STORAGE_KEYS.FIXED_DEPOSITS, fds);
  }
  return false;
};

export const getAllCards = () => {
  return getFromStorage(STORAGE_KEYS.CARDS) || [];
};

export const getCardsByUserId = (userId) => {
  const cards = getAllCards();
  return cards.filter(card => card.userId === userId);
};

export const saveCard = (card) => {
  const cards = getAllCards();
  cards.push(card);
  return saveToStorage(STORAGE_KEYS.CARDS, cards);
};

export const updateCard = (cardId, updates) => {
  const cards = getAllCards();
  const index = cards.findIndex(card => card.id === cardId);
  if (index !== -1) {
    cards[index] = { ...cards[index], ...updates };
    return saveToStorage(STORAGE_KEYS.CARDS, cards);
  }
  return false;
};

export const getAllNotifications = () => {
  return getFromStorage(STORAGE_KEYS.NOTIFICATIONS) || [];
};

export const getNotificationsByUserId = (userId) => {
  const notifications = getAllNotifications();
  return notifications.filter(notif => notif.userId === userId)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const saveNotification = (notification) => {
  const notifications = getAllNotifications();
  notifications.push(notification);
  return saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
};

export const markNotificationAsRead = (notificationId) => {
  const notifications = getAllNotifications();
  const index = notifications.findIndex(notif => notif.id === notificationId);
  if (index !== -1) {
    notifications[index].read = true;
    return saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }
  return false;
};

export const getAllLoginHistory = () => {
  return getFromStorage(STORAGE_KEYS.LOGIN_HISTORY) || [];
};

export const getLoginHistoryByUserId = (userId) => {
  const history = getAllLoginHistory();
  return history.filter(entry => entry.userId === userId)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const saveLoginHistory = (entry) => {
  const history = getAllLoginHistory();
  history.push(entry);
  return saveToStorage(STORAGE_KEYS.LOGIN_HISTORY, history);
};

export const getAllRecurringTransfers = () => {
  return getFromStorage(STORAGE_KEYS.RECURRING_TRANSFERS) || [];
};

export const getRecurringTransfersByUserId = (userId) => {
  const transfers = getAllRecurringTransfers();
  return transfers.filter(transfer => transfer.userId === userId);
};

export const saveRecurringTransfer = (transfer) => {
  const transfers = getAllRecurringTransfers();
  transfers.push(transfer);
  return saveToStorage(STORAGE_KEYS.RECURRING_TRANSFERS, transfers);
};

export const updateRecurringTransfer = (transferId, updates) => {
  const transfers = getAllRecurringTransfers();
  const index = transfers.findIndex(transfer => transfer.id === transferId);
  if (index !== -1) {
    transfers[index] = { ...transfers[index], ...updates };
    return saveToStorage(STORAGE_KEYS.RECURRING_TRANSFERS, transfers);
  }
  return false;
};

export const getCurrentUser = () => {
  return getFromStorage(STORAGE_KEYS.CURRENT_USER);
};

export const setCurrentUser = (user) => {
  return saveToStorage(STORAGE_KEYS.CURRENT_USER, user);
};

export const clearCurrentUser = () => {
  return removeFromStorage(STORAGE_KEYS.CURRENT_USER);
};

export const getAdmin = () => {
  return getFromStorage(STORAGE_KEYS.ADMIN);
};

export default STORAGE_KEYS;
