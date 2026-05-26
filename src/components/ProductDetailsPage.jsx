import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import AdSlot from './AdSlot';

const ProductDetailsPage = ({ 
  product, 
  onAddToCart, 
  onBuyNow, 
  wishlist, 
  onToggleWishlist, 
  onProductClick, 
  onBack,
  products = [], // Dynamic products list passed from state
  adSlots = []
}) => {
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [selectedSize, setSelectedSize] = useState('M');

  // Sync selectedImage when product changes
  useEffect(() => {
    setSelectedImage(product.image);
    setSelectedSize('M');
    // Scroll mobile shell or page to top
    const container = document.querySelector('.mobile-shell');
    if (container) {
      container.scrollTop = 0;
    } else {
      window.scrollTo(0, 0);
    }
  }, [product]);

  if (!product) return null;

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const isWishlisted = wishlist.includes(product.id);

  // Filter products in same category (excluding current)
  const sameCategoryProducts = products.filter(
    p => p.category === product.category && p.id !== product.id
  );

  // Filter products in other categories (excluding current)
  const otherCategoryProducts = products.filter(
    p => p.category !== product.category && p.id !== product.id
  );

  // Combine and slice to exactly 6 recommendations
  const similarProducts = [...sameCategoryProducts, ...otherCategoryProducts].slice(0, 6);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: product.description,
        url: window.location.href,
      }).catch(err => console.log(err));
    } else {
      // Fallback
      alert(`Link Copied: ${window.location.href}`);
    }
  };

  return (
    <div className="details-page-wrapper">
      {/* Back Header Nav */}
      <div className="details-back-nav">
        <button className="details-back-btn" onClick={onBack} aria-label="Go Back">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          <span>Back to Shop</span>
        </button>
        <span className="details-nav-title">{product.category}</span>
      </div>

      {/* 1. Top Banner: Fashion Ad Slot */}
      <AdSlot 
        styleType="banner" 
        id="details-top-ad"
        adSlots={adSlots}
      />

      {/* 2. Interactive Image Gallery */}
      <div className="details-gallery-container">
        <div className="details-gallery-main">
          <img src={selectedImage} alt={product.title} />
        </div>
        {product.thumbnails && product.thumbnails.length > 0 && (
          <div className="details-gallery-thumbnails">
            {product.thumbnails.map((thumb, idx) => (
              <div 
                key={idx} 
                className={`thumbnail-box ${selectedImage === thumb ? 'active' : ''}`}
                onClick={() => setSelectedImage(thumb)}
              >
                <img src={thumb} alt={`Thumbnail ${idx + 1}`} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Product Info */}
      <div className="details-meta-card">
        <div className="details-category-pill">{product.category.toUpperCase()}</div>
        <div className="details-title-row">
          <h1 className="details-title-heading">{product.title}</h1>
          <div className="details-title-actions">
            <button 
              className={`details-wishlist-toggle ${isWishlisted ? 'active' : ''}`} 
              onClick={() => onToggleWishlist(product)}
              aria-label="Toggle Wishlist"
            >
              <svg viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </button>
            <button className="details-share-toggle" onClick={handleShare} aria-label="Share Product">
              <svg viewBox="0 0 24 24">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Pricing */}
        <div className="details-pricing-row">
          <span className="price-current">₹{product.currentPrice}</span>
          <span className="price-old">₹{product.oldPrice}</span>
          <span className="price-discount">{product.discount} off</span>
        </div>

        {/* Special Offer Badge */}
        <div className="details-special-badge">
          <span className="badge-tag">Special Price</span>
          <span className="badge-desc">Get at flat ₹{product.specialPrice} with promo code HELL10</span>
        </div>
      </div>

      {/* 4. Middle Banner: Leather Goods Ad Slot */}
      <AdSlot 
        styleType="banner" 
        id="details-middle-ad"
        adSlots={adSlots}
      />

      {/* 5. Description */}
      <div className="details-section-card">
        <h3 className="section-card-title">Product Description</h3>
        <p className="section-card-body">
          {product.description || "This premium outfit features a beautiful color palette, clean stitching details, and exceptional fabric suitable for Indian weather. Perfect for styling on multiple occasions."}
        </p>
      </div>

      {/* 6. Size Selector */}
      <div className="details-section-card">
        <h3 className="section-card-title">Select Size</h3>
        <div className="size-buttons-grid">
          {sizes.map(size => (
            <button 
              key={size}
              className={`size-btn-pill ${selectedSize === size ? 'active' : ''}`}
              onClick={() => setSelectedSize(size)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* 7. Bottom Banner: Urban Streetwear Ad Slot */}
      <AdSlot 
        styleType="banner" 
        id="details-bottom-ad"
        adSlots={adSlots}
      />

      {/* 8. Action Buttons (Side by Side) */}
      <div className="details-fixed-actions">
        <button 
          className="btn-add-cart"
          onClick={() => onAddToCart(product, selectedSize)}
        >
          Add to Cart
        </button>
        <button 
          className="btn-buy-now"
          onClick={() => onBuyNow(product, selectedSize)}
        >
          Buy Now
        </button>
      </div>

      {/* 9. Ratings & Reviews Section */}
      <div className="details-section-card reviews-breakdown-card">
        <h3 className="section-card-title">Product Ratings & Reviews</h3>
        <div className="reviews-summary-block">
          <div className="summary-score-box">
            <span className="score-num">{product.rating}</span>
            <span className="score-star">★</span>
            <span className="score-total-reviews">{product.reviews} Ratings</span>
          </div>
          <div className="rating-bars-box">
            <div className="rating-bar-row">
              <span className="bar-label">5 ★</span>
              <div className="bar-outer"><div className="bar-inner" style={{ width: '70%' }}></div></div>
              <span className="bar-percent">70%</span>
            </div>
            <div className="rating-bar-row">
              <span className="bar-label">4 ★</span>
              <div className="bar-outer"><div className="bar-inner" style={{ width: '18%' }}></div></div>
              <span className="bar-percent">18%</span>
            </div>
            <div className="rating-bar-row">
              <span className="bar-label">3 ★</span>
              <div className="bar-outer"><div className="bar-inner" style={{ width: '8%' }}></div></div>
              <span className="bar-percent">8%</span>
            </div>
            <div className="rating-bar-row">
              <span className="bar-label">2 ★</span>
              <div className="bar-outer"><div className="bar-inner" style={{ width: '3%' }}></div></div>
              <span className="bar-percent">3%</span>
            </div>
            <div className="rating-bar-row">
              <span className="bar-label">1 ★</span>
              <div className="bar-outer"><div className="bar-inner" style={{ width: '1%' }}></div></div>
              <span className="bar-percent">1%</span>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        {product.reviewsList && product.reviewsList.length > 0 && (
          <div className="reviews-list-block">
            {product.reviewsList.map((review, idx) => (
              <div key={idx} className="review-item-card">
                <div className="review-item-top">
                  <span className="review-item-stars">{review.rating} ★</span>
                  <span className="review-item-name">{review.name}</span>
                  {review.verified && <span className="review-item-verified">✓ Verified Buyer</span>}
                </div>
                <div className="review-item-date">{review.date}</div>
                <p className="review-item-comment">{review.comment}</p>
                {review.image && (
                  <div className="review-item-photo">
                    <img src={review.image} alt="User Review Attachment" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 10. Trust Badges */}
      <div className="trust-badges-card">
        <div className="trust-badge-item">
          <div className="badge-icon-box">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="#2e7d32" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
          </div>
          <div className="badge-label">Cash on Delivery</div>
        </div>
        <div className="trust-badge-item">
          <div className="badge-icon-box">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="#2e7d32" d="M19 8l-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z"/>
            </svg>
          </div>
          <div className="badge-label">7 Days Returns</div>
        </div>
        <div className="trust-badge-item">
          <div className="badge-icon-box">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="#2e7d32" d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM18 17H17V12h4v2.5l-3 2.5z"/>
            </svg>
          </div>
          <div className="badge-label">Free Delivery</div>
        </div>
      </div>

      {/* 11. Similar Products Recommendations Grid */}
      {similarProducts.length > 0 && (
        <div className="similar-products-card">
          <h2 className="section-title">SIMILAR PRODUCTS</h2>
          <div className="product-grid">
            {similarProducts.map((p, idx) => (
              <React.Fragment key={p.id}>
                <ProductCard 
                  product={p}
                  onProductClick={onProductClick}
                  isWishlisted={wishlist.includes(p.id)}
                  onToggleWishlist={onToggleWishlist}
                  onAddToCart={(prod) => onAddToCart(prod, 'M')}
                />
                {adSlots?.find(s => s.id === 'every-two-products') ? (
                  (idx + 1) % 2 === 0 && (
                    <AdSlot 
                      styleType="card"
                      id="every-two-products"
                      adSlots={adSlots}
                    />
                  )
                ) : (
                  adSlots?.some(s => s.id === 'similar-infeed-ad') && idx === 1 && (
                    <AdSlot 
                      styleType="card" 
                      id="similar-infeed-ad"
                      adSlots={adSlots}
                    />
                  )
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailsPage;
