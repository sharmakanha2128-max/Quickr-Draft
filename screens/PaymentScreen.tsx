import React from 'react';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';
import { ArrowLeftIcon } from '../components/icons';

interface PaymentScreenProps {
    onNavigate: (view: string) => void;
    onBack: () => void;
}

const paymentOptions = [
    { name: 'Paytm', iconUrl: 'https://img.icons8.com/color/96/paytm.png' },
    { name: 'PhonePe', iconUrl: 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/phonepe-logo-icon.png' },
    { name: 'Google Pay', iconUrl: 'https://img.icons8.com/color/96/google-pay.png' },
    { name: 'Pay with Any UPI App', iconUrl: 'https://img.icons8.com/color/96/bhim-upi.png' },
];

const PaymentScreen: React.FC<PaymentScreenProps> = ({ onNavigate, onBack }) => {
    const { cartItems, totalPrice, clearCart } = useCart();
    const { placeOrder } = useOrder();

    const handlePayment = () => {
        if (cartItems.length > 0) {
            placeOrder(cartItems, totalPrice);
            clearCart();
            onNavigate('orderTracking');
        }
    };

    return (
        <div className="min-h-full flex flex-col">
            <div className="sticky top-0 bg-white z-10 p-4 shadow-sm flex items-center">
                <button onClick={onBack} className="mr-4 p-2 rounded-full hover:bg-gray-100">
                    <ArrowLeftIcon className="w-6 h-6 text-gray-700" />
                </button>
                <h1 className="text-xl font-bold text-gray-800">Select Payment Method</h1>
            </div>

            <div className="p-4 flex-grow">
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-700">Amount Payable:</span>
                        <span className="text-2xl font-bold text-gray-900">₹{totalPrice.toFixed(2)}</span>
                    </div>
                </div>

                <h2 className="text-lg font-bold text-gray-800 mb-4">Choose a payment option</h2>

                <div className="space-y-3">
                    {paymentOptions.map((option) => (
                        <button
                            key={option.name}
                            onClick={handlePayment}
                            className="w-full flex items-center p-4 bg-white rounded-lg shadow-sm text-left hover:bg-gray-50 transition"
                        >
                            <img src={option.iconUrl} alt={option.name} className="w-10 h-10 mr-4 object-contain" />
                            <span className="font-semibold text-gray-800 flex-grow">{option.name}</span>
                            <span className="font-bold text-[#00FF00]">Pay Now</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PaymentScreen;