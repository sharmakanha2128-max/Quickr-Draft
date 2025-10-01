
import React, { useState, useEffect } from 'react';
import { Retailer } from '../types';
import { StarIcon, LightningBoltIcon, LocationIcon, ChevronRightIcon } from '../components/icons';
import Spinner from '../components/Spinner';
import { useOrder } from '../context/OrderContext';
import { useRetailer } from '../context/RetailerContext';

interface HomeScreenProps {
  onSelectStore: (storeId: string) => void;
  onNavigate: (view: string) => void;
}

const StoreCard: React.FC<{ store: Retailer; onClick: () => void; animationDelay: string }> = ({ store, onClick, animationDelay }) => (
  <div 
    className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-200 cursor-pointer animate-fade-scale-in" 
    onClick={onClick}
    style={{ animationDelay }}
  >
    <img className="w-full h-24 object-cover" src={store.imageUrl} alt={store.name} />
    <div className="p-3">
      <h3 className="font-bold text-base">{store.name}</h3>
      <div className="flex items-center text-xs text-gray-600 mt-1">
        <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
        <span>{store.rating}</span>
      </div>
    </div>
  </div>
);

const frequentlyBoughtTabs = [
    { name: "Favourites", imageUrl: "https://img.icons8.com/plasticine/100/like.png" },
    { name: "Fruits & Veg", imageUrl: "https://img.icons8.com/plasticine/100/strawberry.png" },
    { name: "Dairy & Bread", imageUrl: "https://img.icons8.com/plasticine/100/cheese.png" },
    { name: "Oil & Masala", imageUrl: "https://img.icons8.com/plasticine/100/chili-pepper.png" },
    { name: "Home Needs", imageUrl: "https://img.icons8.com/plasticine/100/housekeeping.png" },
    { name: "Bread & Butter", imageUrl: "https://img.icons8.com/plasticine/100/bread.png" }
];

const FrequentlyBoughtCard: React.FC<{tab: {name: string, imageUrl: string}, isActive: boolean, onClick: () => void}> = ({ tab, isActive, onClick }) => (
    <div 
        onClick={onClick}
        className={`flex flex-col items-center justify-center text-center p-2 rounded-lg cursor-pointer transition-all duration-200 ${
            isActive ? 'bg-[#00FF00]/20 border-2 border-[#00FF00]' : 'bg-gray-100 border-2 border-transparent'
        }`}
    >
        <img src={tab.imageUrl} alt={tab.name} className="w-12 h-12 object-contain mb-1" />
        <span className="text-xs font-semibold text-gray-700 leading-tight">{tab.name}</span>
    </div>
)

const OrderTrackingBanner: React.FC<{ onClick: () => void }> = ({ onClick }) => {
    const { currentOrder } = useOrder();
    if (!currentOrder || currentOrder.status === 'delivered') return null;

    const statusMessages: { [key: string]: string } = {
        placed: "Your order has been placed!",
        processing: "Your order is being processed.",
        out_for_delivery: "Your order is out for delivery!",
    };

    return (
        <div onClick={onClick} className="bg-white rounded-xl shadow-lg p-4 flex items-center justify-between cursor-pointer mb-4">
            <div className="flex items-center">
                <img src="https://img.icons8.com/color/96/000000/delivery--v1.png" alt="Delivery" className="w-12 h-12" />
                <div className="ml-3">
                    <p className="font-bold text-gray-800">Your order is on its way!</p>
                    <p className="text-sm text-gray-600">{statusMessages[currentOrder.status]}</p>
                </div>
            </div>
            <ChevronRightIcon className="w-6 h-6 text-gray-400" />
        </div>
    );
};

const HomeScreen: React.FC<HomeScreenProps> = ({ onSelectStore, onNavigate }) => {
  const [activeTab, setActiveTab] = useState(frequentlyBoughtTabs[0].name);
  const { retailers, loading, error } = useRetailer();

  if (loading) {
    return <Spinner />;
  }

  if (error) {
      return <div className="p-4 text-center text-red-500">Error: {error}</div>
  }

  return (
    <div className="space-y-6 p-4">
      {/* Order Tracking Banner */}
      <OrderTrackingBanner onClick={() => onNavigate('orderTracking')} />
      
      {/* Hero Banner */}
      <div className="w-full bg-[#00FF00] rounded-2xl p-4 flex items-center justify-between text-white">
        {/* Left Side */}
        <div>
          <h2 className="text-3xl font-bold leading-tight">Ultra-fast</h2>
          <h2 className="text-3xl font-bold leading-tight">Delivery</h2>
          <div className="flex items-center space-x-6 mt-4">
            <div className="flex items-center text-sm font-semibold">
              <LightningBoltIcon className="w-4 h-4 mr-1.5" />
              <span>10-20 mins</span>
            </div>
            <div className="flex items-center text-sm font-semibold">
              <LocationIcon className="w-4 h-4 mr-1.5" />
              <span>Local stores</span>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="bg-white/25 backdrop-blur-sm rounded-2xl p-3 text-center text-sm font-semibold leading-snug self-start">
          <p>🎉 Free delivery</p>
          <p className="font-bold">on ₹199+</p>
        </div>
      </div>


      {/* Frequently Bought */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Frequently Bought</h2>
        <div className="grid grid-cols-3 gap-3">
          {frequentlyBoughtTabs.map(tab => (
            <FrequentlyBoughtCard 
                key={tab.name}
                tab={tab}
                isActive={activeTab === tab.name}
                onClick={() => setActiveTab(tab.name)}
            />
          ))}
        </div>
      </section>

      {/* Stores */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Available Stores</h2>
        <div className="grid grid-cols-2 gap-5">
          {retailers.map((store, index) => (
            <StoreCard 
                key={store.id} 
                store={store} 
                onClick={() => onSelectStore(store.id)}
                animationDelay={`${index * 100}ms`}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomeScreen;
