import React from 'react';
import { useCart } from '../context/CartContext';
import { ChevronRightIcon } from './icons';

interface FloatingCartButtonProps {
    onNavigate: (view: 'cart') => void;
    isNavVisible: boolean;
}

const FloatingCartButton: React.FC<FloatingCartButtonProps> = ({ onNavigate, isNavVisible }) => {
    const { totalItems, totalPrice } = useCart();

    if (totalItems === 0) return null;

    const bottomPositionClass = isNavVisible ? 'bottom-20' : 'bottom-4';

    return (
        <div className={`fixed ${bottomPositionClass} left-0 right-0 max-w-md mx-auto px-4 z-20 pointer-events-none`}>
            <div className="animate-slide-up pointer-events-auto">
                 <button 
                    onClick={() => onNavigate('cart')}
                    className="w-full bg-white text-black border-2 border-sky-300 rounded-lg flex items-center justify-between shadow-lg p-3"
                >
                    <div className="flex flex-col items-start">
                        <span className="text-xs font-semibold">{totalItems} {totalItems > 1 ? 'Items' : 'Item'}</span>
                        <span className="text-lg font-bold">₹{totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center font-bold text-lg">
                        <span>View Cart</span>
                        <ChevronRightIcon className="w-6 h-6 ml-1" />
                    </div>
                </button>
            </div>
        </div>
    );
};

export default FloatingCartButton;