# SecureBank - Digital Banking System Demo

A comprehensive, production-ready frontend Bank Management System built with React. This demo showcases modern web development practices with a complete banking experience featuring customer and admin portals.

![React](https://img.shields.io/badge/React-18.3.1-61dafb.svg)
![Vite](https://img.shields.io/badge/Vite-5.4.2-646cff.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## Quick Start

### Installation

```bash
npm install
npm run dev
```

Visit `http://localhost:5173` to view the application.

### Demo Credentials

**Customer Login** (any demo account)
- PIN: `1234`

**Admin Portal** (`/admin/login`)
- Username: `admin`
- Password: `admin123`

## Key Features

### Customer Portal
- Multiple account types (Savings, Current, Salary)
- Inter-account transfers with real-time updates
- Fixed Deposits (6.5% annual interest)
- Virtual debit cards with freeze/unfreeze
- EMI Calculator
- Recurring transfers
- Real-time notifications
- Security features (session timeout, PIN change, login history)
- Light/Dark theme toggle

### Admin Portal
- Enterprise-style dashboard
- User management with lock/unlock
- Transaction oversight
- Fixed deposits tracking
- Advanced search and filtering
- Real-time statistics

## Tech Stack

- React 18.3.1
- React Router DOM 6.22.0
- Vite 5.4.2
- CSS3 with CSS Variables
- LocalStorage for data persistence

## Demo Data

The application automatically seeds with 10 demo user accounts on first load, including:
- Realistic user data
- Multiple accounts per user
- Transaction history
- Fixed deposits
- Virtual cards
- Notifications

## Project Structure

```
src/
├── components/layouts/    # Layout components
├── contexts/              # React Context (Theme, Auth)
├── pages/
│   ├── public/           # Public pages (Home, Login, etc.)
│   ├── customer/         # Customer dashboard pages
│   └── admin/            # Admin portal pages
├── utils/
│   ├── storage.js        # LocalStorage utilities
│   ├── helpers.js        # Helper functions
│   └── seedData.js       # Demo data generation
└── App.jsx               # Main app component
```

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Features Showcase

### Banking Operations
- Create and manage multiple accounts
- Transfer funds between accounts
- Transaction history with search and filters
- Automatic notifications for transactions

### Fixed Deposits
- Create FDs with 6, 12, or 24-month terms
- Automatic interest calculation (6.5% p.a.)
- Maturity amount preview
- Track all fixed deposits

### Virtual Cards
- Instant virtual debit card issuance
- Show/hide card details
- Freeze/unfreeze functionality
- Masked card numbers for security

### Banking Tools
- EMI Calculator with detailed breakdown
- Recurring transfer setup
- Schedule automatic payments

### Security
- PIN-based authentication
- Account lockout (3 failed attempts)
- Session timeout (10 minutes)
- Secure PIN change
- Login history tracking
- Forgot PIN recovery

### Admin Features
- View all users and accounts
- Lock/unlock user accounts
- Monitor all transactions
- Track fixed deposits
- Search and filter capabilities
- Comprehensive statistics

## Security Notes

This is a frontend-only demonstration project. In production, implement:
- Backend authentication
- Secure password hashing
- HTTPS
- Rate limiting
- Encrypted data storage
- Proper session management

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

MIT License - see LICENSE file for details.

## Disclaimer

This is a demonstration project for educational and portfolio purposes only. It should not be used for actual banking operations or with real financial data.

---

Built with React and Vite for demonstration purposes.
