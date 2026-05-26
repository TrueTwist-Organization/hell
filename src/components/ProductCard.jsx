import React from 'react';

const ProductCard = ({ product, onProductClick, isWishlisted, onToggleWishlist, onAddToCart }) => {
  const handleWishlistClick = (e) => {
    e.stopPropagation();
    onToggleWishlist(product);
  };

  const handleAddToCartClick = (e) => {
    e.stopPropagation();
    onAddToCart(product);
  };

  return (
    <div className="product-card" onClick={() => onProductClick(product)}>
      <button 
        className={`product-card__wishlist-btn ${isWishlisted ? 'active' : ''}`}
        onClick={handleWishlistClick}
        aria-label="Toggle Wishlist"
      >
        <svg viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </button>

      <div className="product-card__image">
        <img src={product.image} alt={product.title.split(' ')[0]} />
      </div>
      <div className="product-card__info">
        <div className="product-card__title">{product.title}</div>
        <div className="product-card__price-row">
          <span className="price-current">₹{product.currentPrice}</span>
          <span className="price-old">₹{product.oldPrice}</span>
          <span className="price-discount">{product.discount} off</span>
        </div>
        <div className="product-card__special">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><text x="12" y="16" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fff">₹</text></svg>
          ₹{product.specialPrice} with 2 Special Offers
        </div>
        <div className="product-card__delivery">Free Delivery</div>
        <div className="product-card__rating">
          <div className="rating-badge">{product.rating} ★</div>
          <div className="rating-count">({product.reviews})</div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
