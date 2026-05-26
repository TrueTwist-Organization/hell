import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Categories from './components/Categories';
import HeroBanner from './components/HeroBanner';
import ProductList from './components/ProductList';
import { products as allProducts } from './data/products';
import { defaultCategories } from './data/categories';
import Footer from './components/Footer';
import ProductDetailsPage from './components/ProductDetailsPage';
import AccountPage from './components/AccountPage';
import AdminPanel from './components/AdminPanel';
import AdSlot from './components/AdSlot';
import CheckoutPage from './components/CheckoutPage';
import { 
  CartDrawer, 
  WishlistDrawer, 
  OffersModal, 
  MyOrdersModal, 
  AccountModal, 
  TextModal 
} from './components/Modals';

// Mock policy texts
const POLICY_TEXTS = {
  about: "About Us\n\nWelcome to style4cloth, your premium destination for high-quality Indian dresses, corset-style tops, elegant ethnic wear, and combo outfits.\n\nEstablished in 2026, we strive to bring the finest fashion directly to your doorstep. We work with talented local artisans and modern design houses to provide high-quality, boutique-friendly collections that celebrate traditional artistry combined with contemporary aesthetics.\n\nOur mission is to make fashionable, premium-quality apparel accessible to everyone, backed by exceptional customer support and hassle-free shopping.",
  contact: "Contact Us\n\nWe would love to hear from you! For any questions, order support, or business inquiries, reach out to us:\n\n✉ Email: contact@style4cloth.com\n📞 Phone: +91 98765 43210 (Mon-Sat, 10 AM - 6 PM)\n🏢 Address: style4cloth, 45, Rajouri Garden, New Delhi, 110027",
  faqs: "Frequently Asked Questions (FAQs)\n\nQ: Is delivery really free?\nA: Yes! We offer free shipping across India for all products.\n\nQ: What payment options do you support?\nA: Currently, we support Cash on Delivery (COD) for all orders.\n\nQ: How long does shipping take?\nA: Delivery typically takes 3-7 business days depending on your location.\n\nQ: Can I return or exchange my item?\nA: Yes, we offer a 7-day hassle-free return and exchange policy. Check our Return & Refund Policy for details.",
  terms: "Terms & Conditions\n\nBy accessing and browsing style4cloth, you agree to comply with our terms. All website content, logos, design templates, and images are copyrighted assets of style4cloth.\n\nWe reserve the right to modify prices, descriptions, and promotional offers at any time without prior notice. Abuse of coupon codes or fraudulent checkout activity may lead to order cancellation.",
  privacy: "Privacy Policy\n\nAt style4cloth, we respect your privacy. We collect basic information like name, email, phone number, and shipping address solely to process your orders and improve your shopping experience.\n\nWe never sell, rent, or share your personal data with third parties. All transactions and communication are secured under standard industry encryption.",
  cookies: "Cookie Policy\n\nOur website uses cookies to enhance your browsing experience, remember items in your cart, and compile analytics on web traffic.\n\nBy using style4cloth, you consent to our use of cookies. You can disable cookies in your browser settings at any time, but some store features may not function properly.",
  returns: "Return & Refund Policy\n\nWe offer a 7-day return policy. If you are not satisfied with your purchase, you can request a return or exchange within 7 days of receiving the package.\n\nConditions:\n- Item must be unworn, unwashed, and in its original packaging with tags intact.\n- Refunds will be processed to your bank account after product quality checks are completed (takes 5-7 business days).",
  disclosure: "Disclosure Policy\n\nWe operate with complete transparency. Any sponsored posts, affiliate collaborations, or reviews on this site will be clearly disclosed to our customers.\n\nOur primary recommendation remains high-quality products directly manufactured or sourced by style4cloth.",
  disclaimer: "Disclaimer\n\nAll product representations (color, texture, fit) on our site are displayed as accurately as possible. However, slight variations may occur due to screen lighting and digital image processing.\n\nPrices listed are promotional and subject to change based on stock availability and campaign duration."
};

