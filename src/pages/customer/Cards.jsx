import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getCardsByUserId, updateCard, getAccountsByUserId } from '../../utils/storage';
import { maskCardNumber, formatDate } from '../../utils/helpers';
import './Customer.css';

const Cards = () => {
  const { user } = useAuth();
  const [cards, setCards] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showCVV, setShowCVV] = useState(false);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = () => {
    const userCards = getCardsByUserId(user.id);
    const userAccounts = getAccountsByUserId(user.id);
    setCards(userCards);
    setAccounts(userAccounts);
    if (userCards.length > 0 && !selectedCard) {
      setSelectedCard(userCards[0]);
    }
  };

  const toggleFreeze = (cardId, currentStatus) => {
    updateCard(cardId, { frozen: !currentStatus });
    loadData();
    if (selectedCard?.id === cardId) {
      setSelectedCard({ ...selectedCard, frozen: !currentStatus });
    }
  };

  return (
    <div className="page-content">
      <h1 className="page-title">My Cards</h1>

      <div className="cards-section">
        {selectedCard && (
          <div className="card-display">
            <div className={`virtual-card ${selectedCard.frozen ? 'frozen' : ''}`}>
              <div className="card-header">
                <div className="card-logo">🏦</div>
                <div className="card-type">{selectedCard.type.toUpperCase()} CARD</div>
              </div>
              <div className="card-chip">💳</div>
              <div className="card-number">
                {showCVV ? selectedCard.cardNumber.match(/.{1,4}/g).join(' ') : maskCardNumber(selectedCard.cardNumber)}
              </div>
              <div className="card-footer">
                <div className="card-holder">
                  <div className="card-label">CARD HOLDER</div>
                  <div className="card-value">{user.name}</div>
                </div>
                <div className="card-expiry">
                  <div className="card-label">EXPIRES</div>
                  <div className="card-value">
                    {new Date(selectedCard.expiryDate).toLocaleDateString('en-GB', { month: '2-digit', year: '2-digit' })}
                  </div>
                </div>
                <div className="card-cvv">
                  <div className="card-label">CVV</div>
                  <div className="card-value">{showCVV ? selectedCard.cvv : '***'}</div>
                </div>
              </div>
              {selectedCard.frozen && (
                <div className="frozen-overlay">
                  ❄️ CARD FROZEN
                </div>
              )}
            </div>

            <div className="card-controls">
              <button
                onClick={() => setShowCVV(!showCVV)}
                className="btn btn-secondary"
              >
                {showCVV ? '🙈 Hide Details' : '👁️ Show Details'}
              </button>
              <button
                onClick={() => toggleFreeze(selectedCard.id, selectedCard.frozen)}
                className={`btn ${selectedCard.frozen ? 'btn-success' : 'btn-danger'}`}
              >
                {selectedCard.frozen ? '🔓 Unfreeze Card' : '❄️ Freeze Card'}
              </button>
            </div>
          </div>
        )}

        <div className="cards-list">
          <h2 className="section-heading">Your Cards</h2>
          {cards.map(card => {
            const account = accounts.find(a => a.id === card.accountId);
            return (
              <div
                key={card.id}
                className={`card-item ${selectedCard?.id === card.id ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedCard(card);
                  setShowCVV(false);
                }}
              >
                <div className="card-item-icon">💳</div>
                <div className="card-item-info">
                  <div className="card-item-number">
                    {maskCardNumber(card.cardNumber)}
                  </div>
                  <div className="card-item-meta">
                    {card.type.toUpperCase()} • {account?.type.toUpperCase()}
                  </div>
                </div>
                <div className="card-item-status">
                  {card.frozen ? (
                    <span className="badge badge-warning">FROZEN</span>
                  ) : (
                    <span className="badge badge-success">ACTIVE</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card-features">
        <h2 className="section-heading">Card Features</h2>
        <div className="features-grid-simple">
          <div className="feature-item">
            <div className="feature-icon-small">🔒</div>
            <div>
              <h4>Secure Payments</h4>
              <p>3D secure authentication for all online transactions</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon-small">🌍</div>
            <div>
              <h4>Global Acceptance</h4>
              <p>Use your card at millions of merchants worldwide</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon-small">❄️</div>
            <div>
              <h4>Instant Freeze</h4>
              <p>Freeze and unfreeze your card instantly anytime</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon-small">🔔</div>
            <div>
              <h4>Real-time Alerts</h4>
              <p>Get instant notifications for every transaction</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cards;
