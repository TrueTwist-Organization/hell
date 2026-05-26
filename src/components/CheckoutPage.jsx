import React, { useState } from 'react';
import AdSlot from './AdSlot';

const CheckoutPage = ({
  cart,
  onUpdateQty,
  onRemove,
  appliedDiscount,
  onApplyDiscount,
  profile,
  onCheckout,
  onOpenModal,
  onBack
}) => {
  const [checkoutStep, setCheckoutStep] = useState(0); // 0 = Cart Summary Page, 1 to 8 = Address, 9 = COD, 10 = Review, 11 = Success
  const [blockNo, setBlockNo] = useState('');
  const [societyName, setSocietyName] = useState('');
  const [area, setArea] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('India');
  const [pinCode, setPinCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  
  const [validationError, setValidationError] = useState('');
  const [isOrderFailed, setIsOrderFailed] = useState(false);
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);
  const [successOrderId, setSuccessOrderId] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Reset order state to start a new order
  const handleStartNewOrder = () => {
    setIsOrderFailed(false);
    setIsOrderSuccess(false);
    setCheckoutStep(1);
    setValidationError('');
    setPhone('');
    setEmail('');
  };

  // Pricing calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.product.currentPrice * item.quantity), 0);
  const delivery = 0;
  
  let discountAmount = 0;
  if (appliedDiscount && subtotal > 0) {
    if (appliedDiscount.type === 'percentage') {
      discountAmount = Math.round(subtotal * (appliedDiscount.value / 100));
    } else if (appliedDiscount.type === 'flat') {
      discountAmount = Math.min(appliedDiscount.value, subtotal);
    }
  }

  const total = Math.max(0, subtotal - discountAmount + delivery);
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

  const validateAndProceed = (e) => {
    if (e) e.preventDefault();
    setValidationError('');
    let val = '';

    if (checkoutStep === 1) {
      if (!blockNo.trim()) val = 'Block Number is required.';
    } else if (checkoutStep === 2) {
      if (!societyName.trim()) val = 'Society Name is required.';
    } else if (checkoutStep === 3) {
      if (!area.trim()) val = 'Area/Locality is required.';
    } else if (checkoutStep === 5) {
      if (!city.trim()) val = 'City is required.';
    } else if (checkoutStep === 6) {
      if (!state.trim()) val = 'State is required.';
    } else if (checkoutStep === 7) {
      if (!country.trim()) val = 'Country is required.';
    } else if (checkoutStep === 8) {
      if (!pinCode.trim()) {
        val = 'Pin Code is required.';
      } else if (!/^\d{6}$/.test(pinCode.trim())) {
        val = 'Pin Code must be a 6-digit number.';
      }
    } else if (checkoutStep === 9) {
      if (!phone.trim()) {
        val = 'Phone Number is required.';
      } else if (!/^\d{10}$/.test(phone.trim())) {
        val = 'Phone Number must be a valid 10-digit number.';
      } else if (!email.trim()) {
        val = 'Email Address is required.';
      } else if (!/^[\w.-]+@[\w.-]+\.\w+$/.test(email.trim())) {
        val = 'Please enter a valid Gmail / Email address.';
      }
    }

    if (val) {
      setValidationError(val);
      return;
    }

    setCheckoutStep(prev => prev + 1);
  };

  const handlePlaceOrder = () => {
    // Register the order with complete details in the system so orders list shows it
    const constructedAddress = `${blockNo}, ${societyName}, ${area}${landmark ? `, ${landmark}` : ''}, ${city}, ${state}, ${country} - ${pinCode} | Phone: ${phone} | Email: ${email}`;
    onCheckout(constructedAddress, paymentMethod);
    
    // As explicitly requested, show the order failed message at the very end
    setIsOrderFailed(true);
  };

  // Helper to render input field inside the card
  const renderAddressField = () => {
    switch (checkoutStep) {
      case 1:
        return (
          <div className="form-group animate-slide">
            <label htmlFor="blockNo">Block Number</label>
            <input 
              type="text" 
              id="blockNo"
              value={blockNo} 
              onChange={(e) => { setBlockNo(e.target.value); setValidationError(''); }}
              placeholder="e.g. House / Plot / Block No."
              autoFocus
            />
            <span className="field-tip">Enter your primary house, flat, plot, or block number.</span>
          </div>
        );
      case 2:
        return (
          <div className="form-group animate-slide">
            <label htmlFor="societyName">Society Name</label>
            <input 
              type="text" 
              id="societyName"
              value={societyName} 
              onChange={(e) => { setSocietyName(e.target.value); setValidationError(''); }}
              placeholder="e.g. Society / Apartment / Building"
              autoFocus
            />
            <span className="field-tip">Enter building name, society name, or residential project.</span>
          </div>
        );
      case 3:
        return (
          <div className="form-group animate-slide">
            <label htmlFor="area">Area / Locality</label>
            <input 
              type="text" 
              id="area"
              value={area} 
              onChange={(e) => { setArea(e.target.value); setValidationError(''); }}
              placeholder="e.g. Area, Sector, Road Name"
              autoFocus
            />
            <span className="field-tip">Enter your street address, sector, colony, or locality.</span>
          </div>
        );
      case 4:
        return (
          <div className="form-group animate-slide">
            <label htmlFor="landmark">Landmark (Optional)</label>
            <input 
              type="text" 
              id="landmark"
              value={landmark} 
              onChange={(e) => { setLandmark(e.target.value); setValidationError(''); }}
              placeholder="e.g. Near City Mall"
              autoFocus
            />
            <span className="field-tip">Any prominent nearby place to help locate your address quickly.</span>
          </div>
        );
      case 5:
        return (
          <div className="form-group animate-slide">
            <label htmlFor="city">City</label>
            <input 
              type="text" 
              id="city"
              value={city} 
              onChange={(e) => { setCity(e.target.value); setValidationError(''); }}
              placeholder="e.g. New Delhi"
              autoFocus
            />
            <span className="field-tip">Enter your city or district.</span>
          </div>
        );
      case 6:
        return (
          <div className="form-group animate-slide">
            <label htmlFor="state">State</label>
            <input 
              type="text" 
              id="state"
              value={state} 
              onChange={(e) => { setState(e.target.value); setValidationError(''); }}
              placeholder="e.g. Delhi"
              autoFocus
            />
            <span className="field-tip">Enter your state or region.</span>
          </div>
        );
      case 7:
        return (
          <div className="form-group animate-slide">
            <label htmlFor="country">Country</label>
            <input 
              type="text" 
              id="country"
              value={country} 
              onChange={(e) => { setCountry(e.target.value); setValidationError(''); }}
              placeholder="Country Name"
              autoFocus
            />
            <span className="field-tip">Enter country name (defaults to India).</span>
          </div>
        );
      case 8:
        return (
          <div className="form-group animate-slide">
            <label htmlFor="pinCode">Pin Code</label>
            <input 
              type="text" 
              pattern="\d*"
              maxLength="6"
              id="pinCode"
              value={pinCode} 
              onChange={(e) => { setPinCode(e.target.value.replace(/\D/g, '')); setValidationError(''); }}
              placeholder="e.g. 110001"
              autoFocus
            />
            <span className="field-tip">Enter your 6-digit area PIN/ZIP code.</span>
          </div>
        );
      default:
        return null;
    }
  };

  if (isOrderFailed) {
    return (
      <section className="checkout">
        <div className="checkout__card failed-screen-container" style={{ margin: '0 auto', maxWidth: '480px' }}>
          <h2 className="failed-title">Order failed. Please try again.</h2>
          <p className="failed-desc">
            We're sorry, but your order could not be completed at this time. This may have occurred due to an address issue, connection error, or temporary downtime.
          </p>
          <p className="failed-instruction">
            Please review your details and try placing the order again.
          </p>
          <button className="start-new-order-btn" onClick={handleStartNewOrder}>
            Start a New Order
          </button>
        </div>
      </section>
    );
  }

  if (isOrderSuccess) {
    return (
      <section className="checkout">
        <div className="checkout__card success-screen-container" style={{ margin: '0 auto', maxWidth: '480px' }}>
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
            <div><strong>Payment Mode:</strong> Cash on Delivery</div>
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
                onOpenModal('orders');
              }}
            >
              View My Orders
            </button>
            <button className="success-action-btn primary" onClick={onBack}>
              Continue Shopping
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (cart.length === 0) {
    return (
      <section className="checkout" style={{ padding: '40px 16px', textAlign: 'center' }}>
        <div className="checkout__card" style={{ padding: '40px 24px', margin: '0 auto', maxWidth: '480px' }}>
          <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>🛒</span>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px' }}>Your cart is empty!</h3>
          <p style={{ fontSize: '13px', color: '#666', marginBottom: '24px' }}>Add some products to your cart to begin checkout.</p>
          <button className="btn btn--green btn--full" onClick={onBack} style={{ padding: '12px' }}>Shop Now</button>
        </div>
      </section>
    );
  }

  // 1. STEP 0: CART SUMMARY PAGE (Matching screenshot)
  if (checkoutStep === 0) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    return (
      <section className="checkout" style={{ paddingBottom: '20px' }}>
        {/* Notice Card */}
        <div className="checkout__card" style={{ borderTop: '3px solid #7a0d4d', marginTop: '0', borderRadius: '0 0 12px 12px' }}>
          <p style={{ fontSize: '0.88rem', color: '#333', lineHeight: '1.6', margin: '0' }}>
            Your cart is almost there—just one step from checkout! We've kept everything simple and trustworthy, inspired by the smooth experiences you know from Amazon and Flipkart. Review your picks, confirm sizes and quantities, and tap “Proceed.” It's that easy.
          </p>
        </div>

        {/* Cart Items List */}
        <div className="checkout__card">
          <h2 className="checkout__card-title" style={{ fontSize: '14px', margin: '0 0 12px 0' }}>Items in your Cart</h2>
          <div className="checkout__divider"></div>
          {cart.map((item) => (
            <div className="cart-item" key={item.id} style={{ borderBottom: '1px solid #f0f0f0', padding: '12px 0' }}>
              <img src={item.product.image} alt={item.product.title} className="cart-item__img" style={{ width: '55px', height: '70px', objectFit: 'cover', borderRadius: '4px' }} />
              <div className="cart-item__info" style={{ marginLeft: '12px', flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div className="cart-item__title" style={{ fontSize: '12px', fontWeight: '600', color: '#333' }}>{item.product.title}</div>
                  <div className="cart-item__details" style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>Size: {item.size}</div>
                </div>
                <div className="cart-item__bottom" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                  <span className="cart-item__price" style={{ fontSize: '13px', fontWeight: '700' }}>₹{item.product.currentPrice}</span>
                  <div className="cart-item__qty" style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '4px', overflow: 'hidden' }}>
                    <button className="cart-item__qty-btn" onClick={() => onUpdateQty(item.id, item.quantity - 1)} style={{ padding: '0 8px', border: 'none', background: '#f5f5f5', cursor: 'pointer' }}>-</button>
                    <span className="cart-item__qty-val" style={{ padding: '0 8px', fontSize: '11px', fontWeight: '600' }}>{item.quantity}</span>
                    <button className="cart-item__qty-btn" onClick={() => onUpdateQty(item.id, item.quantity + 1)} style={{ padding: '0 8px', border: 'none', background: '#f5f5f5', cursor: 'pointer' }}>+</button>
                  </div>
                </div>
              </div>
              <button className="cart-item__remove" onClick={() => onRemove(item.id)} style={{ border: 'none', background: 'none', fontSize: '18px', color: '#999', cursor: 'pointer', marginLeft: '8px' }}>&times;</button>
            </div>
          ))}

          {/* Coupon Code Section */}
          <div style={{ marginTop: '16px', borderTop: '1px solid #f0f0f0', paddingTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: '600' }}>Apply Coupon</span>
              <button 
                onClick={() => onOpenModal('offers')} 
                style={{ fontSize: '11px', color: '#0091ea', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                View Offers
              </button>
            </div>
            <form className="coupon-section" onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <input 
                type="text" 
                placeholder="Enter Code (e.g. HELL10)" 
                className="coupon-input"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                style={{ flex: '1', border: '1px solid #ccc', borderRadius: '4px', padding: '6px 10px', fontSize: '12px' }}
              />
              <button type="submit" className="coupon-btn" style={{ background: '#333', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', fontWeight: '600', cursor: 'pointer' }}>Apply</button>
            </form>
            {couponSuccess && <div className="coupon-message success" style={{ color: '#2e7d32', fontSize: '10px', marginTop: '4px' }}>{couponSuccess}</div>}
            {couponError && <div className="coupon-message error" style={{ color: '#f44336', fontSize: '10px', marginTop: '4px' }}>{couponError}</div>}
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
        </div>

        {/* Order Summary Card */}
        <div className="checkout__card">
          <h2 className="checkout__card-title" style={{ fontSize: '15px', color: '#7a0d4d', marginBottom: '4px' }}>{totalItems} item{totalItems > 1 ? 's' : ''} in your cart</h2>
          <p className="checkout__card-sub" style={{ fontSize: '10px', color: '#666', margin: '0 0 12px 0' }}>Prices include GST &bull; Free delivery</p>

          <div className="checkout__divider"></div>

          <div className="checkout__price-row">
            <span className="checkout__price-label">MRP</span>
            <span className="checkout__price-value">₹{mrp.toLocaleString('en-IN')}</span>
          </div>
          <div className="checkout__price-row">
            <span className="checkout__price-label">Sale price</span>
            <span className="checkout__price-value">₹{subtotal.toLocaleString('en-IN')}</span>
          </div>
          {discountAmount > 0 && (
            <div className="checkout__price-row" style={{ color: '#2e7d32' }}>
              <span className="checkout__price-label">Discount ({appliedDiscount?.code})</span>
              <span className="checkout__price-value">- ₹{discountAmount.toLocaleString('en-IN')}</span>
            </div>
          )}
          <div className="checkout__price-row">
            <span className="checkout__price-label">Delivery charge</span>
            <span className="checkout__price-value">₹0</span>
          </div>
          <div className="checkout__price-row">
            <span className="checkout__price-label">GST</span>
            <span className="checkout__price-value">Included</span>
          </div>

          <div className="checkout__divider"></div>

          <div className="checkout__price-row checkout__price-row--total">
            <span className="checkout__price-label">Total payable</span>
            <span className="checkout__price-value">₹{total.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Proceed Button */}
        <div style={{ padding: '12px 0' }}>
          <button className="btn btn--green btn--full" onClick={() => setCheckoutStep(1)} style={{ padding: '16px', fontSize: '1rem', width: '100%', cursor: 'pointer', borderRadius: '6px' }}>
            Proceed to Checkout
          </button>
        </div>

        {/* Info Text Paragraphs matching screenshot */}
        <section className="cart-info-text">
          <p>Need quick answers before you buy? Our built-in assistant (powered by chat gpt–style guidance) helps you compare specs, check compatibility, and find the right add-ons—without leaving the cart. Ask a question, get a clear, helpful suggestion, and keep moving.</p>
          <p>Prices here update in real time—no surprises at payment. We also surface the best available coupons, similar to the smart deal discovery you see on Google. If a bundle saves you more, you’ll see it in your cart so you can lock in extra value instantly.</p>
          <p>Prefer to think it over? Save items to your wishlist and sync across devices. Whether you’re browsing on mobile or desktop, you’ll enjoy fast, secure checkout flows you’d expect from top marketplaces like Amazon and Flipkart, with multiple payment options and instant order confirmation.</p>
          <p>We protect your purchase with safe payments, easy returns, and proactive order tracking. From the moment you hit “Place Order,” you’ll receive timely updates, plus chat gpt–style tips on setup, care, and accessories so you get the most from what you buy.</p>
          <p>Ready when you are—review, apply any coupons, and check out with confidence. Your cart experience blends the clarity of Google search, the reliability of Amazon, and the ease of Flipkart, all in one streamlined flow tailored to you.</p>
        </section>
      </section>
    );
  }

  // 2. STEPS 1 TO 8: ADDRESS WIZARD
  if (checkoutStep >= 1 && checkoutStep <= 8) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const progressPercent = Math.round((checkoutStep / 9) * 100);
    return (
      <section className="checkout">
        {/* Top Progress bar */}
        <div className="checkout__progress">
          <div className="checkout__progress-bar" style={{ width: `${progressPercent}%` }}></div>
        </div>

        <div className="checkout__card" style={{ marginTop: '16px' }}>
          <h2 className="checkout__card-title" style={{ fontSize: '15px', color: '#7a0d4d', marginBottom: '4px' }}>{totalItems} item{totalItems > 1 ? 's' : ''} in your cart</h2>
          <p className="checkout__card-sub">Step {checkoutStep} of 9 &bull; Prices include GST &bull; Free delivery</p>

          <form onSubmit={validateAndProceed} style={{ marginTop: '16px' }}>
            {renderAddressField()}
            {validationError && <div className="checkout-validation-error" style={{ marginTop: '10px' }}>{validationError}</div>}

            <div className="checkout__divider"></div>
            
            <div className="checkout__price-row">
              <span className="checkout__price-label">MRP</span>
              <span className="checkout__price-value">₹{mrp.toLocaleString('en-IN')}</span>
            </div>
            <div className="checkout__price-row">
              <span className="checkout__price-label">Sale price</span>
              <span className="checkout__price-value">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            {discountAmount > 0 && (
              <div className="checkout__price-row" style={{ color: '#2e7d32' }}>
                <span className="checkout__price-label">Discount</span>
                <span className="checkout__price-value">- ₹{discountAmount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="checkout__price-row">
              <span className="checkout__price-label">Delivery charge</span>
              <span className="checkout__price-value">₹0</span>
            </div>
            <div className="checkout__price-row">
              <span className="checkout__price-label">GST</span>
              <span className="checkout__price-value">Included</span>
            </div>
            <div className="checkout__divider"></div>
            <div className="checkout__price-row checkout__price-row--total">
              <span className="checkout__price-label">Total payable</span>
              <span className="checkout__price-value">₹{total.toLocaleString('en-IN')}</span>
            </div>

            <div className="checkout__nav">
              <button 
                type="button" 
                className="checkout__back-btn" 
                onClick={() => {
                  setValidationError('');
                  setCheckoutStep(prev => prev - 1);
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
                {checkoutStep === 1 ? 'Back to Cart' : 'Back'}
              </button>
              <button type="submit" className="btn btn--green btn--full" style={{ flex: '1.5', padding: '12px', fontSize: '12px' }}>
                Proceed to Next
              </button>
            </div>
          </form>
        </div>
      </section>
    );
  }

  // 3. STEP 9: COD PAYMENT METHOD
  if (checkoutStep === 9) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const progressPercent = Math.round((9 / 9) * 100);
    return (
      <section className="checkout">
        <div className="checkout__progress">
          <div className="checkout__progress-bar" style={{ width: `${progressPercent}%` }}></div>
        </div>

        <div className="checkout__card" style={{ marginTop: '16px' }}>
          <h2 className="checkout__card-title" style={{ fontSize: '15px', color: '#7a0d4d', marginBottom: '4px' }}>{totalItems} item{totalItems > 1 ? 's' : ''} in your cart</h2>
          <p className="checkout__card-sub">Step 9 of 9 &bull; Prices include GST &bull; Free delivery</p>

          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="payment-option-card-large selected" style={{ cursor: 'default', display: 'flex', gap: '12px', border: '1px solid #7a0d4d', background: '#fdfafb', padding: '12px 14px', borderRadius: '10px' }}>
              <div className="payment-option-check" style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: '18px', color: '#2e7d32' }}>🛡️</span>
              </div>
              <div className="payment-option-info">
                <div className="payment-option-title" style={{ fontSize: '12px', fontWeight: '700', color: '#1e293b' }}>Cash on Delivery (COD)</div>
                <div className="payment-option-desc" style={{ fontSize: '9.5px', color: '#64748b', marginTop: '2px' }}>Pay in cash when your order is delivered to your door.</div>
              </div>
            </div>

            {/* Contact Details form inside payment step */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', border: '1px solid #e0e0e0', borderRadius: '10px', padding: '14px', background: '#ffffff' }}>
              <h4 style={{ fontSize: '12.5px', fontWeight: '700', margin: '0 0 4px 0', color: '#333' }}>Contact Information</h4>
              
              <div className="form-group">
                <label htmlFor="phone" style={{ fontSize: '11px', fontWeight: '700' }}>Mobile / Phone Number</label>
                <input 
                  type="text" 
                  id="phone"
                  maxLength="10"
                  pattern="\d*"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '')); setValidationError(''); }}
                  placeholder="e.g. 9876543210"
                  style={{ padding: '10px', fontSize: '13px' }}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" style={{ fontSize: '11px', fontWeight: '700' }}>Gmail / Email Address</label>
                <input 
                  type="email" 
                  id="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setValidationError(''); }}
                  placeholder="e.g. customer@gmail.com"
                  style={{ padding: '10px', fontSize: '13px' }}
                />
              </div>
            </div>

            <div className="cod-badge-container" style={{ marginTop: '4px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <span className="cod-check-icon" style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}>✨</span>
              <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', margin: '0 0 6px 0' }}>100% Trust Guarantee</h4>
              <p style={{ fontSize: '11px', margin: '4px 0 12px 0', color: '#555', lineHeight: '1.4' }}>
                Currently, we only support **Cash on Delivery (COD)** for all orders. There are no online transaction risks, and shipping is completely **FREE** across India.
              </p>
              <ul className="cod-benefits-list" style={{ listStyle: 'none', padding: '0', margin: '12px 0 0 0', display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
                <li style={{ fontSize: '10.5px', color: '#475569', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>💵 Keep exact cash ready at delivery time</li>
                <li style={{ fontSize: '10.5px', color: '#475569', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>🚚 Fast dispatch with professional couriers</li>
                <li style={{ fontSize: '10.5px', color: '#475569', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>🛡️ Secure packaging and inspected items</li>
              </ul>
            </div>
          </div>

          <div className="checkout__divider"></div>
          
          <div className="checkout__price-row">
            <span className="checkout__price-label">MRP</span>
            <span className="checkout__price-value">₹{mrp.toLocaleString('en-IN')}</span>
          </div>
          <div className="checkout__price-row">
            <span className="checkout__price-label">Sale price</span>
            <span className="checkout__price-value">₹{subtotal.toLocaleString('en-IN')}</span>
          </div>
          {discountAmount > 0 && (
            <div className="checkout__price-row" style={{ color: '#2e7d32' }}>
              <span className="checkout__price-label">Discount</span>
              <span className="checkout__price-value">- ₹{discountAmount.toLocaleString('en-IN')}</span>
            </div>
          )}
          <div className="checkout__price-row">
            <span className="checkout__price-label">Delivery charge</span>
            <span className="checkout__price-value">₹0</span>
          </div>
          <div className="checkout__price-row">
            <span className="checkout__price-label">GST</span>
            <span className="checkout__price-value">Included</span>
          </div>
          <div className="checkout__divider"></div>
          <div className="checkout__price-row checkout__price-row--total">
            <span className="checkout__price-label">Total payable</span>
            <span className="checkout__price-value">₹{total.toLocaleString('en-IN')}</span>
          </div>

          <div className="checkout__nav">
            <button 
              type="button" 
              className="checkout__back-btn" 
              onClick={() => {
                setValidationError('');
                setCheckoutStep(8);
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
              Back
            </button>
            <button type="button" className="btn btn--green btn--full" onClick={() => setCheckoutStep(10)} style={{ flex: '1.5', padding: '12px', fontSize: '12px' }}>
              Proceed to Review
            </button>
          </div>
        </div>
      </section>
    );
  }

  // 4. STEP 10: REVIEW ORDER
  if (checkoutStep === 10) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    return (
      <section className="checkout">
        <div className="checkout__card">
          <h2 className="checkout__card-title" style={{ fontSize: '15px', color: '#7a0d4d', marginBottom: '4px' }}>Review & Confirm Order</h2>
          <p className="checkout__card-sub">Please review items and shipping address before placing order.</p>

          <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
                <p style={{ fontSize: '10.5px', color: '#666', marginTop: '2px' }}>Pay ₹{total} in cash upon package receipt.</p>
                <p style={{ fontSize: '10.5px', color: '#475569', marginTop: '4px', borderTop: '1px solid #f1f5f9', paddingTop: '4px' }}>
                  <strong>Phone:</strong> {phone}
                </p>
                <p style={{ fontSize: '10.5px', color: '#475569' }}>
                  <strong>Email:</strong> {email}
                </p>
              </div>
            </div>

            {/* Items Summary */}
            <div className="review-section-card">
              <div className="review-section-header">
                <span>🛍️ Order Items ({totalItems} Items)</span>
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

          <div className="checkout__divider"></div>
          
          <div className="checkout__price-row">
            <span className="checkout__price-label">MRP</span>
            <span className="checkout__price-value">₹{mrp.toLocaleString('en-IN')}</span>
          </div>
          <div className="checkout__price-row">
            <span className="checkout__price-label">Sale price</span>
            <span className="checkout__price-value">₹{subtotal.toLocaleString('en-IN')}</span>
          </div>
          {discountAmount > 0 && (
            <div className="checkout__price-row" style={{ color: '#2e7d32' }}>
              <span className="checkout__price-label">Discount</span>
              <span className="checkout__price-value">- ₹{discountAmount.toLocaleString('en-IN')}</span>
            </div>
          )}
          <div className="checkout__price-row">
            <span className="checkout__price-label">Delivery charge</span>
            <span className="checkout__price-value">₹0</span>
          </div>
          <div className="checkout__price-row">
            <span className="checkout__price-label">GST</span>
            <span className="checkout__price-value">Included</span>
          </div>
          <div className="checkout__divider"></div>
          <div className="checkout__price-row checkout__price-row--total">
            <span className="checkout__price-label">Total payable</span>
            <span className="checkout__price-value">₹{total.toLocaleString('en-IN')}</span>
          </div>

          <div className="checkout__nav">
            <button 
              type="button" 
              className="checkout__back-btn" 
              onClick={() => {
                setValidationError('');
                setCheckoutStep(9);
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
              Back
            </button>
            <button type="button" className="btn btn--green btn--full" onClick={handlePlaceOrder} style={{ flex: '1.5', padding: '12px', fontSize: '12px' }}>
              Place Order
            </button>
          </div>
        </div>
      </section>
    );
  }

  return null;
};

export default CheckoutPage;
