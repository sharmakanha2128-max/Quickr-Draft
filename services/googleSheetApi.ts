
import { retailers as mockRetailers } from '../data/mockData';
import { Retailer } from '../types';

const DB_KEY = 'quickr_retailers_db';
const NETWORK_DELAY = 800;

// This is an in-memory store, hydrated from localStorage, to simulate a database.
let retailersDb: Retailer[] = [];

// Load initial data from localStorage or mock data
const savedDb = localStorage.getItem(DB_KEY);
if (savedDb) {
    try {
        retailersDb = JSON.parse(savedDb);
    } catch (e) {
        console.error("Failed to parse retailers DB from localStorage", e);
        retailersDb = JSON.parse(JSON.stringify(mockRetailers));
        localStorage.setItem(DB_KEY, JSON.stringify(retailersDb));
    }
} else {
    retailersDb = JSON.parse(JSON.stringify(mockRetailers));
    localStorage.setItem(DB_KEY, JSON.stringify(retailersDb));
}

const saveDb = () => {
    localStorage.setItem(DB_KEY, JSON.stringify(retailersDb));
};


// Simulate fetching all retailers from a Google Sheet.
export const getRetailers = (): Promise<Retailer[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(JSON.parse(JSON.stringify(retailersDb)));
        }, NETWORK_DELAY);
    });
};

// Simulate fetching a single retailer by their unique mobile number.
export const getRetailerByMobile = (mobileNo: string): Promise<Retailer | null> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const retailer = retailersDb.find(r => r.mobileNo === mobileNo);
            resolve(retailer ? JSON.parse(JSON.stringify(retailer)) : null);
        }, NETWORK_DELAY / 2);
    });
};

// Simulate updating a retailer's profile in the sheet.
export const updateRetailer = (updatedData: Retailer): Promise<Retailer> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const index = retailersDb.findIndex(r => r.id === updatedData.id);
            if (index === -1) {
                return reject(new Error("Retailer not found"));
            }
            retailersDb[index] = { ...retailersDb[index], ...updatedData };
            saveDb();
            resolve(JSON.parse(JSON.stringify(retailersDb[index])));
        }, NETWORK_DELAY);
    });
};

// Simulate adding a new retailer (a new row) to the sheet.
export const addRetailer = (
    newRetailerData: { 
        name: string; 
        mobileNo: string; 
        email: string;
        imageUrl?: string;
        accountNo?: string;
        ifscCode?: string;
        bankName?: string;
    }
): Promise<Retailer> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newRetailer: Retailer = {
                id: `ret${Date.now()}`,
                name: newRetailerData.name,
                rating: 0,
                imageUrl: newRetailerData.imageUrl || 'https://picsum.photos/seed/newstore/400/200',
                products: [], // New retailers start with no products
                mobileNo: newRetailerData.mobileNo,
                email: newRetailerData.email,
                operatingHours: 'Not set',
                description: 'Welcome to our new store!',
                status: 'pending', // New retailers are pending approval
                accountNo: newRetailerData.accountNo,
                ifscCode: newRetailerData.ifscCode,
                bankName: newRetailerData.bankName,
            };
            retailersDb.push(newRetailer);
            saveDb();
            resolve(JSON.parse(JSON.stringify(newRetailer)));
        }, NETWORK_DELAY);
    });
};