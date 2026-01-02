import { Link } from 'react-router-dom';
import './Public.css';

const Home = () => {
  return (
    <div className="public-page">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Welcome to SecureBank</h1>
            <p>Your trusted partner for modern banking solutions</p>
            <div className="hero-buttons">
              <Link to="/open-account" className="btn btn-primary btn-lg">
                Open an Account
              </Link>
              <Link to="/login" className="btn btn-secondary btn-lg">
                Login to Your Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose SecureBank?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure & Safe</h3>
              <p>Bank-grade security to protect your money and data</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💳</div>
              <h3>Multiple Accounts</h3>
              <p>Savings, Current, and Salary account options</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Easy Access</h3>
              <p>Manage your finances anytime, anywhere</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>Fixed Deposits</h3>
              <p>Earn attractive interest on your savings</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💎</div>
              <h3>Virtual Cards</h3>
              <p>Instant virtual debit cards for online payments</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🧮</div>
              <h3>Banking Tools</h3>
              <p>Calculators and tools to plan your finances</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to get started?</h2>
            <p>Open your account in minutes and start banking with confidence</p>
            <Link to="/open-account" className="btn btn-primary btn-lg">
              Open Account Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
