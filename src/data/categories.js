export const defaultCategories = [
  { id: 'Indian dresses', label: 'Indian Dresses', img: '/Image/Image/Indian dresses/1.webp' },
  { id: 'corset', label: 'Corset', img: '/Image/Image/corset/1.webp' },
  { id: 'Ethnic Wear', label: 'Ethnic Wear', img: '/Image/Image/Ethnic Wear/1.jpg' },
  { id: 'Combo', label: 'Combo', img: '/Image/Image/Combo/1.jpg' },
  { id: 'trendy-Shirts', label: 'Trendy Shirts', img: '/Image/Image/trendy-Shirts/1.webp' },
];

export function normalizeCategoryId(label) {
  return label.trim();
}
