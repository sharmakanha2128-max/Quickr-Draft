
import React, { useState, useEffect } from 'react';
import { Retailer } from '../types';
import { ArrowLeftIcon, SpinnerIcon } from '../components/icons';
import { useAuth } from '../context/AuthContext';
import { useRetailer } from '../context/RetailerContext';

interface StoreCustomizationScreenProps {
    onBack: () => void;
}

const StoreCustomizationScreen: React.FC<StoreCustomizationScreenProps> = ({ onBack }) => {
    const { user, updateUser } = useAuth();
    const { updateStoreDetails } = useRetailer();
    
    const [store, setStore] = useState<Partial<Retailer>>({});
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (user?.userType === 'retailer' && user.retailerProfile) {
            setStore(user.retailerProfile);
        }
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setStore(prevStore => ({ ...prevStore, [name]: value }));
    };

    const validate = (): boolean => {
        const newErrors: { [key: string]: string } = {};
        if (!store.name || !store.name.trim()) newErrors.name = "Store name is required.";
        if (store.mobileNo && !/^\d{10}$/.test(store.mobileNo)) {
            newErrors.mobileNo = "Please enter a valid 10-digit mobile number.";
        }
        if (store.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(store.email)) {
            newErrors.email = "Please enter a valid email address.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate() || !store.id) return;

        setLoading(true);
        try {
            const updatedRetailer = await updateStoreDetails(store as Retailer);
            // Update the user object in auth context as well
            await updateUser({ retailerProfile: updatedRetailer });
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (err) {
            console.error("Failed to update store:", err);
            setErrors({ form: 'Failed to save changes. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    if (!user || user.userType !== 'retailer' || !store.id) {
        return (
            <div>
                 <div className="sticky top-0 bg-white z-10 p-4 shadow-sm flex items-center">
                    <button onClick={onBack} className="mr-4 p-2 rounded-full hover:bg-gray-100">
                        <ArrowLeftIcon className="w-6 h-6 text-gray-700" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-800">Error</h1>
                </div>
                <p className="p-6">You must be logged in as a retailer to customize a store.</p>
            </div>
        )
    }

    return (
        <div className="min-h-full">
            <div className="sticky top-0 bg-white z-10 p-4 shadow-sm flex items-center">
                <button onClick={onBack} className="mr-4 p-2 rounded-full hover:bg-gray-100">
                    <ArrowLeftIcon className="w-6 h-6 text-gray-700" />
                </button>
                <h1 className="text-xl font-bold text-gray-800">Customize Your Store</h1>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                 {errors.form && <p className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">{errors.form}</p>}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Store Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={store.name || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#00FF00] focus:border-[#00FF00]"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                
                <div>
                    <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Store Banner URL</label>
                    <input
                        type="text"
                        id="imageUrl"
                        name="imageUrl"
                        value={store.imageUrl || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#00FF00] focus:border-[#00FF00]"
                    />
                     <img src={store.imageUrl} alt="Store preview" className="mt-4 rounded-lg shadow-md w-full h-32 object-cover"/>
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Store Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={store.description || ''}
                        onChange={handleInputChange}
                        rows={4}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#00FF00] focus:border-[#00FF00]"
                    />
                </div>

                <div>
                    <label htmlFor="operatingHours" className="block text-sm font-medium text-gray-700">Operating Hours (e.g., 9 AM - 10 PM)</label>
                    <input
                        type="text"
                        id="operatingHours"
                        name="operatingHours"
                        value={store.operatingHours || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#00FF00] focus:border-[#00FF00]"
                    />
                </div>

                <div>
                    <label htmlFor="mobileNo" className="block text-sm font-medium text-gray-700">Store Mobile No</label>
                    <input
                        type="tel"
                        id="mobileNo"
                        name="mobileNo"
                        value={store.mobileNo || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#00FF00] focus:border-[#00FF00]"
                    />
                    {errors.mobileNo && <p className="text-red-500 text-xs mt-1">{errors.mobileNo}</p>}
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Store Email ID</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={store.email || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#00FF00] focus:border-[#00FF00]"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div className="pt-4">
                    <button type="submit" disabled={loading} className="w-full flex justify-center bg-[#00FF00] text-black font-bold py-3 px-4 rounded-lg hover:opacity-90 transition disabled:opacity-50">
                        {loading ? <SpinnerIcon className="w-6 h-6" /> : 'Save Changes'}
                    </button>
                    {saved && <p className="text-center mt-4 text-green-600 font-semibold">Changes saved successfully!</p>}
                </div>
            </form>
        </div>
    );
};

export default StoreCustomizationScreen;
