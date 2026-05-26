import React, { useState } from 'react';
import AdSlot from './AdSlot';

const AccountPage = ({ profile, onSaveProfile, orders, onBack, onNavigateAdmin, adSlots = [] }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [address, setAddress] = useState(profile.address);

  const handleSave = (e) => {
    e.preventDefault();
    onSaveProfile({ name, email, address });
    setIsEditing(false);
  };

  return (
    <div className="account-page-wrapper">
      {/* Navigation Header */}
      <div className="details-back-nav">
        <button className="details-back-btn" onClick={onBack} aria-label="Go Back">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          <span>Back to Shop</span>
        </button>
        <span className="details-nav-title">My Account</span>
      </div>

      <div className="account-card-container">
        {/* Slot 1: Top Banner Ad */}
        <AdSlot 
          styleType="banner"
          id="account-top-ad"
          adSlots={adSlots}
          title="Premium Grooming Kits"
          subtitle="Upgrade your daily routine with custom luxury scents."
          btnText="Explore Grooming"
        />

        {/* Profile Card */}
        <div className="account-section-card profile-card-large">
          <div className="profile-header-avatar">
            <div className="avatar-circle">
              {name ? name.charAt(0).toUpperCase() : 'G'}
            </div>
            <div className="profile-header-info">
              <h2>{name || 'Guest User'}</h2>
              <p>{email || 'guest@hell.com'}</p>
            </div>
          </div>

          {!isEditing ? (
            <div className="profile-details-show">
              <div className="profile-info-row">
                <strong>Default Shipping Address:</strong>
                <p>{address || 'No shipping address set yet.'}</p>
              </div>
              <button className="profile-edit-btn" onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleSave} className="profile-edit-form">
              <div className="checkout-form-group">
                <label className="checkout-label">Full Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="checkout-input-compact"
                  required
                />
              </div>
              <div className="checkout-form-group">
                <label className="checkout-label">Email Address</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="checkout-input-compact"
                  required
                />
              </div>
              <div className="checkout-form-group">
                <label className="checkout-label">Default Shipping Address</label>
                <textarea 
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)}
                  className="address-textarea"
                  style={{ height: '70px', padding: '8px', fontSize: '12px' }}
                  required
                />
              </div>
              <div className="profile-form-actions">
                <button type="submit" className="profile-save-btn">Save Changes</button>
                <button type="button" className="profile-cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
              </div>
            </form>
          )}
        </div>

        {/* Slot 2: Middle Banner Ad */}
        <AdSlot 
          styleType="banner"
          id="account-middle-ad"
          adSlots={adSlots}
          title="Designer Footwear Range"
          subtitle="Step out in style with handcrafted sneakers and loafers."
          btnText="View Catalog"
        />

        {/* Order History */}
        <div className="account-section-card">
          <h3 className="section-card-title">Order History</h3>
          {orders.length === 0 ? (
            <div className="empty-state" style={{ padding: '24px 16px' }}>
              <span className="empty-state-icon" style={{ fontSize: '24px' }}>📦</span>
              <p style={{ margin: '8px 0', fontSize: '12px' }}>No orders placed yet!</p>
            </div>
          ) : (
            <div className="orders-list-scrollable">
              {orders.map((order, idx) => (
                <div className="order-card" key={order.id || idx} style={{ border: '1px solid #f0f0f0', borderRadius: '6px', padding: '10px', marginBottom: '8px', background: '#fafafa' }}>
                  <div className="order-header" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#666', marginBottom: '6px', borderBottom: '1px solid #f0f0f0', paddingBottom: '4px' }}>
                    <span>Order ID: #{order.id}</span>
                    <span className="order-status" style={{ fontWeight: '600', color: order.status.includes('Cancelled') ? '#d32f2f' : '#2e7d32' }}>{order.status}</span>
                  </div>
                  <div style={{ marginBottom: '6px' }}>
                    {order.items.map((item, itemIdx) => (
                      <div className="order-product" key={itemIdx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#333', marginBottom: '2px' }}>
                        <span>{item.title} ({item.size}) &times; {item.quantity}</span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '700', borderTop: '1px dotted #e0e0e0', paddingTop: '6px' }}>
                    <span>Total Paid (COD):</span>
                    <span>₹{order.total}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Slot 3: Bottom Banner Ad */}
        <AdSlot 
          styleType="banner"
          id="account-bottom-ad"
          adSlots={adSlots}
          title="Join Premium Membership"
          subtitle="Get flat 15% off and early access to drops."
          btnText="Subscribe Now"
        />

        {/* Portal Access */}
        <div className="account-section-card admin-link-card">
          <h3 className="section-card-title">Administrative Portal</h3>
          <p style={{ fontSize: '11px', color: '#666', marginBottom: '12px', lineHeight: '1.4' }}>
            Are you a store manager or administrator? Log in to manage products, categories, and client orders.
          </p>
          <button className="admin-portal-btn" onClick={onNavigateAdmin}>
            Access Admin Panel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
