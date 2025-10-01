
import React from 'react';
import { useOrder } from '../context/OrderContext';
import { OrderStatus } from '../types';
import { ArrowLeftIcon, ClipboardListIcon, CubeIcon, TruckIcon, HomeIcon, CheckCircleIcon } from '../components/icons';

interface OrderTrackingScreenProps {
  onNavigate: (view: string) => void;
}

const statusConfig: { [key in OrderStatus]: { title: string; description: string; icon: React.FC<{className?: string}> } } = {
  placed: {
    title: 'Order Placed',
    description: 'We have received your order.',
    icon: ClipboardListIcon,
  },
  processing: {
    title: 'Processing',
    description: 'Your items are being gathered.',
    icon: CubeIcon,
  },
  out_for_delivery: {
    title: 'Out for Delivery',
    description: 'Your order is on its way!',
    icon: TruckIcon,
  },
  delivered: {
    title: 'Delivered',
    description: 'Enjoy your groceries!',
    icon: HomeIcon,
  },
};

const ALL_STATUSES: OrderStatus[] = ['placed', 'processing', 'out_for_delivery', 'delivered'];

const StatusStep: React.FC<{ stepStatus: OrderStatus; isActive: boolean; isCompleted: boolean; isLast: boolean; }> = ({ stepStatus, isActive, isCompleted, isLast }) => {
  const config = statusConfig[stepStatus];
  const Icon = config.icon;

  return (
    <div className="flex">
      <div className="flex flex-col items-center mr-4">
        <div>
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${isCompleted || isActive ? 'bg-[#00FF00]' : 'bg-gray-300'}`}>
            {isCompleted ? <CheckCircleIcon className="w-8 h-8 text-white" /> : <Icon className={`w-6 h-6 ${isActive ? 'text-black' : 'text-white'}`} />}
          </div>
        </div>
        {!isLast && <div className={`w-0.5 h-full ${isCompleted ? 'bg-[#00FF00]' : 'bg-gray-300'}`}></div>}
      </div>
      <div className={`pb-8 ${isActive ? 'font-bold' : ''}`}>
        <p className={`mb-1 text-lg ${isCompleted || isActive ? 'text-gray-900' : 'text-gray-500'}`}>{config.title}</p>
        <p className="text-sm text-gray-600">{config.description}</p>
      </div>
    </div>
  );
};

const OrderTrackingScreen: React.FC<OrderTrackingScreenProps> = ({ onNavigate }) => {
  const { currentOrder, clearOrder } = useOrder();

  if (!currentOrder) {
    return (
      <div className="p-4 h-full flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold">No Active Order</h1>
        <p className="text-gray-600 my-4">You don't have any orders being tracked right now.</p>
        <button
          onClick={() => onNavigate('home')}
          className="bg-[#00FF00] text-black font-bold py-3 px-6 rounded-lg hover:opacity-90 transition"
        >
          Shop Now
        </button>
      </div>
    );
  }

  const currentStatusIndex = ALL_STATUSES.indexOf(currentOrder.status);

  const handleDone = () => {
    clearOrder();
    onNavigate('home');
  }

  return (
    <div className="min-h-full">
      <div className="sticky top-0 bg-white z-10 p-4 shadow-sm flex items-center">
        <button onClick={() => onNavigate('home')} className="mr-4 p-2 rounded-full hover:bg-gray-100">
          <ArrowLeftIcon className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Track Order</h1>
      </div>

      <div className="p-4">
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex justify-between items-center text-center">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-bold text-sm text-gray-800">{currentOrder.id.split('_')[1]}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Price</p>
              <p className="font-bold text-sm text-gray-800">₹{currentOrder.totalPrice.toFixed(2)}</p>
            </div>
             <div>
              <p className="text-sm text-gray-500">Est. Delivery</p>
              <p className="font-bold text-sm text-gray-800">{currentOrder.estimatedDelivery}</p>
            </div>
          </div>
           <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
              <div className="bg-[#00FF00] h-2.5 rounded-full" style={{ width: `${((currentStatusIndex + 1) / ALL_STATUSES.length) * 100}%`, transition: 'width 1s ease-in-out' }}></div>
            </div>
        </div>

        <div className="p-4 bg-white rounded-lg shadow-md">
          {ALL_STATUSES.map((status, index) => (
            <StatusStep
              key={status}
              stepStatus={status}
              isActive={index === currentStatusIndex}
              isCompleted={index < currentStatusIndex}
              isLast={index === ALL_STATUSES.length - 1}
            />
          ))}
        </div>

        {currentOrder.status === 'delivered' && (
            <button onClick={handleDone} className="mt-8 w-full bg-[#00FF00] text-black font-bold py-3 rounded-lg text-lg hover:opacity-90 transition">
                Done
            </button>
        )}
      </div>
    </div>
  );
};

export default OrderTrackingScreen;
