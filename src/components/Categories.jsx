import React from 'react';
import { defaultCategories } from '../data/categories';

const Categories = ({ categories = defaultCategories, selectedCategory, setSelectedCategory }) => {
  const handleCategoryClick = (id) => {
    if (selectedCategory === id) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(id);
    }
  };

  if (!categories.length) {
    return null;
  }

  return (
    <div className="categories">
      {categories.map((cat) => (
        <div 
          key={cat.id} 
          className={`category-item ${selectedCategory === cat.id ? 'active' : ''}`}
          onClick={() => handleCategoryClick(cat.id)}
        >
          <div className="category-item__img">
            <img src={cat.img} alt={cat.label} />
          </div>
          <span>{cat.label}</span>
        </div>
      ))}
    </div>
  );
};

export default Categories;
