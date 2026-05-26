import React, { useEffect } from 'react';

const Sidebar = ({ isOpen, toggleNav, onOpenModal, onResetFilters }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  const handleLinkClick = (action) => {
    toggleNav();
    if (action === 'home') {
      onResetFilters();
      // Scroll mobile-shell container to top if possible
      const shell = document.querySelector('.mobile-shell');
      if (shell) {
        shell.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (action === 'categories') {
      onResetFilters();
      setTimeout(() => {
        const el = document.querySelector('.categories');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      onOpenModal(action);
    }
  };

  return (
    <>
      <div 
        id="mobileOverlay" 
        className={`mobile-overlay ${isOpen ? 'active' : ''}`}
        onClick={toggleNav}
      ></div>
      <nav id="mobileNav" className={`mobile-nav ${isOpen ? 'active' : ''}`}>
        <div className="mobile-nav__header">
          <h3>Menu</h3>
          <button id="closeNav" onClick={toggleNav}>&times;</button>
        </div>
        <ul className="mobile-nav__links">
          <li>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); handleLinkClick('home'); }}
            >
              Home
            </a>
          </li>
          <li>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); handleLinkClick('categories'); }}
            >
              Categories
            </a>
          </li>
          <li>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); handleLinkClick('offers'); }}
            >
              Offers
            </a>
          </li>
          <li>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); handleLinkClick('orders'); }}
            >
              My Orders
            </a>
          </li>
          <li>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); handleLinkClick('account'); }}
            >
              Account
            </a>
          </li>
          <li>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); handleLinkClick('admin'); }}
              style={{ color: '#ad1457', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <span>🛡️</span> Admin Panel
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Sidebar;
