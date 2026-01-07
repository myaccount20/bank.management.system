# SecureBank - Digital Banking System Demo

A comprehensive, production-ready frontend Bank Management System built with React. This demo showcases modern web development practices with a complete banking experience featuring customer and admin portals.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.3.1-61dafb.svg)
![Vite](https://img.shields.io/badge/Vite-5.4.2-646cff.svg)

## Live Demo

Experience the application with these pre-configured accounts:

### Customer Login
- **Account Number**: Use any demo account from the admin panel
- **PIN**: `1234` (default for all demo accounts)

### Admin Portal
- **URL**: `/admin/login`
- **Username**: `admin`
- **Password**: `admin123`

## Features

### Customer Portal

#### Account Management
- Multiple account types (Savings, Current, Salary)
- Create additional accounts
- Real-time balance updates
- Inter-account transfers
- Comprehensive transaction history

#### Banking Services
- **Fixed Deposits**: 6.5% annual interest with flexible terms
- **Virtual Debit Cards**: Instant virtual cards with freeze/unfreeze control
- **EMI Calculator**: Loan payment calculations with detailed breakdown
- **Recurring Transfers**: Automated transfer scheduling

#### Security Features
- PIN-based authentication
- Session timeout (10 minutes)
- Account lockout after 3 failed attempts
- Secure PIN change functionality
- Login history tracking

#### Notifications & Alerts
- Real-time banking notifications
- Low balance warnings
- Large transaction alerts
- FD maturity reminders

### Admin Portal

#### Enterprise Dashboard
- Comprehensive system statistics
- User activity monitoring
- Financial overview
- Real-time transaction tracking

#### User Management
- View all registered users
- Lock/unlock user accounts
- Search and filter capabilities
- Detailed user profiles
- Account activity tracking

#### Transaction Oversight
- Complete transaction history
- Filter by type (credit/debit)
- Search functionality
- Total credits and debits summary

#### Fixed Deposits Management
- View all fixed deposits
- Filter by status
- Track maturities
- Interest calculations

### User Experience

#### Light/Dark Mode
- System-wide theme toggle
- Persistent preferences
- Smooth transitions
- Optimized for both themes

#### Responsive Design
- Desktop-first approach
- Mobile-friendly interface
- Flexible layouts
- Touch-optimized controls

## Tech Stack

- **React 18.3.1** - UI framework with hooks
- **React Router DOM 6.22.0** - Client-side routing
- **Vite 5.4.2** - Lightning-fast build tool
- **CSS3** - Modern styling with CSS variables
- **LocalStorage API** - Client-side data persistence

## Project Structure

```
bank-management-system/
├── src/
│   ├── components/
│   │   └── layouts/
│   │       ├── PublicLayout.jsx
│   │       ├── DashboardLayout.jsx
│   │       └── AdminLayout.jsx
│   ├── contexts/
│   │   ├── ThemeContext.jsx
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── public/
│   │   ├── customer/
│   │   └── admin/
│   ├── utils/
│   │   ├── storage.js
│   │   ├── helpers.js
│   │   └── seedData.js
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/securebank.git
cd securebank
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The optimized build will be in the `dist` directory.

## Demo Data

The application automatically seeds with 10 demo user accounts on first load:

- 10 unique users with realistic data
- Multiple accounts per user (Savings, Current, Salary)
- 10-30 transactions per account
- Fixed deposits for select accounts
- Virtual debit cards
- Notifications and alerts

All demo accounts use PIN: `1234`

## Key Features Showcase

### Advanced Banking Tools

**EMI Calculator**
- Calculate loan EMI with detailed breakdown
- Principal, interest, and total amount display
- Flexible loan amount and tenure inputs

**Recurring Transfers**
- Set up automatic transfers between accounts
- Configurable frequency (Daily, Weekly, Monthly)
- Pause and resume functionality

**Fixed Deposits**
- Create FDs with multiple tenure options
- Automatic interest calculation
- Real-time maturity amount preview

### Security Features

**Session Management**
- 10-minute inactivity timeout
- Automatic logout on session expiry
- Activity-based session refresh

**Account Security**
- Failed login attempt tracking
- Automatic account lockout (3 attempts)
- Secure PIN recovery
- Login history tracking

### Admin Features

**Enterprise-Style Interface**
- Professional data tables
- Advanced filtering and search
- Real-time statistics
- Comprehensive user management

**Detailed Analytics**
- Total users and accounts
- Transaction volumes
- Fixed deposit tracking
- Financial summaries

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Data Storage

All data is stored in browser's localStorage:

- Users and accounts
- Transactions history
- Fixed deposits
- Virtual cards
- Notifications
- Login history
- Recurring transfers
- Theme preferences

## Security Notes

This is a frontend-only demonstration project. In a production environment, you should:

- Implement proper backend authentication
- Use secure password hashing (bcrypt, argon2)
- Implement HTTPS
- Add rate limiting
- Use encrypted data storage
- Implement proper session management
- Add CSRF protection
- Implement proper authorization

## Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Code Organization

The project follows a clean, modular architecture:

- **Components**: Reusable UI components and layouts
- **Contexts**: React Context for state management
- **Pages**: Route-based page components
- **Utils**: Helper functions and utilities

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with React and Vite
- Design inspired by modern banking applications
- Icons: Native emoji support

## Disclaimer

This is a demonstration project for educational and portfolio purposes only. It should not be used for actual banking operations or with real financial data.

## Contact

For questions or feedback, please open an issue in the GitHub repository.

---

**Made with care for demonstration purposes**
