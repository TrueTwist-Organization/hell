import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import AdSlot from './AdSlot';

const ProductList = ({ 
  products = [],
  categories = [],
  selectedCategory, 
  searchQuery, 
  onProductClick, 
  wishlist, 
  onToggleWishlist, 
  onAddToCart, 
  onResetFilters,
  adSlots = []
}) => {
  const PRODUCTS_PER_PAGE = 6;
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 when category or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  const filteredProducts = products.filter(product => {
    // 1. Category Filter
    if (selectedCategory && product.category !== selectedCategory) {
      return false;
    }
    // 2. Search Filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const titleMatch = product.title.toLowerCase().includes(query);
      const categoryMatch = product.category && product.category.toLowerCase().includes(query);
      if (!titleMatch && !categoryMatch) {
        return false;
      }
    }
    return true;
  });

  const homeFeaturedProducts = categories.length
    ? categories
        .flatMap((cat) => products.filter((p) => p.category === cat.id).slice(0, 2))
        .slice(0, 6)
    : products.slice(0, 6);

  const totalProducts = (!selectedCategory && !searchQuery)
    ? homeFeaturedProducts
    : filteredProducts;

  const totalPages = Math.ceil(totalProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const displayProducts = totalProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  return (
    <>
      <h2 className="section-title">
        {selectedCategory ? `${selectedCategory} Products` : 'Products For You'}
      </h2>
      {filteredProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 16px', gridColumn: 'span 2' }}>
          <p style={{ color: '#888', marginBottom: '16px', fontSize: '14px' }}>No products found</p>
          <button 
            onClick={onResetFilters}
            style={{
              background: '#0091ea',
              color: '#fff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '20px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className="product-grid">
            {displayProducts.map((product, idx) => (
              <React.Fragment key={product.id}>
                <ProductCard 
                  product={product} 
                  onProductClick={onProductClick}
                  isWishlisted={wishlist.includes(product.id)}
                  onToggleWishlist={onToggleWishlist}
                  onAddToCart={onAddToCart}
                />
                {/* Insert Sponsored Card slots at multiple positions */}
                {adSlots?.find(s => s.id === 'every-two-products') ? (
                  (idx + 1) % 2 === 0 && (
                    <AdSlot 
                      styleType="card"
                      id="every-two-products"
                      adSlots={adSlots}
                    />
                  )
                ) : (
                  <>
                    {adSlots?.some(s => s.id === 'grid-infeed-ad-1') && idx === 1 && (
                      <AdSlot 
                        styleType="card" 
                        id="grid-infeed-ad-1"
                        adSlots={adSlots}
                      />
                    )}
                    {adSlots?.some(s => s.id === 'grid-infeed-ad-2') && idx === 3 && (
                      <AdSlot 
                        styleType="card" 
                        id="grid-infeed-ad-2"
                        adSlots={adSlots}
                      />
                    )}
                  </>
                )}
              </React.Fragment>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination-container">
              <button 
                className="pagination-btn"
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage(prev => Math.max(prev - 1, 1));
                  const container = document.querySelector('.mobile-shell');
                  if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                &laquo; Prev
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button 
                  key={page}
                  className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentPage(page);
                    const container = document.querySelector('.mobile-shell');
                    if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  {page}
                </button>
              ))}

              <button 
                className="pagination-btn"
                disabled={currentPage === totalPages}
                onClick={() => {
                  setCurrentPage(prev => Math.min(prev + 1, totalPages));
                  const container = document.querySelector('.mobile-shell');
                  if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                Next &raquo;
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ProductList;
