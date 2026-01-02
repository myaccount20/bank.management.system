# SecureBank - Bank Management System

A comprehensive, frontend-only Bank Management System MVP built with React, featuring a complete banking experience with customer and admin portals. This project demonstrates modern web development practices and serves as an excellent portfolio piece.

## Features

### Public Website
- **Home Page**: Modern landing page with features showcase
- **About Page**: Company information and values
- **Services Page**: Detailed banking services overview
- **Contact Page**: Contact form and information
- **Account Opening**: Complete registration flow with validation
- **Login System**: Secure login with PIN-based authentication and account lockout after 3 failed attempts

### Customer Portal

#### Dashboard
- Account balances overview
- Recent transactions
- Unread notifications
- Quick stats cards

#### Account Management
- Multiple account types (Savings, Current, Salary)
- Add new accounts
- View account balances
- Transfer money between accounts
- Real-time transaction updates

#### Transactions
- View all transactions
- Add transactions (credit/debit)
- Search and filter functionality
- Transaction history with details
- Automatic notifications for low balance and large transactions

#### Fixed Deposits
- Create fixed deposits (6, 12, 24 months)
- 6.5% annual interest rate (simple interest)
- Maturity amount calculation
- View all FDs with status
- Automatic balance deduction

#### Banking Tools
- **EMI Calculator**: Calculate loan EMI with detailed breakdown
- **Recurring Transfers**: Set up automatic transfers between accounts (simulated)
- Pause/resume recurring transfers

#### Virtual Cards
- Virtual debit card display
- Show/hide card details (number, CVV)
- Freeze/unfreeze card functionality
- Masked card numbers for security
- Card expiry information

#### Notifications
- Real-time banking alerts
- Low balance warnings
- Large transaction notifications
- FD creation confirmations
- Read/unread status
- Mark all as read functionality

#### Security
- Change PIN securely
- View login history
- 10-minute session timeout
- Failed login attempt tracking
- Security tips and best practices
- Forgot PIN recovery

#### Profile
- Edit personal information
- View activity log
- Account details
- Member since information

### Admin Portal

#### Admin Dashboard
- Total users statistics
- Total accounts and balances
- Transaction overview
- Fixed deposits summary
- System-wide metrics

#### User Management
- View all users
- Search and filter users
- Lock/unlock user accounts
- View user details and accounts
- User activity monitoring

#### Transaction Management
- View all transactions across users
- Filter by type (credit/debit)
- Search transactions
- Total credits and debits summary

#### Fixed Deposits Management
- View all fixed deposits
- Filter by status
- Total FD amounts and interest
- Maturity tracking

### Technical Features

#### Light/Dark Mode
- System-wide theme toggle
- Persistent theme preference
- Smooth transitions
- CSS variables for theming

#### Session Management
- 10-minute inactivity timeout
- Automatic logout on timeout
- Activity tracking
- Session persistence

#### Data Persistence
- LocalStorage-based data management
- Data survives page refresh
- No backend required
- Instant data access

#### Security
- PIN-based authentication
- Account lockout after 3 failed attempts
- Session timeout
- Masked sensitive information

#### Responsive Design
- Desktop-first approach
- Mobile-friendly interface
- Flexible layouts
- Touch-friendly controls

## Tech Stack

- **React 18.3.1** - UI framework
- **React Router DOM 6.22.0** - Routing
- **Vite 5.4.2** - Build tool and dev server
- **CSS3** - Styling with CSS variables
- **LocalStorage** - Data persistence

## Project Structure

