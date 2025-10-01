import React, { useState, useEffect } from 'react';
import { Retailer, Product } from '../types';
import { useCart } from '../context/CartContext';
import { ArrowLeftIcon, PlusIcon, StarIcon, MinusIcon, TrashIcon } from '../components/icons';
import Spinner from '../components/Spinner';

interface StoreScreenProps {
  store: Retailer;
  onBack: () => void;
}

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart, cartItems, updateQuantity } = useCart();
  const itemInCart = cartItems.find(item => item.product.id === product.id);

  return (
    <div className="bg-white rounded-lg shadow-sm p-3 flex flex-col relative">
      <div className="absolute top-2 right-2 z-10">
        {itemInCart ? (
          <div className="flex items-center justify-between w-full max-w-[100px] h-9 bg-white border-2 border-sky-300 rounded-lg text-sky-500 shadow-md">
            <button 
              onClick={() => updateQuantity(itemInCart.product.id, itemInCart.quantity - 1)} 
              className="px-2 py-1"
              aria-label="Decrease quantity"
            >
              {itemInCart.quantity === 1 ? <TrashIcon className="w-4 h-4 text-red-500" /> : <MinusIcon className="w-4 h-4" />}
            </button>
            <span className="font-bold text-black text-sm">{itemInCart.quantity}</span>
            <button 
              onClick={() => updateQuantity(itemInCart.product.id, itemInCart.quantity + 1)} 
              className="px-2 py-1"
              aria-label="Increase quantity"
            >
              <PlusIcon className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button 
            onClick={() => addToCart(product)}
            className="flex items-center justify-center w-9 h-9 bg-white text-sky-500 border-2 border-sky-300 rounded-lg font-bold hover:bg-sky-50 transition shadow-md"
            aria-label={`Add ${product.name} to cart`}
          >
            <PlusIcon className="w-5 h-5" />
          </button>
        )}
      </div>
      <div className="flex-grow">
        <img src={product.imageUrl} alt={product.name} className="w-full aspect-square object-cover rounded-md mb-2" />
        <p className="font-bold text-gray-900 text-lg">₹{product.price}</p>
        <h3 className="font-semibold text-gray-800 mt-1 text-sm leading-tight h-10">{product.name}</h3>
        <p className="text-sm text-gray-500 mt-1">{product.weight}</p>
      </div>
    </div>
  );
};

const StoreScreen: React.FC<StoreScreenProps> = ({ store, onBack }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true); // Reset loading state when store changes
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [store.id]);

  if (!store) {
    return (
      <div className="p-4">
        <button onClick={onBack} className="text-[#00FF00]">&larr; Back</button>
        <p className="mt-4">Store not found.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="sticky top-0 bg-white z-10 p-4 shadow-sm flex items-center">
        <button onClick={onBack} className="mr-4 p-2 rounded-full hover:bg-gray-100">
          <ArrowLeftIcon className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">{store.name}</h1>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className="p-4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <img className="w-full h-40 object-cover" src={store.imageUrl} alt={store.name} />
            <div className="p-4">
              <h2 className="font-bold text-2xl">{store.name}</h2>
              <div className="flex items-center text-md text-gray-600 mt-1">
                <StarIcon className="w-5 h-5 text-yellow-400 mr-1" />
                <span>{store.rating}</span>
              </div>
              {store.description && (
                <p className="text-sm text-gray-700 mt-3">{store.description}</p>
              )}
              {store.operatingHours && (
                <div className="mt-2 text-sm text-gray-600">
                  <span className="font-bold">Hours:</span> {store.operatingHours}
                </div>
              )}
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-4">All Products</h2>
          <div className="grid grid-cols-2 gap-4">
            {store.products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreScreen;