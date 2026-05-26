import React from 'react';

const AdSlot = ({ 
  styleType = 'banner', // 'banner' or 'card'
  id = 'ad-slot-default',
  adSlots = [],
  image = '',
  title = 'Featured Brand Promotion',
  subtitle = 'Discover premium luxury items at flat 20% off.',
  btnText = 'Explore Now',
  tag = 'Sponsored',
  onClick
}) => {
  // Find matching custom ad slot
  const customSlot = Array.isArray(adSlots) ? adSlots.find(s => s.id === id) : null;

  // If no custom configuration exists, return null to remove the slot from the site
  if (!customSlot) {
    return null;
  }

  // If matching slot is set to 'code' type, inject raw HTML/Script code directly
  if (customSlot && customSlot.type === 'code') {
    return (
      <div 
        className={styleType === 'card' ? "infeed-ad-wrapper" : "global-ad-banner-script"}
        dangerouslySetInnerHTML={{ __html: customSlot.code }} 
        style={styleType === 'card' 
          ? { gridColumn: 'span 2', padding: '10px 0', width: '100%' } 
          : { width: '100%', padding: '0 16px 16px 16px', overflow: 'hidden', textAlign: 'center', background: '#fff' }
        }
      />
    );
  }

  // Fallbacks: Use custom slot visual attributes if available, otherwise props
  const activeTitle = customSlot?.title || title;
  const activeSubtitle = customSlot?.subtitle || subtitle;
  const activeBtnText = customSlot?.btnText || btnText;
  const activeImage = customSlot?.image || image;
  const activeStyleType = customSlot?.styleType || styleType;

  const handleClick = (e) => {
    e.preventDefault();
    if (onClick) {
      onClick();
    } else {
      alert('Redirecting to advertising partner website...');
    }
  };

  const bgStyle = activeImage 
    ? { backgroundImage: `url(${activeImage})` }
    : activeStyleType === 'banner'
      ? { background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }
      : { background: 'linear-gradient(135deg, #475569 0%, #1e293b 100%)' };

  if (activeStyleType === 'card') {
    return (
      <div className="ad-slot-card" id={id} style={bgStyle} onClick={handleClick}>
        <div className="ad-badge-tag">{tag}</div>
        <div className="ad-card-content">
          <div className="ad-card-subtitle">EXCLUSIVE PARTNER</div>
          <h4 className="ad-card-title">{activeTitle}</h4>
          <p className="ad-card-desc">{activeSubtitle}</p>
          <button className="ad-card-btn">{activeBtnText}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="ad-slot-banner" id={id} style={bgStyle} onClick={handleClick}>
      <div className="ad-badge-tag">{tag}</div>
      <div className="ad-banner-overlay"></div>
      <div className="ad-banner-body">
        <div className="ad-banner-brand">HELL SPONSOR</div>
        <h3 className="ad-banner-title">{activeTitle}</h3>
        <p className="ad-banner-desc">{activeSubtitle}</p>
        <button className="ad-banner-btn">{activeBtnText}</button>
      </div>
    </div>
  );
};

export default AdSlot;
