import React, { useState } from 'react';
import AdSlot from './AdSlot';

// Common Backdrop component
export const Backdrop = ({ isOpen, onClick }) => {
  if (!isOpen) return null;
  return <div className="interactive-overlay" onClick={onClick}></div>;
};

// 1. CART DRAWER
export const CartDrawer = ({ 
  isOpen, 
  onClose, 
  cart, 
  onUpdateQty, 
  onRemove, 
  appliedDiscount, 
  onApplyDiscount, 
  address, 
  onCheckout,
  onOpenModal,
  adSlots = []
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Checkout Wizard States
  const [checkoutStep, setCheckoutStep] = useState(0); // 0 = Cart, 1 to 9 = Steps
  const [blockNo, setBlockNo] = useState('');
  const [societyName, setSocietyName] = useState('');
  const [area, setArea] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('India');
  const [pinCode, setPinCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  
  const [validationError, setValidationError] = useState('');
  const [isOrderFailed, setIsOrderFailed] = useState(false);
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);
  const [successOrderId, setSuccessOrderId] = useState('');

  // Payment Details States
  const [cardNo, setCardNo] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [showQR, setShowQR] = useState(false);

  // Reset wizard state on close
  const handleClose = () => {
    setCheckoutStep(0);
    setIsOrderFailed(false);
    setIsOrderSuccess(false);
    setValidationError('');
    setCardNo('');
    setCardExpiry('');
    setCardCvv('');
    setCardHolder('');
    setUpiId('');
    setSelectedBank('');
    setShowQR(false);
    onClose();
  };

  // Calculate pricing
  const subtotal = cart.reduce((sum, item) => sum + (item.product.currentPrice * item.quantity), 0);
  const delivery = 0; // Free delivery
  
  let discountAmount = 0;
  if (appliedDiscount && subtotal > 0) {
    if (appliedDiscount.type === 'percentage') {
      discountAmount = Math.round(subtotal * (appliedDiscount.value / 100));
    } else if (appliedDiscount.type === 'flat') {
      discountAmount = Math.min(appliedDiscount.value, subtotal);
    }
  }

  const total = Math.max(0, subtotal - discountAmount + delivery);
  // Dynamically calculate mock MRP (~8.725x of Total payable to match ₹1,300 for ₹149 sale price)
  const mrp = total > 0 ? Math.round(total * 8.725) : 0;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    
    const result = onApplyDiscount(couponCode.trim().toUpperCase());
    if (result.success) {
      setCouponSuccess(result.message);
      setCouponError('');
    } else {
      setCouponError(result.message);
      setCouponSuccess('');
    }
  };

  const handleStartNewOrder = () => {
    setIsOrderFailed(false);
    setIsOrderSuccess(false);
    setCheckoutStep(1); // Go back to step 1
    setValidationError('');
  };

  const validateAndProceed = () => {
    setValidationError('');
    let val = '';

    if (checkoutStep === 1) {
      if (!blockNo.trim()) {
        val = 'Block Number is required.';
      }
    } else if (checkoutStep === 2) {
      if (!societyName.trim()) {
        val = 'Society Name is required.';
      }
    } else if (checkoutStep === 3) {
      if (!area.trim()) {
        val = 'Area/Locality is required.';
      }
    } else if (checkoutStep === 4) {
      // Landmark is optional, always valid
    } else if (checkoutStep === 5) {
      if (!city.trim()) {
        val = 'City is required.';
      }
    } else if (checkoutStep === 6) {
      if (!state.trim()) {
        val = 'State is required.';
      }
    } else if (checkoutStep === 7) {
      if (!country.trim()) {
        val = 'Country is required.';
      }
    } else if (checkoutStep === 8) {
      if (!pinCode.trim()) {
        val = 'Pin Code is required.';
      } else if (!/^\d{6}$/.test(pinCode.trim())) {
        val = 'Pin Code must be a 6-digit number.';
      }
    } else if (checkoutStep === 9) {
      if (!paymentMethod) {
        val = 'Please select a payment method.';
      }
    }

    if (val) {
      setValidationError(val);
      return;
    }

    setCheckoutStep(prev => prev + 1);
  };

  const handlePlaceOrder = () => {
    // Hidden developer egg: simulated failures for test cases
    const isSimulatedFail = (paymentMethod === 'Credit/Debit Card' && cardCvv === '999') || (paymentMethod === 'UPI' && upiId === 'fail@upi');
    
    if (isSimulatedFail) {
      setIsOrderFailed(true);
      return;
    }

    // Format address and payment display
    const constructedAddress = `${blockNo}, ${societyName}, ${area}${landmark ? `, ${landmark}` : ''}, ${city}, ${state}, ${country} - ${pinCode}`;
    let paymentDisplay = paymentMethod;
    if (paymentMethod === 'Credit/Debit Card') {
      const lastFour = cardNo.slice(-4) || '1234';
      paymentDisplay = `Card (ending in ${lastFour})`;
    } else if (paymentMethod === 'UPI') {
      paymentDisplay = showQR ? 'UPI (QR Code Scan)' : `UPI (${upiId})`;
    } else if (paymentMethod === 'Net Banking') {
      paymentDisplay = `Net Banking (${selectedBank})`;
    }

    // Call checkout trigger
    const orderId = onCheckout(constructedAddress, paymentDisplay);
    if (orderId) {
      setSuccessOrderId(orderId);
      setIsOrderSuccess(true);
    } else {
      setIsOrderFailed(true);
    }
  };

  // Helper to render current input field
  const renderWizardInput = () => {
    switch (checkoutStep) {
      case 1:
        return (
          <div className="checkout-field-step animate-slide">
            <div className="checkout-form-group">
              <label className="checkout-label large-label">Block Number</label>
              <input 
                type="text" 
                value={blockNo} 
                onChange={(e) => { setBlockNo(e.target.value); setValidationError(''); }}
                placeholder="e.g. House / Plot / Block No."
                className="checkout-input-large"
                autoFocus
              />
              <span className="field-tip">Enter your primary house, flat, plot, or block number.</span>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="checkout-field-step animate-slide">
            <div className="checkout-form-group">
              <label className="checkout-label large-label">Society Name</label>
              <input 
                type="text" 
                value={societyName} 
                onChange={(e) => { setSocietyName(e.target.value); setValidationError(''); }}
                placeholder="e.g. Society / Apartment / Building"
                className="checkout-input-large"
                autoFocus
              />
              <span className="field-tip">Enter building name, society name, or residential project.</span>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="checkout-field-step animate-slide">
            <div className="checkout-form-group">
              <label className="checkout-label large-label">Area / Locality</label>
              <input 
                type="text" 
                value={area} 
                onChange={(e) => { setArea(e.target.value); setValidationError(''); }}
                placeholder="e.g. Area, Sector, Road Name"
                className="checkout-input-large"
                autoFocus
              />
              <span className="field-tip">Enter your street address, sector, colony, or locality.</span>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="checkout-field-step animate-slide">
            <div className="checkout-form-group">
              <label className="checkout-label large-label">Landmark (Optional)</label>
              <input 
                type="text" 
                value={landmark} 
                onChange={(e) => { setLandmark(e.target.value); setValidationError(''); }}
                placeholder="e.g. Near City Mall"
                className="checkout-input-large"
                autoFocus
              />
              <span className="field-tip">Any prominent nearby place to help locate your address quickly.</span>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="checkout-field-step animate-slide">
            <div className="checkout-form-group">
              <label className="checkout-label large-label">City</label>
              <input 
                type="text" 
                value={city} 
                onChange={(e) => { setCity(e.target.value); setValidationError(''); }}
                placeholder="e.g. New Delhi"
                className="checkout-input-large"
                autoFocus
              />
              <span className="field-tip">Enter your city or district.</span>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="checkout-field-step animate-slide">
            <div className="checkout-form-group">
              <label className="checkout-label large-label">State</label>
              <input 
                type="text" 
                value={state} 
                onChange={(e) => { setState(e.target.value); setValidationError(''); }}
                placeholder="e.g. Delhi"
                className="checkout-input-large"
                autoFocus
              />
              <span className="field-tip">Enter your state or region.</span>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="checkout-field-step animate-slide">
            <div className="checkout-form-group">
              <label className="checkout-label large-label">Country</label>
              <input 
                type="text" 
                value={country} 
                onChange={(e) => { setCountry(e.target.value); setValidationError(''); }}
                placeholder="Country Name"
                className="checkout-input-large"
                autoFocus
              />
              <span className="field-tip">Enter country name (defaults to India).</span>
            </div>
          </div>
        );
      case 8:
        return (
          <div className="checkout-field-step animate-slide">
            <div className="checkout-form-group">
              <label className="checkout-label large-label">Pin Code</label>
              <input 
                type="text" 
                pattern="\d*"
                maxLength="6"
                value={pinCode} 
                onChange={(e) => { setPinCode(e.target.value.replace(/\D/g, '')); setValidationError(''); }}
                placeholder="e.g. 110001"
                className="checkout-input-large"
                autoFocus
              />
              <span className="field-tip">Enter your 6-digit area PIN/ZIP code.</span>
            </div>
          </div>
        );

      case 9:
        return (
          <div className="checkout-payment-compact animate-slide">
            <div className="payment-options-grid">
              <div className="payment-option-card-large selected" style={{ cursor: 'default' }}>
                <div className="payment-option-check">
                  <span style={{ fontSize: '18px', color: '#2e7d32' }}>🛡️</span>
                </div>
                <div className="payment-option-info">
                  <div className="payment-option-title">Cash on Delivery (COD)</div>
                  <div className="payment-option-desc">Pay in cash when your order is delivered to your door.</div>
                </div>
              </div>
            </div>
            <div className="cod-badge-container" style={{ marginTop: '14px' }}>
              <span className="cod-check-icon">✨</span>
              <h4>100% Trust Guarantee</h4>
              <p style={{ fontSize: '11px', margin: '4px 0 12px 0', color: '#555' }}>
                Currently, we only support **Cash on Delivery (COD)** for all orders. There are no online transaction risks, and shipping is completely **FREE** across India.
              </p>
              <ul className="cod-benefits-list">
                <li>💵 Keep exact cash ready at delivery time</li>
                <li>🚚 Fast dispatch with professional couriers</li>
                <li>🛡️ Secure packaging and inspected items</li>
              </ul>
            </div>
          </div>
        );
      case 10:
        return (
          <div className="checkout-review-summary animate-slide">
            {/* Address Summary */}
            <div className="review-section-card">
              <div className="review-section-header">
                <span>📍 Shipping Destination</span>
                <button 
                  className="review-section-edit-btn"
                  onClick={() => { setCheckoutStep(1); setValidationError(''); }}
                >
                  Edit
                </button>
              </div>
              <div className="review-section-body">
                <p><strong>{profile.name}</strong></p>
                <p>{blockNo}, {societyName}, {area}{landmark ? `, ${landmark}` : ''}, {city}, {state}, {country} - {pinCode}</p>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="review-section-card">
              <div className="review-section-header">
                <span>💳 Selected Payment Method</span>
                <button 
                  className="review-section-edit-btn"
                  onClick={() => { setCheckoutStep(9); setValidationError(''); }}
                >
                  Edit
                </button>
              </div>
              <div className="review-section-body">
                <p><strong>Cash on Delivery (COD)</strong></p>
                <p style={{ fontSize: '10.5px', color: '#666', marginTop: '2px' }}>
                  Pay ₹{total} in cash upon package receipt.
                </p>
              </div>
            </div>

            {/* Items Summary */}
            <div className="review-section-card">
              <div className="review-section-header">
                <span>🛍️ Order Review ({cart.reduce((s, i) => s + i.quantity, 0)} Items)</span>
              </div>
              <div className="review-section-items-list">
                {cart.map(item => (
                  <div key={item.id} className="review-item-row">
                    <span className="review-item-name">
                      {item.product.title} <span style={{ color: '#888', fontWeight: '500' }}>({item.size}) &times; {item.quantity}</span>
                    </span>
                    <span className="review-item-price">₹{item.product.currentPrice * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const getStepSubtitle = () => {
    if (checkoutStep >= 1 && checkoutStep <= 8) {
      const fieldNames = [
        'Block Number',
        'Society Name',
        'Area / Locality',
        'Landmark (Optional)',
        'City',
        'State',
        'Country',
        'Pin Code'
      ];
      return `Address Step ${checkoutStep} of 8 • Enter ${fieldNames[checkoutStep - 1]}`;
    }
    switch (checkoutStep) {
      case 9: return "Step 2 of 3 • Payment Method";
      case 10: return "Step 3 of 3 • Review & Place Order";
      default: return "";
    }
  };

  const getStepTitle = () => {
    if (checkoutStep >= 1 && checkoutStep <= 8) {
      return "Shipping Address";
    }
    switch (checkoutStep) {
      case 9: return "Payment Method";
      case 10: return "Review Order";
      default: return "Checkout";
    }
  };

  // If order failed page state is active
  if (isOrderFailed) {
    return (
      <>
        <Backdrop isOpen={isOpen} onClick={handleClose} />
        <div className={`cart-top-sheet ${isOpen ? 'active' : ''}`} style={{ backgroundColor: '#ffffff' }}>
          <button 
            onClick={handleClose} 
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#999',
              zIndex: 10
            }}
          >
            &times;
          </button>
          <div className="drawer-content failed-screen-container">
            <h2 className="failed-title">Order failed. Please try again.</h2>
            <p className="failed-desc">
              We're sorry, but your order could not be completed at this time. This may have occurred due to an address issue, a connection error, or temporary system downtime.
            </p>
            <p className="failed-instruction">
              Please review your Address details and try placing the order again.
            </p>
            <button className="start-new-order-btn" onClick={handleStartNewOrder}>
              Start a New Order
            </button>
          </div>
        </div>
      </>
    );
  }

  // If order success page state is active
  if (isOrderSuccess) {
    return (
      <>
        <Backdrop isOpen={isOpen} onClick={handleClose} />
        <div className={`cart-top-sheet ${isOpen ? 'active' : ''}`} style={{ backgroundColor: '#ffffff' }}>
          <button 
            onClick={handleClose} 
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#999',
              zIndex: 10
            }}
          >
            &times;
          </button>
          <div className="drawer-content success-screen-container">
            <div className="success-checkmark-circle">
              <span className="success-checkmark-icon">✓</span>
            </div>
            <h2 className="success-title">Order Placed Successfully!</h2>
            <p className="success-desc">
              Thank you for shopping with us! Your order has been registered and is now being processed.
            </p>
            <div className="success-order-details-box">
              <div><strong>Order ID:</strong> #{successOrderId}</div>
              <div><strong>Status:</strong> Placed (Processing)</div>
              <div><strong>Payment Mode:</strong> {
                paymentMethod === 'Credit/Debit Card' ? 'Credit/Debit Card' :
                paymentMethod === 'UPI' ? 'UPI' :
                paymentMethod === 'Net Banking' ? 'Net Banking' : 'Cash on Delivery'
              }</div>
              <div style={{ marginTop: '8px', fontSize: '11px', color: '#666', borderTop: '1px solid #eee', paddingTop: '8px' }}>
                <strong>Deliver to:</strong> {blockNo}, {societyName}, {city} ({pinCode})
              </div>
            </div>
            <p className="success-instruction">
              An email confirmation with invoice and tracking details has been sent to you.
            </p>
            
            <div style={{ display: 'flex', gap: '12px', width: '100%', marginTop: '16px' }}>
              <button 
                className="success-action-btn secondary" 
                onClick={() => {
                  handleClose();
                  onOpenModal('orders');
                }}
              >
                View My Orders
              </button>
              <button className="success-action-btn primary" onClick={handleClose}>
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Backdrop isOpen={isOpen} onClick={handleClose} />
      <div className={`cart-top-sheet ${isOpen ? 'active' : ''}`}>
        <div className="drawer-header">
          {checkoutStep === 0 ? (
            <h3>Shopping Cart ({cart.reduce((s, i) => s + i.quantity, 0)})</h3>
          ) : (
            <h3>{getStepTitle()}</h3>
          )}
          <button className="drawer-close-btn" onClick={handleClose}>&times;</button>
        </div>
        
        <div className="drawer-content">
          {checkoutStep === 0 ? (
            cart.length === 0 ? (
              <div className="empty-state">
                <span className="empty-state-icon">🛒</span>
                <p>Your cart is empty!</p>
                <button className="empty-state-btn" onClick={handleClose}>Shop Now</button>
              </div>
            ) : (
              <>
                {/* Slot 1: Cart Top Ad */}
                <AdSlot 
                  styleType="banner"
                  id="cart-top-ad"
                  adSlots={adSlots}
                  title="Flash Sale: Flat 15% Off Accessories"
                  subtitle="Use code: ACC15 on check out."
                  btnText="Claim Now"
                />

                {cart.map((item, idx) => (
                  <React.Fragment key={item.id}>
                    <div className="cart-item">
                      <img src={item.product.image} alt={item.product.title} className="cart-item__img" />
                      <div className="cart-item__info">
                        <div>
                          <div className="cart-item__title">{item.product.title}</div>
                          <div className="cart-item__details">Size: {item.size}</div>
                        </div>
                        <div className="cart-item__bottom">
                          <span className="cart-item__price">₹{item.product.currentPrice}</span>
                          <div className="cart-item__qty">
                            <button className="cart-item__qty-btn" onClick={() => onUpdateQty(item.id, item.quantity - 1)}>-</button>
                            <span className="cart-item__qty-val">{item.quantity}</span>
                            <button className="cart-item__qty-btn" onClick={() => onUpdateQty(item.id, item.quantity + 1)}>+</button>
                          </div>
                        </div>
                      </div>
                      <button className="cart-item__remove" onClick={() => onRemove(item.id)}>&times;</button>
                    </div>
                    {/* Slot 2: Cart In-feed Card Ad */}
                    {idx === 1 && (
                      <div style={{ margin: '8px 0 16px 0' }}>
                        <AdSlot 
                           styleType="card"
                           id="cart-infeed-ad"
                           adSlots={adSlots}
                           title="Premium Leather Wallet"
                           subtitle="Handcrafted bifold wallet in pure leather."
                           btnText="Add for ₹499"
                        />
                      </div>
                    )}
                  </React.Fragment>
                ))}

                {/* Slot 3: Cart Bottom Ad */}
                <AdSlot 
                  styleType="banner"
                  id="cart-bottom-ad"
                  adSlots={adSlots}
                  title="Free Delivery on Combo Sets"
                  subtitle="Buy any 2 items and get additional goodies free!"
                  btnText="Learn More"
                />

                {/* Coupon Section */}
                <div style={{ marginTop: '16px', borderBottom: '1px solid #f0f0f0', paddingBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: '600' }}>Apply Coupon</span>
                    <button 
                      onClick={() => onOpenModal('offers')} 
                      style={{ fontSize: '11px', color: '#0091ea', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      View Offers
                    </button>
                  </div>
                  <form className="coupon-section" onSubmit={handleApplyCoupon}>
                    <input 
                      type="text" 
                      placeholder="Enter Code (e.g. HELL10)" 
                      className="coupon-input"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <button type="submit" className="coupon-btn">Apply</button>
                  </form>
                  {couponSuccess && <div className="coupon-message success">{couponSuccess}</div>}
                  {couponError && <div className="coupon-message error">{couponError}</div>}
                  {appliedDiscount && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', background: '#e8f5e9', padding: '4px 8px', borderRadius: '4px' }}>
                      <span style={{ fontSize: '10px', color: '#2e7d32', fontWeight: '600' }}>Active: {appliedDiscount.code} ({appliedDiscount.label})</span>
                      <button 
                        onClick={() => { onApplyDiscount(null); setCouponSuccess(''); }} 
                        style={{ border: 'none', background: 'none', color: '#d32f2f', fontSize: '11px', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </>
            )
          ) : (
            /* Checkout Step Inputs */
            <div className="checkout-step-container">
              {/* Timeline Progress */}
              <div className="checkout-progress-timeline">
                {[
                  { id: 1, label: 'Address', active: checkoutStep >= 1 && checkoutStep <= 8, completed: checkoutStep > 8 },
                  { id: 2, label: 'Payment', active: checkoutStep === 9, completed: checkoutStep > 9 },
                  { id: 3, label: 'Review', active: checkoutStep === 10, completed: false }
                ].map((t, idx) => (
                  <React.Fragment key={t.id}>
                    <div className={`timeline-node ${t.active ? 'active' : ''} ${t.completed ? 'completed' : ''}`}>
                      <div className="node-number">{t.completed ? '✓' : t.id}</div>
                      <span className="node-label">{t.label}</span>
                    </div>
                    {idx < 2 && (
                      <div className={`timeline-line ${t.completed ? 'completed' : ''}`}></div>
                    )}
                  </React.Fragment>
                ))}
              </div>
              <span className="checkout-step-subtitle">{getStepSubtitle()}</span>
              {renderWizardInput()}
              {validationError && <div className="checkout-validation-error">{validationError}</div>}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="drawer-footer">
            {checkoutStep === 0 ? (
              <>
                <div className="price-summary-row">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="price-summary-row" style={{ color: '#2e7d32' }}>
                    <span>Discount</span>
                    <span>- ₹{discountAmount}</span>
                  </div>
                )}
                <div className="price-summary-row">
                  <span>Delivery Charges</span>
                  <span style={{ color: '#2e7d32' }}>FREE</span>
                </div>
                <div className="price-summary-row total">
                  <span>Total Amount</span>
                  <span>₹{total}</span>
                </div>
                <button 
                  className="checkout-btn" 
                  onClick={() => setCheckoutStep(1)}
                >
                  Proceed to Checkout
                </button>
              </>
            ) : (
              <>
                {/* DYNAMIC PRICES CARD */}
                <div className="checkout-prices-card-compact">
                  <div className="checkout-prices-card-compact__info">
                    <span className="checkout-prices-card-compact__title">Total Payable</span>
                    <span className="checkout-prices-card-compact__sub">
                      {cart.reduce((s, i) => s + i.quantity, 0)} item{cart.reduce((s, i) => s + i.quantity, 0) > 1 ? 's' : ''} &bull; GST & Shipping Included
                    </span>
                  </div>
                  <span className="checkout-prices-card-compact__price">₹{total.toLocaleString('en-IN')}</span>
                </div>

                {/* ACTION BUTTONS */}
                <div className="checkout-actions-row">
                  <button 
                    className="checkout-back-btn"
                    onClick={() => {
                      setValidationError('');
                      if (checkoutStep === 1) {
                        setCheckoutStep(0);
                      } else {
                        setCheckoutStep(prev => prev - 1);
                      }
                    }}
                  >
                    {checkoutStep === 1 ? 'Back to Cart' : 'Back'}
                  </button>
                  {checkoutStep < 10 ? (
                    <button 
                      className="checkout-next-btn"
                      onClick={validateAndProceed}
                    >
                      {checkoutStep < 8 
                        ? 'Next Field ➔' 
                        : checkoutStep === 8 
                          ? 'Proceed to Payment' 
                          : 'Proceed to Review'}
                    </button>
                  ) : (
                    <button 
                      className="checkout-next-btn"
                      onClick={handlePlaceOrder}
                    >
                      Place Order
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

// 2. WISHLIST DRAWER
export const WishlistDrawer = ({ isOpen, onClose, wishlist, onRemove, onAddToCart }) => {
  return (
    <>
      <Backdrop isOpen={isOpen} onClick={onClose} />
      <div className={`drawer-container ${isOpen ? 'active' : ''}`}>
        <div className="drawer-header">
          <h3>My Wishlist ({wishlist.length})</h3>
          <button className="drawer-close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div className="drawer-content">
          {wishlist.length === 0 ? (
            <div className="empty-state">
              <span className="empty-state-icon">❤️</span>
              <p>Your wishlist is empty!</p>
              <button className="empty-state-btn" onClick={onClose}>Shop Now</button>
            </div>
          ) : (
            wishlist.map((product) => (
              <div className="wishlist-item" key={product.id}>
                <img src={product.image} alt={product.title} className="wishlist-item__img" />
                <div className="wishlist-item__info">
                  <div className="wishlist-item__title">{product.title}</div>
                  <div className="wishlist-item__price">₹{product.currentPrice}</div>
                </div>
                <div className="wishlist-item__actions">
                  <button 
                    className="wishlist-item__btn-cart" 
                    onClick={() => {
                      onAddToCart(product);
                      onRemove(product.id);
                    }}
                  >
                    Move to Cart
                  </button>
                  <button className="wishlist-item__btn-remove" onClick={() => onRemove(product.id)}>Remove</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};



// 4. OFFERS MODAL (Centered dialog)
export const OffersModal = ({ isOpen, onClose, onApplyCoupon }) => {
  const offersList = [
    { code: 'HELL10', label: '10% off', desc: 'Get 10% instant discount on orders above ₹100', type: 'percentage', value: 10 },
    { code: 'WELCOME50', label: '₹50 off', desc: 'Flat ₹50 off on your first purchase!', type: 'flat', value: 50 },
    { code: 'FREE2', label: 'Buy 2 Get 2 Free', desc: 'Add 4 items to cart and apply this to get discount on lowest priced items', type: 'percentage', value: 20 }
  ];

  return (
    <>
      <Backdrop isOpen={isOpen} onClick={onClose} />
      <div className={`centered-dialog ${isOpen ? 'active' : ''}`}>
        <div className="drawer-header">
          <h3>Available Offers & Coupons</h3>
          <button className="drawer-close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="drawer-content" style={{ padding: '16px' }}>
          {offersList.map((offer) => (
            <div className="offer-card" key={offer.code}>
              <div>
                <span className="offer-code">{offer.code}</span>
                <span style={{ marginLeft: '8px', fontSize: '10px', background: '#fff', padding: '2px 6px', border: '1px solid #f57c00', borderRadius: '4px', color: '#f57c00', fontWeight: 'bold' }}>
                  {offer.label}
                </span>
                <div className="offer-desc">{offer.desc}</div>
              </div>
              <button 
                className="offer-apply-btn"
                onClick={() => {
                  onApplyCoupon(offer);
                  onClose();
                }}
              >
                Apply
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

// 5. MY ORDERS MODAL (Centered dialog)
export const MyOrdersModal = ({ isOpen, onClose, orders }) => {
  return (
    <>
      <Backdrop isOpen={isOpen} onClick={onClose} />
      <div className={`centered-dialog ${isOpen ? 'active' : ''}`}>
        <div className="drawer-header">
          <h3>Order History</h3>
          <button className="drawer-close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="drawer-content" style={{ padding: '16px' }}>
          {orders.length === 0 ? (
            <div className="empty-state">
              <span className="empty-state-icon">📦</span>
              <p>No orders placed yet!</p>
            </div>
          ) : (
            orders.map((order, idx) => (
              <div className="order-card" key={order.id || idx}>
                <div className="order-header">
                  <span>Order ID: #{order.id}</span>
                  <span className="order-status">{order.status}</span>
                </div>
                <div style={{ marginBottom: '8px' }}>
                  {order.items.map((item, itemIdx) => (
                    <div className="order-product" key={itemIdx}>
                      <span>{item.title} ({item.size}) &times; {item.quantity}</span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', borderTop: '1px solid #f9f9f9', paddingTop: '6px' }}>
                  <span>Total Paid ({order.paymentMethod || 'Cash on Delivery'}):</span>
                  <span>₹{order.total}</span>
                </div>
                <div style={{ fontSize: '9px', color: '#888', marginTop: '6px' }}>
                  Delivered to: {order.address}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

// 6. ACCOUNT / PROFILE MODAL (Centered dialog)
export const AccountModal = ({ isOpen, onClose, profile, onSaveProfile }) => {
  const [name, setName] = useState(profile.name || 'John Doe');
  const [email, setEmail] = useState(profile.email || 'john.doe@example.com');
  const [address, setAddress] = useState(profile.address || '123 Main St, New Delhi, 110001');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveProfile({ name, email, address });
    onClose();
  };

  return (
    <>
      <Backdrop isOpen={isOpen} onClick={onClose} />
      <div className={`centered-dialog ${isOpen ? 'active' : ''}`}>
        <div className="drawer-header">
          <h3>Profile & Settings</h3>
          <button className="drawer-close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="drawer-content">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Full Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%', padding: '8px', fontSize: '12px', border: '1px solid #ccc', borderRadius: '4px' }}
                required
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '8px', fontSize: '12px', border: '1px solid #ccc', borderRadius: '4px' }}
                required
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Shipping Address</label>
              <textarea 
                value={address} 
                onChange={(e) => setAddress(e.target.value)}
                className="address-textarea"
                required
              />
            </div>
            <button 
              type="submit" 
              style={{ background: '#0091ea', color: 'white', border: 'none', padding: '10px', fontSize: '13px', fontWeight: '700', borderRadius: '6px', cursor: 'pointer', marginTop: '8px' }}
            >
              Save Details
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

// 7. TEXT CONTENT / POLICY VIEWER MODAL (Centered dialog)
export const TextModal = ({ isOpen, onClose, title, content }) => {
  const renderRichContent = (rawContent) => {
    if (!rawContent) return null;
    
    // Split by double newlines to find paragraphs/sections
    const sections = rawContent.split('\n\n');
    
    return sections.map((section, idx) => {
      const trimmed = section.trim();
      if (!trimmed) return null;

      // Skip redundant headers in content since they're in the modal title
      if (idx === 0 && (
        trimmed.toLowerCase().startsWith('about us') || 
        trimmed.toLowerCase().startsWith('contact us') || 
        trimmed.toLowerCase().startsWith('frequently asked') || 
        trimmed.toLowerCase().startsWith('terms & conditions') || 
        trimmed.toLowerCase().startsWith('privacy policy') || 
        trimmed.toLowerCase().startsWith('cookie policy') || 
        trimmed.toLowerCase().startsWith('return & refund') || 
        trimmed.toLowerCase().startsWith('disclosure policy') || 
        trimmed.toLowerCase().startsWith('disclaimer')
      )) {
        return null; 
      }

      // FAQ section parsing (Q: and A: lines)
      if (trimmed.startsWith('Q:') || trimmed.startsWith('A:')) {
        const lines = trimmed.split('\n');
        return (
          <div key={idx} className="policy-faq-section">
            {lines.map((line, lIdx) => {
              const lineTrimmed = line.trim();
              if (lineTrimmed.startsWith('Q:')) {
                return <div key={lIdx} className="policy-faq-q">{lineTrimmed}</div>;
              } else if (lineTrimmed.startsWith('A:')) {
                return <div key={lIdx} className="policy-faq-a">{lineTrimmed}</div>;
              }
              return <div key={lIdx} className="policy-faq-text">{lineTrimmed}</div>;
            })}
          </div>
        );
      }

      // Contact Info Card parsing
      if (trimmed.includes('✉ Email:') || trimmed.includes('📞 Phone:') || trimmed.includes('🏢 Address:')) {
        const lines = trimmed.split('\n');
        return (
          <div key={idx} className="policy-contact-card">
            <h5>Direct Helpline Channels</h5>
            {lines.map((line, lIdx) => {
              if (line.includes('✉ Email:')) {
                const emailVal = line.replace('✉ Email:', '').trim();
                return (
                  <div key={lIdx} className="contact-card-line">
                    <span className="card-icon">✉</span>
                    <div className="card-info">
                      <label>Email Support</label>
                      <a href={`mailto:${emailVal}`}>{emailVal}</a>
                    </div>
                  </div>
                );
              }
              if (line.includes('📞 Phone:')) {
                const phoneVal = line.replace('📞 Phone:', '').trim();
                return (
                  <div key={lIdx} className="contact-card-line">
                    <span className="card-icon">📞</span>
                    <div className="card-info">
                      <label>Helpline Number</label>
                      <a href={`tel:${phoneVal.replace(/\s+/g, '')}`}>{phoneVal}</a>
                    </div>
                  </div>
                );
              }
              if (line.includes('🏢 Address:')) {
                const addrVal = line.replace('🏢 Address:', '').trim();
                return (
                  <div key={lIdx} className="contact-card-line">
                    <span className="card-icon">🏢</span>
                    <div className="card-info">
                      <label>Corporate Office</label>
                      <span>{addrVal}</span>
                    </div>
                  </div>
                );
              }
              return <p key={lIdx} style={{ fontSize: '11px', color: '#666', margin: '4px 0 0 34px' }}>{line}</p>;
            })}
          </div>
        );
      }

      // Unordered lists parsing
      if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
        const items = trimmed.split('\n');
        return (
          <ul key={idx} className="policy-list">
            {items.map((item, iIdx) => {
              const cleanItem = item.replace(/^[-*]\s*/, '').trim();
              return <li key={iIdx}>{cleanItem}</li>;
            })}
          </ul>
        );
      }

      // Default styled paragraph
      return (
        <p key={idx} className="policy-paragraph">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <>
      <Backdrop isOpen={isOpen} onClick={onClose} />
      <div className={`centered-dialog ${isOpen ? 'active' : ''}`}>
        <div className="drawer-header">
          <h3>{title}</h3>
          <button className="drawer-close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="drawer-content" style={{ padding: '16px 20px', overflowY: 'auto' }}>
          <div className="policy-modal-rich-body">
            {renderRichContent(content)}
          </div>
        </div>
      </div>
    </>
  );
};
