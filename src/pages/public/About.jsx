import './Public.css';

const About = () => {
  return (
    <div className="public-page">
      <section className="page-header">
        <div className="container">
          <h1>About SecureBank</h1>
          <p>Your trusted banking partner since 2024</p>
        </div>
      </section>

      <section className="content-section">
        <div className="container">
          <div className="content-grid">
            <div className="content-text">
              <h2>Our Mission</h2>
              <p>
                At SecureBank, we are committed to providing secure, reliable, and innovative
                banking solutions to our customers. We believe in making banking simple,
                accessible, and transparent for everyone.
              </p>
              <p>
                With state-of-the-art technology and customer-first approach, we aim to
                revolutionize the way you bank. Our team of dedicated professionals works
                around the clock to ensure your financial security and satisfaction.
              </p>
            </div>
            <div className="content-text">
              <h2>Our Values</h2>
              <ul className="values-list">
                <li><strong>Security:</strong> Your money and data are protected with bank-grade encryption</li>
                <li><strong>Transparency:</strong> No hidden fees, clear terms, and honest communication</li>
                <li><strong>Innovation:</strong> Cutting-edge technology for seamless banking experience</li>
                <li><strong>Support:</strong> 24/7 customer service to assist you whenever needed</li>
                <li><strong>Trust:</strong> Building long-term relationships with our customers</li>
              </ul>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Happy Customers</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">₹500Cr+</div>
              <div className="stat-label">Assets Under Management</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Customer Support</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">100%</div>
              <div className="stat-label">Secure Transactions</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
