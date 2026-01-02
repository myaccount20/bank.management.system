import { useState } from 'react';
import './Public.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="public-page">
      <section className="page-header">
        <div className="container">
          <h1>Contact Us</h1>
          <p>We're here to help you with any questions</p>
        </div>
      </section>

      <section className="content-section">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <h2>Get in Touch</h2>
              <p>
                Have questions or need assistance? Our team is available 24/7 to help you.
              </p>

              <div className="contact-methods">
                <div className="contact-method">
                  <div className="method-icon">📞</div>
                  <div>
                    <h4>Phone</h4>
                    <p>1800-123-4567 (Toll-free)</p>
                    <p>Available 24/7</p>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="method-icon">✉️</div>
                  <div>
                    <h4>Email</h4>
                    <p>support@securebank.com</p>
                    <p>Response within 24 hours</p>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="method-icon">📍</div>
                  <div>
                    <h4>Head Office</h4>
                    <p>123 Banking Street</p>
                    <p>Mumbai, Maharashtra 400001</p>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="method-icon">⏰</div>
                  <div>
                    <h4>Business Hours</h4>
                    <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p>Saturday: 10:00 AM - 2:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-form-wrapper">
              <h2>Send us a Message</h2>
              {submitted && (
                <div className="alert alert-success">
                  Thank you for your message! We'll get back to you soon.
                </div>
              )}
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="input-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary btn-block">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
