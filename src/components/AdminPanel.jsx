import React, { useState, useEffect } from 'react';
import { normalizeCategoryId } from '../data/categories';

const AdminPanel = ({ 
  productsList, 
  setProductsList,
  categoriesList = [],
  setCategoriesList,
  orders, 
  setOrders, 
  adSlots = [],
  setAdSlots,
  onBack 
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Tab State
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'products', 'orders'

  // Product CRUD states
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showCategoryManager, setShowCategoryManager] = useState(false);

  // Category form states
  const [newCatLabel, setNewCatLabel] = useState('');
  const [newCatId, setNewCatId] = useState('');
  const [newCatImg, setNewCatImg] = useState('');
  const [categoryError, setCategoryError] = useState('');

  // Form states for product
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(categoriesList[0]?.id || '');
  const [image, setImage] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [oldPrice, setOldPrice] = useState('');
  const [description, setDescription] = useState('');

  // Ad Slot Add/Edit state variables
  const [isAddingAd, setIsAddingAd] = useState(false);
  const [editingAd, setEditingAd] = useState(null);

  // Form fields
  const [adPlacementId, setAdPlacementId] = useState('home-middle-ad');
  const [customPlacementId, setCustomPlacementId] = useState('');
  const [adName, setAdName] = useState('');
  const [adType, setAdType] = useState('code'); // 'code' or 'visual'
  const [adCode, setAdCode] = useState('');
  
  // Visual promo fields
  const [adStyleType, setAdStyleType] = useState('banner');
  const [adTitle, setAdTitle] = useState('');
  const [adSubtitle, setAdSubtitle] = useState('');
  const [adBtnText, setAdBtnText] = useState('');
  const [adImage, setAdImage] = useState('');

  const PREDEFINED_PLACEMENTS = [
    { id: 'global-banner', name: 'Global Banner (Top of sitewide header)' },
    { id: 'every-two-products', name: 'In-feed Grid Ad (Renders after every 2 products)' },
    { id: 'home-middle-ad', name: 'Homepage Middle Banner' },
    { id: 'details-top-ad', name: 'Product Details Top Banner' },
    { id: 'details-middle-ad', name: 'Product Details Middle Banner' },
    { id: 'details-bottom-ad', name: 'Product Details Bottom Banner' },
    { id: 'grid-infeed-ad-1', name: 'Main Category Grid In-feed Ad 1' },
    { id: 'grid-infeed-ad-2', name: 'Main Category Grid In-feed Ad 2' },
    { id: 'similar-infeed-ad', name: 'Similar Products Grid In-feed Ad' },
    { id: 'custom', name: 'Custom Placement ID...' }
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    const normalizedUser = username.trim().toLowerCase();
    if (normalizedUser === 'admin' && (password === 'Password@123' || password === 'admin' || password === 'Password')) {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid username or password!');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
    onBack();
  };

  useEffect(() => {
    if (!categoriesList.some((c) => c.id === category) && categoriesList.length > 0) {
      setCategory(categoriesList[0].id);
    }
  }, [categoriesList, category]);

  const resetCategoryForm = () => {
    setNewCatLabel('');
    setNewCatId('');
    setNewCatImg('');
    setCategoryError('');
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    const label = newCatLabel.trim();
    const id = normalizeCategoryId(newCatId.trim() || label);
    const img = newCatImg.trim() || '/Image/Image/trendy-Shirts/1.webp';

    if (!label) {
      setCategoryError('Category name is required.');
      return;
    }
    if (!id) {
      setCategoryError('Category ID is required.');
      return;
    }
    if (categoriesList.some((c) => c.id.toLowerCase() === id.toLowerCase())) {
      setCategoryError('A category with this ID already exists.');
      return;
    }

    setCategoriesList((prev) => [...prev, { id, label, img }]);
    resetCategoryForm();
  };

  const handleDeleteCategory = (catId) => {
    const productCount = productsList.filter((p) => p.category === catId).length;
    if (productCount > 0) {
      alert(`Cannot remove "${catId}" — ${productCount} product(s) still use this category. Reassign or delete those products first.`);
      return;
    }
    if (!window.confirm(`Remove category "${catId}"?`)) {
      return;
    }
    setCategoriesList((prev) => prev.filter((c) => c.id !== catId));
  };

  const resetAdForm = () => {
    setAdPlacementId('home-middle-ad');
    setCustomPlacementId('');
    setAdName('');
    setAdType('code');
    setAdCode('');
    setAdStyleType('banner');
    setAdTitle('');
    setAdSubtitle('');
    setAdBtnText('');
    setAdImage('');
  };

  const handleSaveAdSlot = (e) => {
    e.preventDefault();
    const finalId = adPlacementId === 'custom' ? customPlacementId.trim() : adPlacementId;
    if (!finalId) {
      alert('Please specify a valid placement ID!');
      return;
    }

    const newAd = {
      id: finalId,
      name: adName.trim() || PREDEFINED_PLACEMENTS.find(p => p.id === finalId)?.name || 'Custom Ad Slot',
      type: adType,
      code: adType === 'code' ? adCode : '',
      title: adType === 'visual' ? adTitle : '',
      subtitle: adType === 'visual' ? adSubtitle : '',
      btnText: adType === 'visual' ? (adBtnText || 'Explore Now') : '',
      image: adType === 'visual' ? adImage : '',
      styleType: adType === 'visual' ? adStyleType : 'banner'
    };

    if (editingAd) {
      setAdSlots(prev => prev.map(s => s.id === editingAd.id ? newAd : s));
      setEditingAd(null);
    } else {
      if (adSlots.some(s => s.id === finalId)) {
        alert(`An ad slot configuration for '${finalId}' already exists. Please edit that slot instead.`);
        return;
      }
      setAdSlots(prev => [newAd, ...prev]);
      setIsAddingAd(false);
    }
    resetAdForm();
  };

  const startEditAd = (ad) => {
    setEditingAd(ad);
    const predef = PREDEFINED_PLACEMENTS.some(p => p.id === ad.id && p.id !== 'custom');
    if (predef) {
      setAdPlacementId(ad.id);
      setCustomPlacementId('');
    } else {
      setAdPlacementId('custom');
      setCustomPlacementId(ad.id);
    }
    setAdName(ad.name);
    setAdType(ad.type);
    setAdCode(ad.code || '');
    setAdStyleType(ad.styleType || 'banner');
    setAdTitle(ad.title || '');
    setAdSubtitle(ad.subtitle || '');
    setAdBtnText(ad.btnText || '');
    setAdImage(ad.image || '');
  };

  const handleDeleteAd = (id) => {
    if (window.confirm("Are you sure you want to delete this ad slot configuration?")) {
      setAdSlots(prev => prev.filter(s => s.id !== id));
    }
  };

  // Add Product logic
  const handleAddProductSubmit = (e) => {
    e.preventDefault();
    const curP = parseFloat(currentPrice.toString().replace(/,/g, '')) || 0;
    const oldP = parseFloat(oldPrice.toString().replace(/,/g, '')) || 0;
    
    // Auto-calculate discount
    let discountStr = '0%';
    if (oldP > curP) {
      discountStr = Math.round(((oldP - curP) / oldP) * 100) + '%';
    }

    const newProd = {
      id: Math.max(...productsList.map(p => p.id), 0) + 1,
      title,
      category,
      image: image || '/Image/Image/trendy-Shirts/1.webp',
      currentPrice: curP,
      oldPrice: oldP,
      discount: discountStr,
      specialPrice: Math.round(curP * 0.9), // 10% lower for special offers
      rating: 4.5,
      reviews: Math.floor(Math.random() * 500) + 10,
      description: description || 'Premium clothing outfit designed for modern style and perfect fit.',
      thumbnails: [image || '/Image/Image/trendy-Shirts/1.webp']
    };

    setProductsList([newProd, ...productsList]);
    
    // Reset Form
    setTitle('');
    setCategory(categoriesList[0]?.id || '');
    setImage('');
    setCurrentPrice('');
    setOldPrice('');
    setDescription('');
    setIsAddingProduct(false);
  };

  // Edit Product logic
  const handleEditProductSubmit = (e) => {
    e.preventDefault();
    const curP = parseFloat(currentPrice.toString().replace(/,/g, '')) || 0;
    const oldP = parseFloat(oldPrice.toString().replace(/,/g, '')) || 0;

    let discountStr = '0%';
    if (oldP > curP) {
      discountStr = Math.round(((oldP - curP) / oldP) * 100) + '%';
    }

    setProductsList(prevList => prevList.map(p => p.id === editingProduct.id ? {
      ...p,
      title,
      category,
      image,
      currentPrice: curP,
      oldPrice: oldP,
      discount: discountStr,
      specialPrice: Math.round(curP * 0.9),
      description,
      thumbnails: p.image === image ? p.thumbnails : [image]
    } : p));

    setEditingProduct(null);
  };

  const startEditProduct = (prod) => {
    setEditingProduct(prod);
    setTitle(prod.title);
    setCategory(prod.category);
    setImage(prod.image);
    setCurrentPrice(prod.currentPrice.toString());
    const cleanOldPrice = prod.oldPrice.toString().replace(/,/g, '');
    setOldPrice(cleanOldPrice);
    setDescription(prod.description || '');
  };

  // Delete Product
  const handleDeleteProduct = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProductsList(prevList => prevList.filter(p => p.id !== id));
    }
  };

  // Update Order Status
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(prevOrders => prevOrders.map(o => o.id === orderId ? {
      ...o,
      status: newStatus
    } : o));
  };

  // Delete Order
  const handleDeleteOrder = (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      setOrders(prevOrders => prevOrders.filter(o => o.id !== orderId));
    }
  };

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => {
    if (!o.status.includes('Cancelled')) {
      return sum + o.total;
    }
    return sum;
  }, 0);

  const activeOrdersCount = orders.filter(o => !o.status.includes('Delivered') && !o.status.includes('Cancelled')).length;

  if (!isAuthenticated) {
    return (
      <div className="admin-login-wrapper">
        <div className="details-back-nav">
          <button className="details-back-btn" onClick={onBack}>
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
            <span>Back to Shop</span>
          </button>
          <span className="details-nav-title">Admin Gateway</span>
        </div>

        <div className="admin-login-card">
          <h2>Admin Authentication</h2>
          <p className="login-subtitle">Access is restricted to authorized personnel.</p>
          
          <form onSubmit={handleLogin} className="admin-login-form">
            <div className="checkout-form-group">
              <label className="checkout-label">Username / ID Name</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter Username"
                className="checkout-input-compact"
                required
              />
            </div>
            
            <div className="checkout-form-group">
              <label className="checkout-label">Secret Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                className="checkout-input-compact"
                required
              />
            </div>

            {loginError && <div className="checkout-validation-error">{loginError}</div>}
            
            <button type="submit" className="admin-login-btn">
              Authenticate
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-wrapper">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-logo-row">
          <span className="admin-panel-indicator">🛡️ Admin Panel</span>
          <button onClick={handleLogout} className="admin-logout-btn">Log Out</button>
        </div>
        <div className="admin-tabs">
          <button 
            className={`admin-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={`admin-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('products');
              setIsAddingProduct(false);
              setEditingProduct(null);
            }}
          >
            Products ({productsList.length})
          </button>
          <button 
            className={`admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Orders ({orders.length})
          </button>
          <button 
            className={`admin-tab-btn ${activeTab === 'adslots' ? 'active' : ''}`}
            onClick={() => setActiveTab('adslots')}
          >
            Ad Slots
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="admin-content">
        
        {/* TAB 1: DASHBOARD METRICS */}
        {activeTab === 'dashboard' && (
          <div className="admin-tab-section">
            <h3 className="admin-section-heading">Store Performance</h3>
            <div className="admin-metrics-grid">
              <div className="metric-card">
                <span className="metric-icon">💰</span>
                <span className="metric-value">₹{totalRevenue.toLocaleString('en-IN')}</span>
                <span className="metric-label">Total Revenue</span>
              </div>
              <div className="metric-card">
                <span className="metric-icon">📦</span>
                <span className="metric-value">{orders.length}</span>
                <span className="metric-label">Total Orders</span>
              </div>
              <div className="metric-card">
                <span className="metric-icon">🏷️</span>
                <span className="metric-value">{productsList.length}</span>
                <span className="metric-label">Total Products</span>
              </div>
              <div className="metric-card">
                <span className="metric-icon">⚡</span>
                <span className="metric-value">{activeOrdersCount}</span>
                <span className="metric-label">Pending Orders</span>
              </div>
            </div>

            {/* Quick Summary list of Categories */}
            <div className="admin-summary-card" style={{ marginTop: '16px' }}>
              <h4 style={{ fontSize: '12px', fontWeight: '700', marginBottom: '10px' }}>Category Breakdown</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {categoriesList.map((cat) => {
                  const count = productsList.filter(p => p.category === cat.id).length;
                  return (
                    <div key={cat.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', paddingBottom: '6px', borderBottom: '1px solid #f0f0f0' }}>
                      <span>{cat.label}</span>
                      <strong>{count} items</strong>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MANAGE PRODUCTS */}
        {activeTab === 'products' && (
          <div className="admin-tab-section">
            {!isAddingProduct && !editingProduct ? (
              <>
                <div className="admin-products-toolbar">
                  <h3 className="admin-section-heading" style={{ margin: 0 }}>Product Inventory</h3>
                  <div className="admin-products-toolbar__actions">
                    <button
                      type="button"
                      className={`category-manage-btn ${showCategoryManager ? 'active' : ''}`}
                      onClick={() => {
                        setShowCategoryManager((prev) => !prev);
                        resetCategoryForm();
                      }}
                    >
                      {showCategoryManager ? 'Hide Categories' : 'Manage Categories'}
                    </button>
                    <button className="add-prod-trigger-btn" onClick={() => setIsAddingProduct(true)}>
                      + Add Product
                    </button>
                  </div>
                </div>

                {showCategoryManager && (
                  <div className="admin-category-manager">
                    <h4 className="admin-category-manager__title">Store Categories ({categoriesList.length})</h4>

                    <form onSubmit={handleAddCategory} className="admin-category-add-form">
                      <div className="checkout-form-group">
                        <label className="checkout-label">Category Name</label>
                        <input
                          type="text"
                          value={newCatLabel}
                          onChange={(e) => {
                            setNewCatLabel(e.target.value);
                            if (categoryError) setCategoryError('');
                          }}
                          placeholder="e.g. Wedding Wear"
                          className="checkout-input-compact"
                          required
                        />
                      </div>
                      <div className="checkout-form-row">
                        <div className="checkout-form-group">
                          <label className="checkout-label">Category ID</label>
                          <input
                            type="text"
                            value={newCatId}
                            onChange={(e) => {
                              setNewCatId(e.target.value);
                              if (categoryError) setCategoryError('');
                            }}
                            placeholder="Auto from name if empty"
                            className="checkout-input-compact"
                          />
                        </div>
                        <div className="checkout-form-group">
                          <label className="checkout-label">Image Path</label>
                          <input
                            type="text"
                            value={newCatImg}
                            onChange={(e) => setNewCatImg(e.target.value)}
                            placeholder="/Image/Image/..."
                            className="checkout-input-compact"
                          />
                        </div>
                      </div>
                      {categoryError && <div className="checkout-validation-error">{categoryError}</div>}
                      <button type="submit" className="profile-save-btn" style={{ alignSelf: 'flex-start' }}>
                        + Add Category
                      </button>
                    </form>

                    {categoriesList.length === 0 ? (
                      <p className="admin-category-empty">No categories yet. Add one above.</p>
                    ) : (
                      <div className="admin-category-list">
                        {categoriesList.map((cat) => {
                          const count = productsList.filter((p) => p.category === cat.id).length;
                          return (
                            <div key={cat.id} className="admin-category-row">
                              <img src={cat.img} alt={cat.label} className="admin-category-row__thumb" />
                              <div className="admin-category-row__info">
                                <strong>{cat.label}</strong>
                                <span>ID: {cat.id}</span>
                                <span>{count} product{count !== 1 ? 's' : ''}</span>
                              </div>
                              <button
                                type="button"
                                className="delete-btn"
                                onClick={() => handleDeleteCategory(cat.id)}
                              >
                                Remove
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productsList.map(prod => (
                        <tr key={prod.id}>
                          <td>
                            <div className="admin-table-product-cell">
                              <img src={prod.image} alt={prod.title} />
                              <div className="table-product-title">{prod.title}</div>
                            </div>
                          </td>
                          <td style={{ textTransform: 'capitalize', fontSize: '11px' }}>{prod.category}</td>
                          <td>
                            <div style={{ fontSize: '11px', fontWeight: '700' }}>₹{prod.currentPrice}</div>
                            <div style={{ fontSize: '9px', textDecoration: 'line-through', color: '#999' }}>₹{prod.oldPrice}</div>
                          </td>
                          <td>
                            <div className="admin-table-actions">
                              <button className="edit-btn" onClick={() => startEditProduct(prod)}>Edit</button>
                              <button className="delete-btn" onClick={() => handleDeleteProduct(prod.id)}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              /* ADD OR EDIT PRODUCT FORM */
              <div className="admin-product-form-container">
                <h3 className="admin-section-heading">
                  {editingProduct ? 'Edit Outfit Details' : 'Add New Outfit'}
                </h3>
                
                <form onSubmit={editingProduct ? handleEditProductSubmit : handleAddProductSubmit} className="admin-product-form">
                  <div className="checkout-form-group">
                    <label className="checkout-label">Product Title</label>
                    <input 
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Red Satin Lace Corset Top"
                      className="checkout-input-compact"
                      required
                    />
                  </div>

                  <div className="checkout-form-row">
                    <div className="checkout-form-group">
                      <label className="checkout-label">Category</label>
                      <select 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="checkout-input-compact"
                        style={{ height: '32px' }}
                        required
                      >
                        {categoriesList.length === 0 ? (
                          <option value="">No categories — add one first</option>
                        ) : (
                          categoriesList.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.label}</option>
                          ))
                        )}
                      </select>
                    </div>

                    <div className="checkout-form-group">
                      <label className="checkout-label">Image Path</label>
                      <input 
                        type="text"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        placeholder="e.g. /Image/Image/corset/1.webp"
                        className="checkout-input-compact"
                        required
                      />
                    </div>
                  </div>

                  <div className="checkout-form-row">
                    <div className="checkout-form-group">
                      <label className="checkout-label">Sale Price (₹)</label>
                      <input 
                        type="number"
                        value={currentPrice}
                        onChange={(e) => setCurrentPrice(e.target.value)}
                        placeholder="e.g. 149"
                        className="checkout-input-compact"
                        required
                      />
                    </div>

                    <div className="checkout-form-group">
                      <label className="checkout-label">MRP Price (₹)</label>
                      <input 
                        type="number"
                        value={oldPrice}
                        onChange={(e) => setOldPrice(e.target.value)}
                        placeholder="e.g. 1300"
                        className="checkout-input-compact"
                        required
                      />
                    </div>
                  </div>

                  <div className="checkout-form-group">
                    <label className="checkout-label">Description</label>
                    <textarea 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter description details"
                      className="address-textarea"
                      style={{ height: '60px', padding: '6px', fontSize: '12px' }}
                    />
                  </div>

                  <div className="profile-form-actions" style={{ marginTop: '12px' }}>
                    <button type="submit" className="profile-save-btn">
                      {editingProduct ? 'Update Product' : 'Add Product'}
                    </button>
                    <button 
                      type="button" 
                      className="profile-cancel-btn"
                      onClick={() => {
                        setIsAddingProduct(false);
                        setEditingProduct(null);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: MANAGE ORDERS */}
        {activeTab === 'orders' && (
          <div className="admin-tab-section">
            <h3 className="admin-section-heading">Customer Orders</h3>
            
            {orders.length === 0 ? (
              <div className="empty-state" style={{ padding: '40px 16px' }}>
                <p>No orders placed in store yet.</p>
              </div>
            ) : (
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order Details</th>
                      <th>Total</th>
                      <th>Status Manager</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id}>
                        <td>
                          <div style={{ fontSize: '11px', fontWeight: '700', color: '#111' }}>ID: #{order.id}</div>
                          <div style={{ fontSize: '9px', color: '#666', margin: '2px 0 4px 0' }}>
                            <strong>Addr:</strong> {order.address}
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            {order.items.map((item, i) => (
                              <div key={i} style={{ fontSize: '9px', color: '#333' }}>
                                • {item.title} ({item.size}) &times; {item.quantity}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td style={{ fontSize: '11px', fontWeight: '700' }}>₹{order.total}</td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <select 
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                              className="checkout-input-compact"
                              style={{ height: '26px', padding: '2px 4px', fontSize: '10px' }}
                            >
                              <option value="Placed (Processing)">Placed (Processing)</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                            <button 
                              className="delete-order-btn"
                              onClick={() => handleDeleteOrder(order.id)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#d32f2f',
                                fontSize: '10px',
                                textDecoration: 'underline',
                                cursor: 'pointer',
                                textAlign: 'left',
                                paddingLeft: '4px'
                              }}
                            >
                              Delete Order
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: MANAGE AD SLOTS */}
        {activeTab === 'adslots' && (
          <div className="admin-tab-section">
            <div className="ad-slots-container">
              {/* Header row inside tab */}
              <div className="ad-slots-header-row">
                <div className="ad-slots-title-section">
                  <h2>Ad Slots Management</h2>
                  <p>Create and deploy dynamic advertising placements</p>
                </div>
                <div className="ad-slots-meta-actions">
                  <div className="ad-slots-date-pill">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '2px' }}>
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span>26 May 2026</span>
                  </div>
                  <button className="ad-slots-refresh-btn" type="button" onClick={() => {
                    resetAdForm();
                    setIsAddingAd(false);
                    setEditingAd(null);
                  }} title="Reset Tab View">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 4v6h-6" />
                      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Blue Alert warning */}
              <div className="waf-bypass-alert" style={{ marginBottom: '16px' }}>
                <div className="waf-bypass-alert-icon">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div className="waf-bypass-alert-text">
                  <strong>Standard Ad Code Integration.</strong> Paste raw HTML scripts, Google Tags, custom banner codes or design visually styled promos instantly.
                </div>
              </div>

              {!isAddingAd && !editingAd ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h3 className="admin-section-heading" style={{ margin: 0 }}>Ad Placement Settings</h3>
                    <button className="add-prod-trigger-btn" onClick={() => {
                      resetAdForm();
                      setIsAddingAd(true);
                    }}>
                      + Add New Placement
                    </button>
                  </div>

                  {adSlots.length === 0 ? (
                    <div className="empty-state" style={{ padding: '40px 16px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', textAlign: 'center' }}>
                      <p style={{ color: '#888', margin: '0 0 12px 0', fontSize: '12.5px' }}>No custom ad placements configured.</p>
                      <button className="add-prod-trigger-btn" onClick={() => {
                        resetAdForm();
                        setIsAddingAd(true);
                      }}>
                        Create Your First Ad Slot
                      </button>
                    </div>
                  ) : (
                    <div className="admin-table-container">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Placement ID / Name</th>
                            <th>Type</th>
                            <th>Snippet / Preview</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {adSlots.map(ad => (
                            <tr key={ad.id}>
                              <td>
                                <div style={{ fontSize: '11.5px', fontWeight: '700', color: '#1e293b', textAlign: 'left' }}><code>{ad.id}</code></div>
                                <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px', textAlign: 'left' }}>{ad.name}</div>
                              </td>
                              <td>
                                <span style={{ 
                                  fontSize: '9px', 
                                  fontWeight: '700', 
                                  textTransform: 'uppercase',
                                  background: ad.type === 'code' ? '#e0f2fe' : '#f0fdf4',
                                  color: ad.type === 'code' ? '#0369a1' : '#15803d',
                                  padding: '2px 6px',
                                  borderRadius: '4px'
                                }}>
                                  {ad.type === 'code' ? 'Code Script' : 'Visual Banner'}
                                </span>
                              </td>
                              <td style={{ fontSize: '10.5px', color: '#475569', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'left' }}>
                                {ad.type === 'code' ? (
                                  <code>{ad.code}</code>
                                ) : (
                                  <span><strong>{ad.title}</strong> - {ad.subtitle}</span>
                                )}
                              </td>
                              <td>
                                <div className="admin-table-actions">
                                  <button className="edit-btn" onClick={() => startEditAd(ad)}>Edit</button>
                                  <button className="delete-btn" onClick={() => handleDeleteAd(ad.id)}>Delete</button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              ) : (
                /* ADD OR EDIT AD SLOT CONFIGURATION FORM */
                <div className="admin-product-form-container" style={{ textAlign: 'left' }}>
                  <h3 className="admin-section-heading" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', marginBottom: '16px' }}>
                    {editingAd ? `Edit Configuration: ${editingAd.id}` : 'Configure New Ad Slot'}
                  </h3>
                  
                  <form onSubmit={handleSaveAdSlot} className="admin-product-form">
                    <div className="checkout-form-row">
                      <div className="checkout-form-group">
                        <label className="checkout-label">Select Placement Location</label>
                        <select 
                          value={adPlacementId}
                          onChange={(e) => setAdPlacementId(e.target.value)}
                          className="checkout-input-compact"
                          style={{ height: '34px' }}
                          disabled={!!editingAd}
                          required
                        >
                          {PREDEFINED_PLACEMENTS.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="checkout-form-group">
                        <label className="checkout-label">Ad Slot Label / Name</label>
                        <input 
                          type="text"
                          value={adName}
                          onChange={(e) => setAdName(e.target.value)}
                          placeholder="e.g. Header Top Ad"
                          className="checkout-input-compact"
                          required
                        />
                      </div>
                    </div>

                    {adPlacementId === 'custom' && (
                      <div className="checkout-form-group" style={{ animation: 'fadeIn 0.2s' }}>
                        <label className="checkout-label">Custom Position ID (Unique string to look up in code)</label>
                        <input 
                          type="text"
                          value={customPlacementId}
                          onChange={(e) => setCustomPlacementId(e.target.value)}
                          placeholder="e.g. my-custom-section-banner"
                          className="checkout-input-compact"
                          disabled={!!editingAd}
                          required
                        />
                      </div>
                    )}

                    <div className="checkout-form-group" style={{ marginBottom: '8px' }}>
                      <label className="checkout-label">Ad Content Type</label>
                      <select 
                        value={adType}
                        onChange={(e) => setAdType(e.target.value)}
                        className="checkout-input-compact"
                        style={{ height: '34px' }}
                        required
                      >
                        <option value="code">Raw HTML / JavaScript Code Script</option>
                        <option value="visual">Standard Visual Card or Banner</option>
                      </select>
                    </div>

                    {/* Render based on adType */}
                    {adType === 'code' ? (
                      <div className="checkout-form-group" style={{ animation: 'fadeIn 0.2s' }}>
                        <label className="checkout-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Raw HTML / CSS / JavaScript Code Snippet</span>
                          <span style={{ color: '#0284c7', fontSize: '10px' }}>⚡ Google Tag / Adsense compatible</span>
                        </label>
                        <textarea 
                          value={adCode}
                          onChange={(e) => setAdCode(e.target.value)}
                          placeholder="Paste script tags or HTML code here (e.g. <script src='...'></script> or <div>...</div>)"
                          className="ad-slot-textarea"
                          style={{ height: '220px', fontSize: '12px' }}
                          required
                        />
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', animation: 'fadeIn 0.2s' }}>
                        <div className="checkout-form-row">
                          <div className="checkout-form-group">
                            <label className="checkout-label">Visual Style</label>
                            <select 
                              value={adStyleType}
                              onChange={(e) => setAdStyleType(e.target.value)}
                              className="checkout-input-compact"
                              style={{ height: '34px' }}
                            >
                              <option value="banner">Banner (Full Width)</option>
                              <option value="card">Card (Renders in Grid)</option>
                            </select>
                          </div>

                          <div className="checkout-form-group">
                            <label className="checkout-label">Image URL / Path</label>
                            <input 
                              type="text"
                              value={adImage}
                              onChange={(e) => setAdImage(e.target.value)}
                              placeholder="e.g. /Image/Image/ads/promo.jpg"
                              className="checkout-input-compact"
                            />
                          </div>
                        </div>

                        <div className="checkout-form-row">
                          <div className="checkout-form-group">
                            <label className="checkout-label">Ad Title</label>
                            <input 
                              type="text"
                              value={adTitle}
                              onChange={(e) => setAdTitle(e.target.value)}
                              placeholder="e.g. Summer Special 50% Off"
                              className="checkout-input-compact"
                              required
                            />
                          </div>

                          <div className="checkout-form-group">
                            <label className="checkout-label">CTA Button Text</label>
                            <input 
                              type="text"
                              value={adBtnText}
                              onChange={(e) => setAdBtnText(e.target.value)}
                              placeholder="e.g. Shop Now"
                              className="checkout-input-compact"
                            />
                          </div>
                        </div>

                        <div className="checkout-form-group">
                          <label className="checkout-label">Subtitle / Description</label>
                          <textarea 
                            value={adSubtitle}
                            onChange={(e) => setAdSubtitle(e.target.value)}
                            placeholder="e.g. Explore our premium summer collection featuring boutique lace corset tops."
                            className="address-textarea"
                            style={{ height: '60px', padding: '8px', fontSize: '12px' }}
                            required
                          />
                        </div>
                      </div>
                    )}

                    <div className="profile-form-actions" style={{ marginTop: '16px' }}>
                      <button type="submit" className="profile-save-btn">
                        {editingAd ? 'Update Ad Placement' : 'Save Ad Slot'}
                      </button>
                      <button 
                        type="button" 
                        className="profile-cancel-btn"
                        onClick={() => {
                          setIsAddingAd(false);
                          setEditingAd(null);
                          resetAdForm();
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminPanel;
