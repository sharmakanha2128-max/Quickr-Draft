import React from 'react';
import { HomeIcon, CategoryIcon, CartIcon, OrderAgainIcon } from './icons';
import { useCart } from '../context/CartContext';

interface BottomNavProps {
  activeView: string;
  onNavigate: (view: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeView, onNavigate }) => {
  const { totalItems } = useCart();
  const navItems = [
    { name: 'Home', view: 'home', icon: HomeIcon },
    { name: 'Categories', view: 'categories', icon: CategoryIcon },
    { name: 'Cart', view: 'cart', icon: CartIcon },
    { name: 'Order Again', view: 'orderAgain', icon: OrderAgainIcon },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 flex justify-around md:hidden">
      {navItems.map((item) => {
        const isActive = activeView === item.view;
        return (
          <button
            key={item.name}
            onClick={() => onNavigate(item.view)}
            className={`flex flex-col items-center justify-center w-full py-2 text-sm transition-colors duration-200 ${
              isActive ? 'text-[#00FF00]' : 'text-gray-500 hover:text-[#00FF00]'
            }`}
          >
            <div className="relative">
              <item.icon className="w-6 h-6" />
              {item.view === 'cart' && totalItems > 0 && (
                <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                  {totalItems}
                </span>
              )}
            </div>
            <span className={`mt-1 font-medium ${isActive ? 'font-bold' : ''}`}>{item.name}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;