function App() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('hell_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('hell_wishlist');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });
  const [currentView, setCurrentView] = useState('home'); // 'home', 'product-details', 'account', 'admin'
  const [productsList, setProductsList] = useState(() => {
    const saved = localStorage.getItem('hell_products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return allProducts;
  });

  const [adSlots, setAdSlots] = useState(() => {
    const saved = localStorage.getItem('hell_ad_slots_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const [categoriesList, setCategoriesList] = useState(() => {
    const saved = localStorage.getItem('hell_categories');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return defaultCategories;
  });
  
  // Filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Modal states
  const [activeModal, setActiveModal] = useState(null); // 'cart', 'wishlist', 'offers', 'orders', 'account', 'text'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [textModalTitle, setTextModalTitle] = useState('');
  const [textModalContent, setTextModalContent] = useState('');

  // User Profile
  const [profile, setProfile] = useState({
    name: 'Guest User',
    email: 'guest@hell.com',
    address: '123 Fashion Lane, Mumbai, Maharashtra - 400001'
  });

  // Coupon Discount
  const [appliedDiscount, setAppliedDiscount] = useState(null);

  // Orders
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('hell_orders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: "99824",
        status: "Delivered",
        items: [{ title: "Red & White Gingham Co-ord Set", size: "M", quantity: 1, price: 149 }],
        total: 149,
        address: "123 Fashion Lane, Mumbai, Maharashtra - 400001"
      }
    ];
  });

  // Toast message
  const [toast, setToast] = useState('');

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => {
      setToast((prev) => prev === message ? '' : prev);
    }, 2000);
  };

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  React.useEffect(() => {
    const handleUrlQuery = () => {
      const path = window.location.pathname;
      const params = new URLSearchParams(window.location.search);
      const buyNowId = params.get('buy_now');
      if (buyNowId) {
        const productId = parseInt(buyNowId, 10);
        let product = productsList.find(p => p.id === productId);
        // Fallback mapping for Suchtuk demo IDs:
        if (!product) {
          if (buyNowId === '1') product = productsList.find(p => p.id === 99); // Women's White Floral Kurti
          if (buyNowId === '2') product = productsList.find(p => p.id === 202); // Red & White Gingham Set
        }
        if (product) {
          setCart((prevCart) => {
            const alreadyInCart = prevCart.some(item => item.product.id === product.id);
            if (!alreadyInCart) {
              return [...prevCart, { id: `${product.id}-M-${Date.now()}`, product, quantity: 1, size: 'M' }];
            }
            return prevCart;
          });
          setCurrentView('checkout');
        }
      } else if (path.includes('cart.php') || path.includes('checkout.php')) {
        setCurrentView('checkout');
      } else if (path.includes('admin') || path.includes('admin.php')) {
        setCurrentView('admin');
      }
    };

    handleUrlQuery();
    window.addEventListener('popstate', handleUrlQuery);
    return () => window.removeEventListener('popstate', handleUrlQuery);
  }, [productsList]);

  // Keep cart items in sync with updated productsList details
  React.useEffect(() => {
    setCart((prevCart) => 
      prevCart.map(item => {
        const freshProduct = productsList.find(p => p.id === item.product.id);
        if (freshProduct) {
          return { ...item, product: freshProduct };
        }
        return item;
      })
    );
  }, [productsList]);

  // Persist productsList changes to localStorage
  React.useEffect(() => {
    localStorage.setItem('hell_products', JSON.stringify(productsList));
  }, [productsList]);

  // Persist cart changes to localStorage
  React.useEffect(() => {
    localStorage.setItem('hell_cart', JSON.stringify(cart));
  }, [cart]);

  // Persist wishlist changes to localStorage
  React.useEffect(() => {
    localStorage.setItem('hell_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Persist orders changes to localStorage
  React.useEffect(() => {
    localStorage.setItem('hell_orders', JSON.stringify(orders));
  }, [orders]);

  // Persist adSlots changes to localStorage
  React.useEffect(() => {
    localStorage.setItem('hell_ad_slots_v3', JSON.stringify(adSlots));
  }, [adSlots]);

  React.useEffect(() => {
    localStorage.setItem('hell_categories', JSON.stringify(categoriesList));
  }, [categoriesList]);

  React.useEffect(() => {
    if (selectedCategory && !categoriesList.some((c) => c.id === selectedCategory)) {
      setSelectedCategory(null);
    }
  }, [categoriesList, selectedCategory]);

  const handleOpenModal = (modalName) => {
    if (modalName === 'cart') {
      setCurrentView('checkout');
      setActiveModal(null);
      setIsNavOpen(false);
      const container = document.querySelector('.mobile-shell');
      if (container) {
        container.scrollTop = 0;
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (modalName === 'account') {
      setCurrentView('account');
      setActiveModal(null);
      setIsNavOpen(false);
      // Scroll to top of mobile shell
      const container = document.querySelector('.mobile-shell');
      if (container) {
        container.scrollTop = 0;
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (modalName === 'orders') {
      setCurrentView('account');
      setActiveModal(null);
      setIsNavOpen(false);
      setTimeout(() => {
        const el = document.querySelector('.orders-list-scrollable') || document.querySelector('.account-card-container');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else if (modalName === 'admin') {
      window.history.pushState({}, '', '/admin.php');
      setCurrentView('admin');
      setActiveModal(null);
      setIsNavOpen(false);
      const container = document.querySelector('.mobile-shell');
      if (container) {
        container.scrollTop = 0;
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      setActiveModal(modalName);
      setIsNavOpen(false);
    }
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  // Cart operations
  const handleAddToCartWithSize = (product, size) => {
    // Navigate using browser history so that the URL contains the buy_now param exactly like Suchtuk
    window.history.pushState({}, '', `/cart.php?buy_now=${product.id}`);

    setCart((prevCart) => {
      // Check if item already in cart with same size
      const existingIdx = prevCart.findIndex(item => item.product.id === product.id && item.size === size);
      if (existingIdx > -1) {
        const newCart = [...prevCart];
        newCart[existingIdx].quantity += 1;
        return newCart;
      } else {
        return [...prevCart, { id: `${product.id}-${size}-${Date.now()}`, product, quantity: 1, size }];
      }
    });

    setCurrentView('checkout');
    showToast(`Added ${product.title.split(' ')[0]} (${size}) to Cart! 🛒`);
  };

  const handleAddToCartDefault = (product) => {
    handleAddToCartWithSize(product, 'M');
  };

  const handleAddToCartFromWishlist = (product) => {
    handleAddToCartWithSize(product, 'M');
    showToast(`Moved ${product.title.split(' ')[0]} to Cart!`);
  };

  const handleBuyNow = (product, size) => {
    // Add to cart and redirect to checkout page
    handleAddToCartWithSize(product, size);
    setCurrentView('checkout');
    
    // Scroll both container and window to top instantly
    const container = document.querySelector('.mobile-shell');
    if (container) {
      container.scrollTop = 0;
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handleUpdateCartQty = (id, newQty) => {
    if (newQty <= 0) {
      handleRemoveCartItem(id);
    } else {
      setCart((prevCart) => prevCart.map(item => item.id === id ? { ...item, quantity: newQty } : item));
    }
  };

  const handleRemoveCartItem = (id) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== id));
    showToast("Removed item from cart.");
  };

  const handleApplyDiscount = (coupon) => {
    if (!coupon) {
      setAppliedDiscount(null);
      return { success: true, message: 'Coupon removed.' };
    }
    
    // Check code validity
    if (coupon.code === 'HELL10' || coupon.code === 'WELCOME50' || coupon.code === 'FREE2') {
      setAppliedDiscount(coupon);
      return { success: true, message: `Coupon applied: ${coupon.label}` };
    }
    
    // For raw input strings
    if (typeof coupon === 'string') {
      const code = coupon.toUpperCase();
      if (code === 'HELL10') {
        const disc = { code: 'HELL10', label: '10% off', type: 'percentage', value: 10 };
        setAppliedDiscount(disc);
        return { success: true, message: '10% discount applied!' };
      } else if (code === 'WELCOME50') {
        const disc = { code: 'WELCOME50', label: '₹50 off', type: 'flat', value: 50 };
        setAppliedDiscount(disc);
        return { success: true, message: '₹50 discount applied!' };
      } else if (code === 'FREE2') {
        const disc = { code: 'FREE2', label: 'Buy 2 Get 2 Free', type: 'percentage', value: 20 };
        setAppliedDiscount(disc);
        return { success: true, message: 'Buy 2 Get 2 Free coupon applied!' };
      }
    }

    return { success: false, message: 'Invalid promo code!' };
  };

  // Wishlist operations
  const handleToggleWishlist = (product) => {
    setWishlist((prevWishlist) => {
      if (prevWishlist.includes(product.id)) {
        showToast("Removed from Wishlist ❤️");
        return prevWishlist.filter(id => id !== product.id);
      } else {
        showToast("Added to Wishlist! ❤️");
        return [...prevWishlist, product.id];
      }
    });
  };

  const handleToggleWishlistId = (productId) => {
    setWishlist((prevWishlist) => prevWishlist.filter(id => id !== productId));
    showToast("Removed from Wishlist ❤️");
  };

  // Profile operations
  const handleSaveProfile = (newProfile) => {
    setProfile(newProfile);
    showToast("Profile details updated! 💾");
  };

  // Checkout operation
  const handleCheckout = (customAddress, customPaymentMethod) => {
    if (cart.length === 0) return;
    
    // Calculate total paid
    const subtotal = cart.reduce((sum, item) => sum + (item.product.currentPrice * item.quantity), 0);
    let discountAmount = 0;
    if (appliedDiscount) {
      if (appliedDiscount.type === 'percentage') {
        discountAmount = Math.round(subtotal * (appliedDiscount.value / 100));
      } else if (appliedDiscount.type === 'flat') {
        discountAmount = Math.min(appliedDiscount.value, subtotal);
      }
    }
    const total = Math.max(0, subtotal - discountAmount);

    const generatedOrderId = Math.floor(10000 + Math.random() * 90000).toString();
    const newOrder = {
      id: generatedOrderId,
      status: "Placed (Processing)",
      items: cart.map(item => ({
        title: item.product.title,
        size: item.size,
        quantity: item.quantity,
        price: item.product.currentPrice
      })),
      total: total,
      address: customAddress || profile.address,
      paymentMethod: customPaymentMethod || "Cash on Delivery"
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    setAppliedDiscount(null);
    showToast(`Order placed successfully! 🎉 Payment method: ${newOrder.paymentMethod}`);
    return generatedOrderId;
  };

  // Hero product details click
  const handleShopNow = () => {
    const heroProduct = productsList.find(p => p.id === 501);
    if (heroProduct) {
      setSelectedProduct(heroProduct);
      setCurrentView('product-details');
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  };

  // Click on product card
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setCurrentView('product-details');
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  // Filter resetting
  const handleResetFilters = () => {
    window.history.pushState({}, '', '/');
    setSearchQuery('');
    setSelectedCategory(null);
    setCurrentView('home');
    showToast("Filters cleared.");
  };

  // Policy modal trigger
  const handleOpenPolicy = (type) => {
    if (POLICY_TEXTS[type]) {
      const titles = {
        about: "About Us",
        contact: "Contact Us",
        faqs: "FAQs",
        terms: "Terms & Conditions",
        privacy: "Privacy Policy",
        cookies: "Cookie Policy",
        returns: "Return & Refund Policy",
        disclosure: "Disclosure Policy",
        disclaimer: "Disclaimer"
      };
      setTextModalTitle(titles[type] || "Information");
      setTextModalContent(POLICY_TEXTS[type]);
      setActiveModal('text');
    }
  };

  return (
    <div className="mobile-shell">
      {adSlots?.find(s => s.id === 'global-banner') && (
        <AdSlot 
          id="global-banner"
          adSlots={adSlots}
          styleType="banner"
        />
      )}
      <Sidebar 
        isOpen={isNavOpen} 
        toggleNav={toggleNav} 
        onOpenModal={handleOpenModal} 
        onResetFilters={handleResetFilters} 
      />
      <Header 
        toggleNav={toggleNav} 
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlist.length}
        onOpenModal={handleOpenModal}
        onSearch={(q) => { setSearchQuery(q); setCurrentView('home'); }}
        searchQuery={searchQuery}
        onReset={handleResetFilters}
      />

      {currentView === 'product-details' ? (
        <ProductDetailsPage 
          product={productsList.find(p => p.id === selectedProduct?.id) || selectedProduct}
          onAddToCart={handleAddToCartWithSize}
          onBuyNow={handleBuyNow}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
          onProductClick={handleProductClick}
          onBack={() => {
            window.history.pushState({}, '', '/');
            setCurrentView('home');
          }}
          products={productsList}
          adSlots={adSlots}
        />
      ) : currentView === 'checkout' ? (
        <CheckoutPage 
          cart={cart}
          onUpdateQty={handleUpdateCartQty}
          onRemove={handleRemoveCartItem}
          appliedDiscount={appliedDiscount}
          onApplyDiscount={handleApplyDiscount}
          profile={profile}
          onCheckout={handleCheckout}
          onOpenModal={handleOpenModal}
          onBack={() => {
            window.history.pushState({}, '', '/');
            setCurrentView('home');
          }}
        />
      ) : currentView === 'account' ? (
        <AccountPage 
          profile={profile}
          onSaveProfile={handleSaveProfile}
          orders={orders}
          onBack={() => {
            window.history.pushState({}, '', '/');
            setCurrentView('home');
          }}
          onNavigateAdmin={() => {
            window.history.pushState({}, '', '/admin.php');
            setCurrentView('admin');
          }}
          adSlots={adSlots}
        />
      ) : currentView === 'admin' ? (
        <AdminPanel 
          productsList={productsList}
          setProductsList={setProductsList}
          categoriesList={categoriesList}
          setCategoriesList={setCategoriesList}
          orders={orders}
          setOrders={setOrders}
          adSlots={adSlots}
          setAdSlots={setAdSlots}
          onBack={() => {
            window.history.pushState({}, '', '/');
            setCurrentView('home');
          }}
        />
      ) : (
        <>
          <Categories 
            categories={categoriesList}
            selectedCategory={selectedCategory} 
            setSelectedCategory={(cat) => {
              window.history.pushState({}, '', '/');
              setSelectedCategory(cat);
              setCurrentView('home');
            }} 
          />
          <HeroBanner 
            onShopNow={handleShopNow} 
          />
          
          <div className="ticker" onClick={() => handleOpenModal('offers')} style={{ cursor: 'pointer' }}>
            <div className="ticker-content">
              🔥 Buy 2 Get 2 Free (Add 4 items to cart) &nbsp;&bull;&nbsp; Use Coupon: <strong>FREE2</strong> &nbsp;&bull;&nbsp; Free Shipping All Over India &nbsp;&bull;&nbsp; Cash on Delivery Available &nbsp;&bull;&nbsp; 🔥 Buy 2 Get 2 Free (Add 4 items to cart) &nbsp;&bull;&nbsp; Use Coupon: <strong>FREE2</strong> &nbsp;&bull;&nbsp; Free Shipping All Over India &nbsp;&bull;&nbsp; Cash on Delivery Available &nbsp;&bull;&nbsp;
            </div>
          </div>
 
          <AdSlot 
            id="home-middle-ad"
            adSlots={adSlots}
            styleType="banner"
            title="Exclusive Summer Sale"
            subtitle="Explore premium luxury items at flat 30% off."
            btnText="Explore Now"
          />
 
          <ProductList 
            products={productsList}
            categories={categoriesList}
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
            onProductClick={handleProductClick}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCartDefault}
            onResetFilters={handleResetFilters}
            adSlots={adSlots}
          />
        </>
      )}

      <Footer 
        categories={categoriesList}
        onOpenPolicy={handleOpenPolicy} 
        onOpenModal={handleOpenModal}
        onSelectCategory={(cat) => {
          window.history.pushState({}, '', '/');
          setSelectedCategory(cat);
          setCurrentView('home');
          // Smooth scroll to top inside the mobile-shell if possible, or window
          const shell = document.querySelector('.mobile-shell');
          if (shell) {
            shell.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
      />

      {/* Popups & Modals */}
      {toast && <div className="toast-msg">{toast}</div>}

      <CartDrawer 
        isOpen={activeModal === 'cart'}
        onClose={handleCloseModal}
        cart={cart}
        onUpdateQty={handleUpdateCartQty}
        onRemove={handleRemoveCartItem}
        appliedDiscount={appliedDiscount}
        onApplyDiscount={handleApplyDiscount}
        address={profile.address}
        onCheckout={handleCheckout}
        onOpenModal={handleOpenModal}
        adSlots={adSlots}
      />

      <WishlistDrawer 
        isOpen={activeModal === 'wishlist'}
        onClose={handleCloseModal}
        wishlist={wishlist.map(id => productsList.find(p => p.id === id)).filter(Boolean)}
        onRemove={handleToggleWishlistId}
        onAddToCart={handleAddToCartFromWishlist}
      />

      <OffersModal 
        isOpen={activeModal === 'offers'}
        onClose={handleCloseModal}
        onApplyCoupon={handleApplyDiscount}
      />

      <MyOrdersModal 
        isOpen={activeModal === 'orders'}
        onClose={handleCloseModal}
        orders={orders}
      />

      <AccountModal 
        isOpen={activeModal === 'account'}
        onClose={handleCloseModal}
        profile={profile}
        onSaveProfile={handleSaveProfile}
      />

      <TextModal 
        isOpen={activeModal === 'text'}
        onClose={handleCloseModal}
        title={textModalTitle}
        content={textModalContent}
      />
    </div>
  );
}

export default App;
