import './Public.css';

const Services = () => {
  return (
    <div className="public-page">
      <section className="page-header">
        <div className="container">
          <h1>Our Services</h1>
          <p>Comprehensive banking solutions for all your needs</p>
        </div>
      </section>

      <section className="content-section">
        <div className="container">
          <div className="services-list">
            <div className="service-item">
              <div className="service-icon">💳</div>
              <div className="service-content">
                <h3>Savings Account</h3>
                <p>
                  Earn competitive interest rates on your savings with our flexible savings account.
                  No minimum balance required, free withdrawals, and instant access to your funds.
                </p>
                <ul>
                  <li>4% annual interest rate</li>
                  <li>No monthly maintenance fees</li>
                  <li>Free virtual debit card</li>
                  <li>Online and mobile banking</li>
                </ul>
              </div>
            </div>

            <div className="service-item">
              <div className="service-icon">🏢</div>
              <div className="service-content">
                <h3>Current Account</h3>
                <p>
                  Perfect for businesses and professionals. Unlimited transactions, overdraft
                  facility, and dedicated business support.
                </p>
                <ul>
                  <li>Unlimited transactions</li>
                  <li>Overdraft facility available</li>
                  <li>Business banking tools</li>
                  <li>Detailed transaction reports</li>
                </ul>
              </div>
            </div>

            <div className="service-item">
              <div className="service-icon">💰</div>
              <div className="service-content">
                <h3>Salary Account</h3>
                <p>
                  Designed for salaried professionals with exclusive benefits and zero balance
                  requirements.
                </p>
                <ul>
                  <li>Zero balance account</li>
                  <li>Salary advance facility</li>
                  <li>Free insurance coverage</li>
                  <li>Exclusive rewards program</li>
                </ul>
              </div>
            </div>

            <div className="service-item">
              <div className="service-icon">📈</div>
              <div className="service-content">
                <h3>Fixed Deposits</h3>
                <p>
                  Secure your future with our fixed deposit schemes. Guaranteed returns with
                  flexible tenure options.
                </p>
                <ul>
                  <li>6.5% annual interest rate</li>
                  <li>6, 12, or 24 months tenure</li>
                  <li>Premature withdrawal available</li>
                  <li>Auto-renewal option</li>
                </ul>
              </div>
            </div>

            <div className="service-item">
              <div className="service-icon">💎</div>
              <div className="service-content">
                <h3>Virtual Debit Cards</h3>
                <p>
                  Get instant virtual debit cards for secure online transactions. Freeze and
                  unfreeze anytime.
                </p>
                <ul>
                  <li>Instant issuance</li>
                  <li>Secure online payments</li>
                  <li>Freeze/unfreeze control</li>
                  <li>Transaction notifications</li>
                </ul>
              </div>
            </div>

            <div className="service-item">
              <div className="service-icon">🧮</div>
              <div className="service-content">
                <h3>Banking Tools</h3>
                <p>
                  Access our suite of financial calculators and tools to plan your finances better.
                </p>
                <ul>
                  <li>Loan EMI calculator</li>
                  <li>Recurring transfer setup</li>
                  <li>Financial planning tools</li>
                  <li>Investment calculators</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
