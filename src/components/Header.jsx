import React from 'react';

const Header = ({ 
  toggleNav, 
  cartCount, 
  wishlistCount, 
  onOpenModal, 
  onSearch, 
  searchQuery, 
  onReset 
}) => {
  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="header-container" id="header">
      <header className="header">
        <button id="openNav" className="header__hamburger" onClick={toggleNav}>
          <span></span><span></span><span></span>
        </button>
        <button type="button" className="header__logo" onClick={onReset} aria-label="style4cloth — Home">
          <img src="/logo.png" alt="style4cloth" className="header__logo-img" />
        </button>
        <div className="header__actions">
          <button className="header__btn" onClick={() => onOpenModal('wishlist')} title="Wishlist">
            <svg className="icon-heart" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
          </button>
          <button className="header__btn" onClick={() => onOpenModal('cart')} title="Cart">
            <svg className="icon-cart" viewBox="0 0 24 24">
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0 0 20 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </button>
        </div>
      </header>
      <div className="search-wrapper">
        <form className="search-form" onSubmit={handleSearchSubmit}>
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input 
            type="text" 
            placeholder="Search for Sarees, Kurtis, Cosmetics, etc." 
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
          />
          {searchQuery && (
            <button 
              type="button" 
              onClick={() => onSearch('')} 
              style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '14px', color: '#999', padding: '0 4px' }}
            >
              &times;
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Header;
