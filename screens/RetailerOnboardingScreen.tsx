
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowLeftIcon, SpinnerIcon } from '../components/icons';

interface RetailerOnboardingScreenProps {
    onNavigate: (view: string) => void;
    onBack: () => void;
}

const bankNames = [
    'State Bank of India',
    'HDFC Bank',
    'ICICI Bank',
    'Punjab National Bank',
    'Axis Bank',
    'Kotak Mahindra Bank',
    'Bank of Baroda',
    'Other'
];

const RetailerOnboardingScreen: React.FC<RetailerOnboardingScreenProps> = ({ onNavigate, onBack }) => {
    const { signUp, loading, error } = useAuth();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        mobileNo: '',
        storeName: '',
        password: '',
        storeImage: '',
        accountNo: '',
        ifscCode: '',
        bankName: bankNames[0],
        otherBankName: '',
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [imagePreviewError, setImagePreviewError] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === 'storeImage') {
            setImagePreviewError(false);
        }
    };

    const validate = (): boolean => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.firstName.trim()) newErrors.firstName = "First name is required.";
        if (!formData.email.trim()) newErrors.email = "Email is required.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Please enter a valid email address.";
        if (!formData.mobileNo.trim()) newErrors.mobileNo = "Mobile number is required.";
        else if (!/^\d{10}$/.test(formData.mobileNo)) newErrors.mobileNo = "Please enter a valid 10-digit mobile number.";
        if (!formData.storeName.trim()) newErrors.storeName = "Store name is required.";
        if (!formData.password || formData.password.length < 6) newErrors.password = "Password must be at least 6 characters long.";
        
        if (!formData.accountNo.trim()) newErrors.accountNo = "Account number is required.";
        else if (!/^\d+$/.test(formData.accountNo)) newErrors.accountNo = "Account number must only contain digits.";
        
        if (!formData.ifscCode.trim()) newErrors.ifscCode = "IFSC code is required.";
        else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/i.test(formData.ifscCode)) newErrors.ifscCode = "Please enter a valid 11-character IFSC code.";

        if (formData.bankName === 'Other' && !formData.otherBankName.trim()) {
            newErrors.otherBankName = "Please specify the bank name.";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        
        try {
            await signUp({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.mobileNo,
                password: formData.password,
                userType: 'retailer',
                storeName: formData.storeName,
                storeImage: formData.storeImage,
                accountNo: formData.accountNo,
                ifscCode: formData.ifscCode,
                bankName: formData.bankName,
                otherBankName: formData.otherBankName,
            });
            onNavigate('account');
        } catch (err) {
            console.error("Signup failed:", err);
        }
    };

    return (
        <div className="min-h-full">
            <div className="sticky top-0 bg-white z-10 p-4 shadow-sm flex items-center">
                <button onClick={onBack} className="mr-4 p-2 rounded-full hover:bg-gray-100">
                    <ArrowLeftIcon className="w-6 h-6 text-gray-700" />
                </button>
                <h1 className="text-xl font-bold text-gray-800">Retailer Signup</h1>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <h2 className="text-2xl font-bold text-gray-800">Welcome!</h2>
                <p className="text-gray-500">Let's get your store set up.</p>

                {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg text-sm mb-4">{error}</p>}
                
                <div className="space-y-4 p-4 bg-white rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold border-b pb-2">Personal Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                            <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#00FF00] focus:border-[#00FF00]"/>
                            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                        </div>
                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                            <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#00FF00] focus:border-[#00FF00]"/>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#00FF00] focus:border-[#00FF00]"/>
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div>
                        <label htmlFor="mobileNo" className="block text-sm font-medium text-gray-700">Mobile Number</label>
                        <input type="tel" id="mobileNo" name="mobileNo" value={formData.mobileNo} onChange={handleInputChange} placeholder="10-digit number" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#00FF00] focus:border-[#00FF00]"/>
                        {errors.mobileNo && <p className="text-red-500 text-xs mt-1">{errors.mobileNo}</p>}
                    </div>

                     <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" id="password" name="password" value={formData.password} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#00FF00] focus:border-[#00FF00]"/>
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>
                </div>

                <div className="space-y-4 p-4 bg-white rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold border-b pb-2">Store Details</h3>
                    <div>
                        <label htmlFor="storeName" className="block text-sm font-medium text-gray-700">Store Name</label>
                        <input type="text" id="storeName" name="storeName" value={formData.storeName} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#00FF00] focus:border-[#00FF00]"/>
                        {errors.storeName && <p className="text-red-500 text-xs mt-1">{errors.storeName}</p>}
                    </div>
                    <div>
                        <label htmlFor="storeImage" className="block text-sm font-medium text-gray-700">Store Image URL</label>
                        <input type="text" id="storeImage" name="storeImage" value={formData.storeImage} onChange={handleInputChange} placeholder="https://example.com/image.jpg" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#00FF00] focus:border-[#00FF00]"/>
                         {formData.storeImage && (
                            <div className="mt-4">
                                <p className="text-xs text-gray-500 mb-1">Image Preview:</p>
                                <img 
                                    src={imagePreviewError ? 'https://via.placeholder.com/400x200?text=Invalid+Image+URL' : formData.storeImage} 
                                    alt="Store preview" 
                                    className="rounded-lg shadow-md w-full h-32 object-cover"
                                    onError={() => setImagePreviewError(true)}
                                />
                            </div>
                         )}
                    </div>
                </div>

                <div className="space-y-4 p-4 bg-white rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold border-b pb-2">Payment Details</h3>
                    <div>
                        <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">Bank Name</label>
                        <select id="bankName" name="bankName" value={formData.bankName} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#00FF00] focus:border-[#00FF00]">
                            {bankNames.map(bank => <option key={bank} value={bank}>{bank}</option>)}
                        </select>
                    </div>

                    {formData.bankName === 'Other' && (
                        <div>
                            <label htmlFor="otherBankName" className="block text-sm font-medium text-gray-700">Please Specify Bank</label>
                            <input type="text" id="otherBankName" name="otherBankName" value={formData.otherBankName} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#00FF00] focus:border-[#00FF00]"/>
                            {errors.otherBankName && <p className="text-red-500 text-xs mt-1">{errors.otherBankName}</p>}
                        </div>
                    )}

                     <div>
                        <label htmlFor="accountNo" className="block text-sm font-medium text-gray-700">Account Number</label>
                        <input type="text" id="accountNo" name="accountNo" value={formData.accountNo} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#00FF00] focus:border-[#00FF00]"/>
                        {errors.accountNo && <p className="text-red-500 text-xs mt-1">{errors.accountNo}</p>}
                    </div>
                     <div>
                        <label htmlFor="ifscCode" className="block text-sm font-medium text-gray-700">IFSC Code</label>
                        <input type="text" id="ifscCode" name="ifscCode" value={formData.ifscCode} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#00FF00] focus:border-[#00FF00]"/>
                        {errors.ifscCode && <p className="text-red-500 text-xs mt-1">{errors.ifscCode}</p>}
                    </div>
                </div>

                <div className="pt-4">
                    <button type="submit" disabled={loading} className="w-full flex justify-center bg-[#00FF00] text-black font-bold py-3 px-4 rounded-lg hover:opacity-90 transition disabled:opacity-50">
                        {loading ? <SpinnerIcon className="w-6 h-6"/> : 'Complete Signup'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RetailerOnboardingScreen;
