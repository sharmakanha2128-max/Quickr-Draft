

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { SpinnerIcon, UserIcon, OrderListIcon, HeartIcon, AddressBookIcon, PrescriptionIcon, ChevronRightIcon, CubeIcon, ClipboardListIcon, ArrowLeftIcon } from '../components/icons';

type LoginMethod = 'otp' | 'email';
type AuthView = 'login' | 'signup';
type UserType = 'customer' | 'retailer' | 'delivery';

interface AccountScreenProps {
    onNavigate: (view: string) => void;
}

const AccountScreen: React.FC<AccountScreenProps> = ({ onNavigate }) => {
    const { user, loading, error: authError, sendOtp, loginWithOtp, loginWithEmail, signUp, logout, updateUser } = useAuth();
    
    const [loginMethod, setLoginMethod] = useState<LoginMethod>('otp');
    const [authView, setAuthView] = useState<AuthView>('login');
    const [userType, setUserType] = useState<UserType>('customer');

    // Form states
    const [phoneInput, setPhoneInput] = useState('');
    const [otp, setOtp] = useState<string[]>(new Array(4).fill(''));
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    
    const [otpSent, setOtpSent] = useState(false);
    const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // State for editing user details
    const [isEditingPhone, setIsEditingPhone] = useState(false);
    const [editPhone, setEditPhone] = useState(user?.phone || '');
    const [editError, setEditError] = useState('');

    useEffect(() => {
        if (userType === 'retailer' || userType === 'delivery') {
            setLoginMethod('email');
        } else {
            setLoginMethod('otp');
        }
    }, [userType]);


    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await sendOtp(phoneInput);
            setOtpSent(true);
        } catch (err) {
            console.error(err);
        }
    };
    
    const handleOtpLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const finalOtp = otp.join('');
        loginWithOtp(phoneInput, finalOtp, userType);
    };

    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (authView === 'login') {
            loginWithEmail(email, password, userType);
        } else {
            signUp({ firstName, lastName, email, phone: phoneInput, password, userType });
        }
    };

    const handleOtpChange = (element: HTMLInputElement, index: number) => {
        if (isNaN(Number(element.value))) return;

        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        // Focus next input
        if (element.nextSibling && element.value) {
            (element.nextSibling as HTMLInputElement).focus();
        }
    };
    
    const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpInputRefs.current[index - 1]?.focus();
        }
    };
    
    const handleToggleAuthView = () => {
        if (authView === 'login' && userType === 'retailer') {
            onNavigate('retailerOnboarding');
        } else {
            setAuthView(authView === 'login' ? 'signup' : 'login');
        }
    };

    const handlePhoneUpdate = async () => {
        setEditError('');
        if (!/^\d{10}$/.test(editPhone)) {
            setEditError("Invalid mobile number format. Must be 10 digits.");
            return;
        }
        try {
            await updateUser({ phone: editPhone });
            setIsEditingPhone(false);
        } catch (err) {
            setEditError("Failed to update phone number.");
        }
    };

    if (user) {
        if(user.userType === 'retailer') {
            const retailerMenuItems = [
                { name: "Customize Your Store", icon: CubeIcon, view: 'storeCustomization' },
                { name: "Manage Products", icon: ClipboardListIcon, view: 'manageProducts' },
                { name: "Incoming Orders", icon: OrderListIcon, view: 'incomingOrders' },
            ];
            
            return (
                 <div className="p-6 pt-16 space-y-8 relative">
                    <button onClick={() => onNavigate('home')} className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-100">
                        <ArrowLeftIcon className="w-6 h-6 text-gray-700" />
                    </button>

                    <div className="flex items-center">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                            <UserIcon className="w-10 h-10 text-gray-500" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">{user.firstName} {user.lastName}</h2>
                            <p className="text-gray-600">Retailer Account</p>
                            {user.storeName && <p className="text-sm font-semibold text-gray-700 mt-1">{user.storeName}</p>}
                        </div>
                    </div>

                    {user.retailerProfile?.status === 'pending' ? (
                        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg shadow-sm" role="alert">
                            <p className="font-bold">Store Under Review</p>
                            <p>Your store is currently being reviewed by our team. You will be notified once it is approved and live. This usually takes up to 24 hours.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Store Management</h3>
                            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                               {retailerMenuItems.map((item, index) => (
                                   <button 
                                        key={item.name} 
                                        onClick={() => onNavigate(item.view)}
                                        className={`flex items-center justify-between w-full p-4 text-left transition-colors duration-200 hover:bg-gray-50 ${index < retailerMenuItems.length - 1 ? 'border-b border-gray-100' : ''}`}>
                                       <div className="flex items-center">
                                           <item.icon className="w-6 h-6 text-gray-500" />
                                           <span className="ml-4 font-semibold text-gray-700">{item.name}</span>
                                       </div>
                                       <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                                   </button>
                               ))}
                            </div>
                        </div>
                    )}

                    <button 
                        onClick={logout}
                        className="w-full bg-red-500 text-white font-bold py-3 rounded-lg hover:bg-red-600 transition"
                    >
                        Logout
                    </button>
                </div>
            )
        }

        // Default to customer view
        const infoItems = [
            { name: "Your Orders", icon: OrderListIcon },
            { name: "Your Wishlist", icon: HeartIcon },
            { name: "Address Book", icon: AddressBookIcon },
            { name: "Your Prescriptions", icon: PrescriptionIcon },
        ];
        return (
            <div className="p-6 pt-16 space-y-8 relative">
                <button onClick={() => onNavigate('home')} className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-100">
                    <ArrowLeftIcon className="w-6 h-6 text-gray-700" />
                </button>
                <div className="flex items-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                        <UserIcon className="w-10 h-10 text-gray-500" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">{user.firstName} {user.lastName}</h2>
                        <p className="text-gray-600">{user.email || user.phone}</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Account Details</h3>
                    <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
                        <div>
                            <label className="text-xs text-gray-500">Name</label>
                            <p className="font-semibold text-gray-800">{user.firstName} {user.lastName}</p>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500">Email</label>
                            <p className="font-semibold text-gray-800">{user.email || 'Not provided'}</p>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500">Mobile Number</label>
                            {isEditingPhone ? (
                                <div className="mt-1">
                                    <input 
                                        type="tel"
                                        value={editPhone}
                                        onChange={(e) => setEditPhone(e.target.value)}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#00FF00] focus:border-[#00FF00]"
                                        placeholder="Enter 10-digit number"
                                    />
                                    {editError && <p className="text-red-500 text-xs mt-1">{editError}</p>}
                                    <div className="flex space-x-2 mt-2">
                                        <button onClick={handlePhoneUpdate} disabled={loading} className="flex-1 bg-[#00FF00] text-black font-bold py-2 px-4 rounded-lg hover:opacity-90 transition disabled:opacity-50">
                                           {loading ? <SpinnerIcon className="w-5 h-5 mx-auto"/> : 'Save'}
                                        </button>
                                        <button onClick={() => setIsEditingPhone(false)} className="flex-1 bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition">
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between">
                                    <p className="font-semibold text-gray-800">{user.phone || 'Not provided'}</p>
                                    <button onClick={() => { setIsEditingPhone(true); setEditPhone(user.phone || ''); setEditError(''); }} className="text-sm font-semibold text-[#0504c7]">
                                        {user.phone ? 'Edit' : 'Add'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Your Information</h3>
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                       {infoItems.map((item, index) => (
                           <button 
                                key={item.name} 
                                className={`flex items-center justify-between w-full p-4 text-left transition-colors duration-200 hover:bg-gray-50 ${index < infoItems.length - 1 ? 'border-b border-gray-100' : ''}`}>
                               <div className="flex items-center">
                                   <item.icon className="w-6 h-6 text-gray-500" />
                                   <span className="ml-4 font-semibold text-gray-700">{item.name}</span>
                               </div>
                               <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                           </button>
                       ))}
                    </div>
                </div>

                <button 
                    onClick={logout}
                    className="w-full bg-red-500 text-white font-bold py-3 rounded-lg hover:bg-red-600 transition"
                >
                    Logout
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 relative pt-16">
             <button onClick={() => onNavigate('home')} className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-100">
                <ArrowLeftIcon className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {authView === 'login' ? 'Welcome Back!' : 'Create Account'}
            </h1>
            <p className="text-gray-500 mb-6">
                {authView === 'login' ? 'Login to continue your shopping spree.' : 'Sign up to get started.'}
            </p>

            <div className="flex bg-gray-200 rounded-lg p-1 mb-6">
                <button 
                    onClick={() => setUserType('customer')}
                    className={`w-1/3 py-2 rounded-md font-semibold text-sm transition ${userType === 'customer' ? 'bg-white shadow' : 'text-gray-600'}`}
                >
                    Customer
                </button>
                <button 
                    onClick={() => setUserType('retailer')}
                    className={`w-1/3 py-2 rounded-md font-semibold text-sm transition ${userType === 'retailer' ? 'bg-white shadow' : 'text-gray-600'}`}
                >
                    Retailer
                </button>
                 <button 
                    onClick={() => setUserType('delivery')}
                    className={`w-1/3 py-2 rounded-md font-semibold text-sm transition ${userType === 'delivery' ? 'bg-white shadow' : 'text-gray-600'}`}
                >
                    Delivery
                </button>
            </div>
            
            {userType === 'customer' && (
                <div className="flex bg-gray-200 rounded-lg p-1 mb-6">
                    <button 
                        onClick={() => { setLoginMethod('otp'); setAuthView('login'); }}
                        className={`w-1/2 py-2 rounded-md font-semibold text-sm transition ${loginMethod === 'otp' ? 'bg-white shadow' : 'text-gray-600'}`}
                    >
                        Mobile & OTP
                    </button>
                    <button 
                        onClick={() => setLoginMethod('email')}
                        className={`w-1/2 py-2 rounded-md font-semibold text-sm transition ${loginMethod === 'email' ? 'bg-white shadow' : 'text-gray-600'}`}
                    >
                        Email & Password
                    </button>
                </div>
            )}

            {authError && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{authError}</p>}

            {(loginMethod === 'otp' && userType === 'customer') && (
                <form onSubmit={otpSent ? handleOtpLogin : handleSendOtp} className="space-y-4">
                    {!otpSent ? (
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Mobile Number</label>
                            <input type="tel" id="phone" value={phoneInput} onChange={e => setPhoneInput(e.target.value)} placeholder="Enter 10-digit number" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#00FF00] focus:border-[#00FF00]"/>
                        </div>
                    ) : (
                        <div>
                            <label htmlFor="otp" className="block text-sm font-medium text-gray-700">Enter OTP</label>
                            <p className="text-xs text-gray-500 mb-2">An OTP was sent to {phoneInput}. <button onClick={() => setOtpSent(false)} className="text-[#0504c7] font-semibold">Change</button></p>
                            <div className="flex justify-between space-x-2">
                                {otp.map((data, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        name="otp"
                                        maxLength={1}
                                        value={data}
                                        onChange={e => handleOtpChange(e.target, index)}
                                        onKeyDown={e => handleOtpKeyDown(e, index)}
                                        ref={el => { otpInputRefs.current[index] = el; }}
                                        className="w-1/4 h-14 text-center text-2xl font-semibold border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00FF00] focus:border-[#00FF00]"
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                     <button type="submit" disabled={loading} className="w-full flex justify-center bg-[#00FF00] text-black font-bold py-3 px-4 rounded-lg hover:opacity-90 transition disabled:opacity-50 mt-6">
                        {loading ? <SpinnerIcon className="w-6 h-6"/> : (otpSent ? 'Verify & Login' : 'Send OTP')}
                    </button>
                </form>
            )}

            {loginMethod === 'email' && (
                 <form onSubmit={handleEmailSubmit} className="space-y-4">
                     {authView === 'signup' && userType === 'customer' && (
                         <>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                                    <input type="text" id="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#00FF00] focus:border-[#00FF00]"/>
                                </div>
                                <div>
                                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                                    <input type="text" id="lastName" value={lastName} onChange={e => setLastName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#00FF00] focus:border-[#00FF00]"/>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="phone-signup" className="block text-sm font-medium text-gray-700">Mobile Number</label>
                                <input type="tel" id="phone-signup" value={phoneInput} onChange={e => setPhoneInput(e.target.value)} placeholder="Enter 10-digit number" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#00FF00] focus:border-[#00FF00]"/>
                            </div>
                         </>
                     )}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#00FF00] focus:border-[#00FF00]"/>
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#00FF00] focus:border-[#00FF00]"/>
                    </div>
                     <button type="submit" disabled={loading} className="w-full flex justify-center bg-[#00FF00] text-black font-bold py-3 px-4 rounded-lg hover:opacity-90 transition disabled:opacity-50">
                        {loading ? <SpinnerIcon className="w-6 h-6"/> : (authView === 'login' ? 'Login' : 'Sign Up')}
                    </button>
                    <p className="text-center text-sm">
                        {authView === 'login' ? "Don't have an account?" : "Already have an account?"}
                        <button type="button" onClick={handleToggleAuthView} className="font-semibold text-[#0504c7] ml-1">
                            {authView === 'login' ? 'Sign Up' : 'Login'}
                        </button>
                    </p>
                 </form>
            )}
        </div>
    );
};

export default AccountScreen;