```
bank-management-system/
├── src/
│   ├── components/
│   │   └── layouts/
│   │       ├── PublicLayout.jsx
│   │       ├── PublicLayout.css
│   │       ├── DashboardLayout.jsx
│   │       ├── DashboardLayout.css
│   │       └── AdminLayout.jsx
│   ├── contexts/
│   │   ├── ThemeContext.jsx
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── public/
│   │   │   ├── Home.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Services.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── OpenAccount.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Public.css
│   │   │   └── Auth.css
│   │   ├── customer/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Accounts.jsx
│   │   │   ├── Transactions.jsx
│   │   │   ├── FixedDeposit.jsx
│   │   │   ├── BankingTools.jsx
│   │   │   ├── Cards.jsx
│   │   │   ├── Notifications.jsx
│   │   │   ├── Security.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Customer.css
│   │   └── admin/
│   │       ├── AdminLogin.jsx
│   │       ├── AdminDashboard.jsx
│   │       ├── AdminUsers.jsx
│   │       ├── AdminTransactions.jsx
│   │       ├── AdminFixedDeposits.jsx
│   │       └── Admin.css
│   ├── utils/
│   │   ├── storage.js
│   │   └── helpers.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository or extract the project files

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

### Creating a Customer Account

1. Navigate to the home page
2. Click "Open Account"
3. Fill in the registration form:
   - Full Name
   - Email
   - Phone (10 digits)
   - Account Type (Savings/Current/Salary)
   - Initial Deposit (minimum ₹1,000)
   - Create 4-digit PIN
4. Submit the form
5. Save the generated account number
6. Login with account number and PIN

### Customer Login

1. Click "Login" from the home page
2. Enter your account number
3. Enter your 4-digit PIN
4. Access the customer dashboard

**Note:** Account will be locked after 3 failed login attempts

### Admin Login

1. Navigate to `/admin/login`
2. Enter admin credentials:
   - Username: `admin`
   - Password: `admin123`
3. Access the admin dashboard

## Features Walkthrough

### Fixed Deposit Creation

1. Login to customer portal
2. Navigate to "Fixed Deposits"
3. Click "Create FD"
4. Select source account
5. Enter amount (minimum ₹5,000)
6. Choose tenure (6, 12, or 24 months)
7. Review maturity amount
8. Confirm creation

### EMI Calculator

1. Navigate to "Banking Tools"
2. Click "EMI Calculator" tab
3. Enter loan amount
4. Enter interest rate
5. Enter tenure in months
6. View detailed breakdown

### Card Management

1. Navigate to "Cards"
2. View your virtual debit card
3. Click "Show Details" to reveal full card number and CVV
4. Use "Freeze Card" to temporarily disable the card
5. Click "Unfreeze Card" to reactivate

### Security PIN Change

1. Navigate to "Security"
2. Click "Change PIN"
3. Enter current PIN
4. Enter new 4-digit PIN
5. Confirm new PIN
6. Submit (will logout automatically)

## Data Storage

All data is stored in browser's localStorage with the following keys:

- `bank_users` - User accounts
- `bank_accounts` - Bank accounts
- `bank_transactions` - All transactions
- `bank_fixed_deposits` - Fixed deposits
- `bank_cards` - Virtual cards
- `bank_notifications` - User notifications
- `bank_login_history` - Login attempts
- `bank_recurring_transfers` - Recurring transfers
- `bank_current_user` - Active session
- `bank_admin` - Admin credentials
- `bank_theme` - Theme preference

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Security Notes

This is a frontend-only demonstration project. In a production environment:

- Never store PINs/passwords in plain text
- Implement proper backend authentication
- Use HTTPS for all communications
- Implement proper session management
- Add rate limiting for login attempts
- Use encrypted data storage

## Known Limitations

- No real backend integration
- Data is stored locally (lost on cache clear)
- No real-time data sync between devices
- Simulated recurring transfers
- No email/SMS notifications
- Admin credentials are hardcoded

## Future Enhancements

- Backend API integration
- Real-time notifications
- Multi-factor authentication
- Transaction export (PDF/Excel)
- Account statements
- Loan management
- Investment portfolios
- Bill payments
- Mobile app version

## Contributing

This is a demonstration project. Feel free to fork and enhance it for your own use.

## License

This project is created for educational and portfolio purposes. Feel free to use and modify as needed.

## Support

For any questions or issues, please refer to the documentation or create an issue in the repository.

## Acknowledgments

- Built with React and Vite
- Icons: Emoji (system native)
- Design inspiration: Modern banking applications

---

**Disclaimer**: This is a demonstration project for educational purposes only. It should not be used for actual banking operations or with real financial data.
