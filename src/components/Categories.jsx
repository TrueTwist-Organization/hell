import React from 'react';

const Categories = ({ selectedCategory, setSelectedCategory }) => {
  const categoryList = [
    { id: 'Indian dresses', label: 'Indian Dresses', img: '/Image/Image/Indian dresses/1.webp' },
    { id: 'corset', label: 'Corset', img: '/Image/Image/corset/1.webp' },
    { id: 'Ethnic Wear', label: 'Ethnic Wear', img: '/Image/Image/Ethnic Wear/1.jpg' },
    { id: 'Combo', label: 'Combo', img: '/Image/Image/Combo/1.jpg' },
    { id: 'trendy-Shirts', label: 'Trendy Shirts', img: '/Image/Image/trendy-Shirts/1.webp' }
  ];

  const handleCategoryClick = (id) => {
    if (selectedCategory === id) {
      setSelectedCategory(null); // toggle off if clicked again
    } else {
      setSelectedCategory(id);
    }
  };

  return (
    <div className="categories">
      {categoryList.map((cat) => (
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
