import React from 'react';

const HeroBanner = ({ onShopNow }) => {
  return (
    <div className="hero-custom">
      <div className="hero-left">
        <div className="hero-outer-green">
          <div className="hero-inner-orange">
            <div className="hero-image-box">
              <img src="/Image/Image/trendy-Shirts/1.webp" alt="Oversized Shirt" />
            </div>
          </div>
        </div>
      </div>
      <div className="hero-right">
        <h3>Casual White Linen<br/>Oversized Shirt</h3>
        <p>Organic Breathable Linen Summer Essential</p>
        <button onClick={onShopNow}>Shop Now</button>
      </div>
    </div>
  );
};

export default HeroBanner;
