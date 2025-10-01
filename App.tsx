
import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import HomeScreen from './screens/HomeScreen';
import StoreScreen from './screens/StoreScreen';
import CartScreen from './screens/CartScreen';
import PlaceholderScreen from './screens/PlaceholderScreen';
import CategoriesScreen from './screens/CategoriesScreen';
import AccountScreen from './screens/AccountScreen';
import OrderTrackingScreen from './screens/OrderTrackingScreen';
import PaymentScreen from './screens/PaymentScreen';
import StoreCustomizationScreen from './screens/StoreCustomizationScreen';
import RetailerOnboardingScreen from './screens/RetailerOnboardingScreen';
import { useCart, CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { OrderProvider } from './context/OrderContext';
import { RetailerProvider, useRetailer } from './context/RetailerContext';
import FloatingCartButton from './components/FloatingCartButton';

type View = 'home' | 'categories' | 'cart' | 'account' | 'store' | 'orderAgain' | 'orderTracking' | 'payment' | 'storeCustomization' | 'manageProducts' | 'incomingOrders' | 'retailerOnboarding';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const { totalItems } = useCart();
  const { retailers } = useRetailer();

  const handleNavigate = (view: View) => {
    setCurrentView(view);
  };

  const handleSelectStore = (storeId: string) => {
    setSelectedStoreId(storeId);
    setCurrentView('store');
  };

  const handleBackFromStore = () => {
    setSelectedStoreId(null);
    setCurrentView('home');
  };
  
  const selectedStore = useMemo(() => {
    return retailers.find(r => r.id === selectedStoreId) || null;
  }, [selectedStoreId, retailers]);

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return <HomeScreen onSelectStore={handleSelectStore} onNavigate={handleNavigate} />;
      case 'store':
        return selectedStore ? <StoreScreen store={selectedStore} onBack={handleBackFromStore} /> : <HomeScreen onSelectStore={handleSelectStore} onNavigate={handleNavigate}/>;
      case 'cart':
        return <CartScreen onNavigate={handleNavigate} />;
      case 'categories':
        return <CategoriesScreen />;
      case 'account':
        return <AccountScreen onNavigate={handleNavigate} />;
      case 'orderAgain':
        return <PlaceholderScreen title="Order Again" />;
      case 'orderTracking':
        return <OrderTrackingScreen onNavigate={handleNavigate} />;
      case 'payment':
        return <PaymentScreen onNavigate={handleNavigate} onBack={() => setCurrentView('cart')} />;
      case 'retailerOnboarding':
        return <RetailerOnboardingScreen onNavigate={handleNavigate} onBack={() => setCurrentView('account')} />;
      case 'storeCustomization':
        return <StoreCustomizationScreen onBack={() => handleNavigate('account')} />;
      case 'manageProducts':
        return <PlaceholderScreen title="Manage Products" />;
      case 'incomingOrders':
        return <PlaceholderScreen title="Incoming Orders" />;
      default:
        return <HomeScreen onSelectStore={handleSelectStore} onNavigate={handleNavigate}/>;
    }
  };

  const showHeader = ['home', 'categories'].includes(currentView);
  const showBottomNav = !['store', 'account', 'orderTracking', 'payment', 'storeCustomization', 'manageProducts', 'incomingOrders', 'retailerOnboarding'].includes(currentView);
  const showFloatingCart = totalItems > 0 && ['home', 'store'].includes(currentView);

  let mainPaddingBottom = '';
  if (showBottomNav) {
    mainPaddingBottom = showFloatingCart ? 'pb-36' : 'pb-20';
  } else if (showFloatingCart) {
    mainPaddingBottom = 'pb-20';
  }

  return (
    <div className="max-w-md mx-auto bg-[#e0feda] font-sans flex flex-col min-h-screen relative shadow-2xl">
      {showHeader && <Header onNavigate={handleNavigate as (view: 'account') => void} />}
      
      <main className={`flex-grow ${mainPaddingBottom}`}>
        {renderContent()}
      </main>
      
      <div className="md:hidden">
        {showFloatingCart && <FloatingCartButton onNavigate={handleNavigate as (view: 'cart') => void} isNavVisible={showBottomNav} />}
        {showBottomNav && (
          <BottomNav activeView={currentView} onNavigate={handleNavigate} />
        )}
      </div>
    </div>
  );
};


const App: React.FC = () => {
  return (
    <AuthProvider>
      <RetailerProvider>
        <OrderProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </OrderProvider>
      </RetailerProvider>
    </AuthProvider>
  );
};

export default App;
