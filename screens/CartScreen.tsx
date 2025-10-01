import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { PlusIcon, MinusIcon, TrashIcon, ChevronDownIcon, ChevronRightIcon } from '../components/icons';
import { CartItem } from '../types';

interface CartScreenProps {
    onNavigate: (view: string) => void;
}

const CartItemCard: React.FC<{ item: CartItem }> = ({ item }) => {
    const { updateQuantity } = useCart();
    return (
        <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
            <img src={item.product.imageUrl} alt={item.product.name} className="w-16 h-16 object-cover rounded-md"/>
            <div className="ml-4 flex-1">
                <h3 className="font-semibold text-gray-800">{item.product.name}</h3>
                <p className="text-sm text-gray-500">{item.product.weight}</p>
                <p className="font-bold text-gray-900 mt-1">₹{item.product.price}</p>
            </div>
            <div className="flex items-center">
                <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="p-2 bg-gray-200 rounded-full">
                    {item.quantity === 1 ? <TrashIcon className="w-4 h-4 text-red-500" /> : <MinusIcon className="w-4 h-4 text-gray-700"/>}
                </button>
                <span className="px-4 font-bold">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="p-2 bg-gray-200 rounded-full">
                    <PlusIcon className="w-4 h-4 text-gray-700"/>
                </button>
            </div>
        </div>
    );
};

const CartScreen: React.FC<CartScreenProps> = ({ onNavigate }) => {
  const { cartItems, totalPrice, totalItems, clearCart } = useCart();
  const [showBill, setShowBill] = useState(false);

  const deliveryFee = totalPrice >= 199 ? 0 : 15;
  const taxesAndCharges = 5.35;
  const finalTotal = totalPrice + deliveryFee + taxesAndCharges;

  if (totalItems === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <h1 className="text-2xl font-bold text-gray-800">Your Cart is Empty</h1>
        <p className="text-gray-500 mt-2">Looks like you haven't added anything to your cart yet.</p>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <div className="p-4 sticky top-0 bg-white z-10 shadow-sm">
        <h1 className="text-xl font-bold text-center text-gray-800">My Cart ({totalItems})</h1>
      </div>
      
      <div className="p-4 space-y-4">
        {cartItems.map(item => <CartItemCard key={item.product.id} item={item} />)}
      </div>

      <div className="p-4 mt-4">
        <button onClick={clearCart} className="w-full text-center text-red-500 font-semibold py-2">
            Clear Cart
        </button>
      </div>

      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
        <div className="mb-4">
            <button onClick={() => setShowBill(!showBill)} className="w-full flex justify-between items-center text-left py-1">
                <span className="font-semibold text-gray-600">Bill Details</span>
                {showBill ? <ChevronDownIcon className="w-5 h-5 text-gray-600" /> : <ChevronRightIcon className="w-5 h-5 text-gray-600" />}
            </button>
            {showBill && (
                <div className="mt-2 text-sm text-gray-600 space-y-1.5 pt-2 border-t">
                    <div className="flex justify-between">
                        <span>Item Total</span>
                        <span>₹{totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Delivery Fee</span>
                        {totalPrice >= 199 ? (
                            <span>
                                <span className="line-through mr-2 text-gray-500">₹15.00</span>
                                <span className="text-green-600 font-semibold">FREE</span>
                            </span>
                        ) : (
                            <span>₹{deliveryFee.toFixed(2)}</span>
                        )}
                    </div>
                    <div className="flex justify-between">
                        <span>Taxes & Charges</span>
                        <span>₹{taxesAndCharges.toFixed(2)}</span>
                    </div>
                </div>
            )}
        </div>

        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold text-gray-700">To Pay:</span>
          <span className="text-2xl font-bold text-gray-900">₹{finalTotal.toFixed(2)}</span>
        </div>
        <button onClick={() => onNavigate('payment')} className="w-full bg-[#00FF00] text-black font-bold py-3 rounded-lg text-lg hover:opacity-90 transition">
          Select Payment Options
        </button>
      </div>
    </div>
  );
};

export default CartScreen;