
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { Order, CartItem } from '../types';

interface OrderContextType {
  currentOrder: Order | null;
  placeOrder: (items: CartItem[], totalPrice: number) => void;
  clearOrder: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  const placeOrder = useCallback((items: CartItem[], totalPrice: number) => {
    const order: Order = {
      id: `order_${Date.now()}`,
      items,
      totalPrice,
      status: 'placed',
      orderDate: new Date(),
      estimatedDelivery: '15-20 mins'
    };
    setCurrentOrder(order);

    // Simulate real-time order status updates
    setTimeout(() => {
      setCurrentOrder(prev => (prev && prev.id === order.id ? { ...prev, status: 'processing' } : prev));
    }, 8000); // 8s to processing

    setTimeout(() => {
      setCurrentOrder(prev => (prev && prev.id === order.id ? { ...prev, status: 'out_for_delivery' } : prev));
    }, 20000); // 12s more to out for delivery

    setTimeout(() => {
      setCurrentOrder(prev => (prev && prev.id === order.id ? { ...prev, status: 'delivered' } : prev));
    }, 35000); // 15s more to delivered
  }, []);

  const clearOrder = () => {
    setCurrentOrder(null);
  };

  return (
    <OrderContext.Provider value={{ currentOrder, placeOrder, clearOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
