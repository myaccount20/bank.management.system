import {
  generateAccountNumber,
  generateCardNumber,
  generateCVV,
  saveUser,
  saveAccount,
  saveCard,
  saveTransaction,
  saveFixedDeposit,
  saveNotification,
  getAllUsers,
} from './storage';
import { generateId, getMaturityDate, calculateFDMaturityAmount } from './helpers';

const firstNames = ['Rajesh', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Anjali', 'Rahul', 'Kavita', 'Suresh', 'Meera'];
const lastNames = ['Kumar', 'Sharma', 'Patel', 'Singh', 'Reddy', 'Menon', 'Gupta', 'Nair', 'Verma', 'Desai'];

const transactionDescriptions = {
  credit: [
    'Salary Credited',
    'Fund Transfer Received',
    'Interest Credited',
    'Refund Credited',
    'Dividend Received',
    'Freelance Payment',
    'Investment Return',
    'Cashback Credited'
  ],
  debit: [
    'ATM Withdrawal',
    'Online Shopping',
    'Bill Payment',
    'UPI Payment',
    'EMI Deduction',
    'Grocery Purchase',
    'Restaurant Payment',
    'Fuel Purchase',
    'Mobile Recharge',
    'Utility Bill Payment'
  ]
};

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomAmount = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomDate = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date.toISOString();
};

export const seedDemoData = () => {
  const existingUsers = getAllUsers();
  if (existingUsers.length >= 10) {
    console.log('Demo data already exists');
    return;
  }

  const accountTypes = ['savings', 'current', 'salary'];
  const now = new Date().toISOString();

  for (let i = 0; i < 10; i++) {
    const firstName = getRandomElement(firstNames);
    const lastName = getRandomElement(lastNames);
    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@gmail.com`;
    const phone = `${9000000000 + Math.floor(Math.random() * 999999999)}`;
    const accountNumber = generateAccountNumber();
    const userId = generateId();
    const createdAt = getRandomDate(180);

    const user = {
      id: userId,
      name,
      email,
      phone,
      accountNumber,
      pin: '1234',
      createdAt,
      locked: i === 9,
      failedAttempts: i === 9 ? 3 : 0,
    };

    saveUser(user);

    const numAccounts = i < 3 ? 3 : i < 7 ? 2 : 1;
    const accounts = [];

    for (let j = 0; j < numAccounts; j++) {
      const accountType = accountTypes[j % accountTypes.length];
      const initialBalance = getRandomAmount(10000, 500000);
      const accountId = generateId();

      const account = {
        id: accountId,
        userId,
        accountNumber,
        type: accountType,
        balance: initialBalance,
        status: 'active',
        createdAt,
      };

      saveAccount(account);
      accounts.push(account);

      const card = {
        id: generateId(),
        userId,
        accountId,
        cardNumber: generateCardNumber(),
        cvv: generateCVV(),
        expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 5)).toISOString(),
        frozen: false,
        type: 'debit',
        createdAt,
      };

      saveCard(card);

      const numTransactions = getRandomAmount(10, 30);

      for (let k = 0; k < numTransactions; k++) {
        const isCredit = Math.random() > 0.4;
        const amount = getRandomAmount(500, 50000);
        const transactionDate = getRandomDate(90);

        const transaction = {
          id: generateId(),
          userId,
          accountId,
          type: isCredit ? 'credit' : 'debit',
          amount: isCredit ? amount : -amount,
          description: getRandomElement(transactionDescriptions[isCredit ? 'credit' : 'debit']),
          date: transactionDate,
          category: isCredit ? 'deposit' : 'withdrawal',
        };

        saveTransaction(transaction);
      }
    }

    if (i < 6 && accounts.length > 0) {
      const fdAccount = accounts[0];
      const fdAmount = getRandomAmount(50000, 200000);
      const tenure = [6, 12, 24][Math.floor(Math.random() * 3)];
      const fdCreatedAt = getRandomDate(60);

      const fd = {
        id: generateId(),
        userId,
        accountId: fdAccount.id,
        amount: fdAmount,
        interestRate: 6.5,
        tenure,
        maturityAmount: calculateFDMaturityAmount(fdAmount, 6.5, tenure),
        maturityDate: getMaturityDate(fdCreatedAt, tenure),
        createdAt: fdCreatedAt,
        status: 'active',
      };

      saveFixedDeposit(fd);
    }

    const notifications = [
      {
        id: generateId(),
        userId,
        title: 'Welcome to SecureBank',
        message: 'Your account has been created successfully.',
        date: createdAt,
        read: i % 2 === 0,
        type: 'info',
      },
      {
        id: generateId(),
        userId,
        title: 'Large Transaction Alert',
        message: 'A transaction of ₹45,000 was made from your account.',
        date: getRandomDate(30),
        read: i % 3 === 0,
        type: 'warning',
      },
    ];

    notifications.forEach(notif => saveNotification(notif));
  }

  console.log('Demo data seeded successfully');
};
