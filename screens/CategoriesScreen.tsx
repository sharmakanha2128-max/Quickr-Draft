import React, { useState, useEffect } from 'react';
import { Category } from '../types';
import { categories } from '../data/mockData';
import Spinner from '../components/Spinner';

const CategoryCard: React.FC<{ category: Category }> = ({ category }) => (
  <div className="flex flex-col items-center text-center">
    <div className="w-20 h-20 bg-[#00FF00]/20 rounded-full flex items-center justify-center">
      <img src={category.imageUrl} alt={category.name} className="w-16 h-16 object-contain" />
    </div>
    <span className="mt-2 text-sm font-medium text-gray-700">{category.name}</span>
  </div>
);

const CategoriesScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="p-4 h-full">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Shop by Category</h2>
      <div className="grid grid-cols-4 gap-y-6 gap-x-4">
        {categories.map(cat => <CategoryCard key={cat.id} category={cat} />)}
      </div>
    </div>
  );
};

export default CategoriesScreen;