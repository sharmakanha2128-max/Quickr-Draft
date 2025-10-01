
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User, UserType, Retailer } from '../types';
import * as googleSheetApi from '../services/googleSheetApi';

interface SignUpDetails {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password?: string;
    userType: UserType;
    storeName?: string;
    storeImage?: string;
    accountNo?: string;
    ifscCode?: string;
    bankName?: string;
    otherBankName?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  loginWithOtp: (phone: string, otp: string, userType: UserType) => Promise<void>;
  loginWithEmail: (email: string, password: string | undefined, userType: UserType) => Promise<void>;
  signUp: (details: SignUpDetails) => Promise<void>;
  logout: () => void;
  sendOtp: (phone: string) => Promise<void>;
  updateUser: (details: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const sendOtp = async (phone: string): Promise<void> => {
    setLoading(true);
    setError(null);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (!/^\d{10}$/.test(phone)) {
        setError("Invalid mobile number format.");
        setLoading(false);
        return Promise.reject("Invalid mobile number format.");
    }

    console.log(`OTP sent to ${phone}`);
    setLoading(false);
  };

  const loginWithOtp = async (phone: string, otp: string, userType: UserType): Promise<void> => {
    setLoading(true);
    setError(null);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (otp !== '1234') {
      setError("Invalid OTP. Please try again.");
      setLoading(false);
      return Promise.reject("Invalid OTP");
    }
    
    if (userType === 'retailer') {
        const retailerProfile = await googleSheetApi.getRetailerByMobile(phone);
        if (!retailerProfile) {
            setError("No retailer account found with this mobile number.");
            setLoading(false);
            return Promise.reject("Retailer not found");
        }
        const loggedInUser: User = { 
            phone, 
            userType, 
            firstName: 'Retailer', // Could be fetched from profile
            lastName: 'User',
            storeName: retailerProfile.name,
            retailerProfile: retailerProfile,
        };
        setUser(loggedInUser);
    } else {
        const loggedInUser: User = { phone, firstName: "Guest", lastName: "User", email: "guest@quickr.com", userType };
        setUser(loggedInUser);
    }
    setLoading(false);
  };
  
  const loginWithEmail = async (email: string, password: string | undefined, userType: UserType): Promise<void> => {
    setLoading(true);
    setError(null);
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (email === 'test@example.com' && password === 'password123') {
        const loggedInUser: User = { email, firstName: "Test", lastName: "User", phone: "9876543210", userType };
        setUser(loggedInUser);
    } else {
        setError("Invalid email or password.");
        setLoading(false);
        return Promise.reject("Invalid credentials");
    }
    setLoading(false);
  };

  const signUp = async (details: SignUpDetails): Promise<void> => {
    setLoading(true);
    setError(null);

    // For retailers, check if mobile already exists
    if (details.userType === 'retailer') {
        const existingRetailer = await googleSheetApi.getRetailerByMobile(details.phone);
        if (existingRetailer) {
            setError("A retailer with this mobile number already exists.");
            setLoading(false);
            return Promise.reject("Retailer exists");
        }
    }

    // Simulate creation
    let newRetailerProfile: Retailer | undefined = undefined;
    if (details.userType === 'retailer' && details.storeName) {
        const finalBankName = details.bankName === 'Other' ? details.otherBankName : details.bankName;
        newRetailerProfile = await googleSheetApi.addRetailer({
            name: details.storeName,
            mobileNo: details.phone,
            email: details.email,
            imageUrl: details.storeImage,
            accountNo: details.accountNo,
            ifscCode: details.ifscCode,
            bankName: finalBankName,
        });
    }

    setUser({
        firstName: details.firstName,
        lastName: details.lastName,
        email: details.email,
        phone: details.phone,
        userType: details.userType,
        storeName: details.storeName,
        retailerProfile: newRetailerProfile,
    });
    setLoading(false);
  };
  
  const updateUser = async (details: Partial<User>): Promise<void> => {
    setLoading(true);
    setError(null);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUser(prevUser => {
        if (!prevUser) {
            setLoading(false);
            throw new Error("No user to update");
        }
        const updatedUser = { ...prevUser, ...details };

        // If retailer profile is part of the update, update it specifically
        if (details.retailerProfile) {
            updatedUser.retailerProfile = { ...prevUser.retailerProfile, ...details.retailerProfile };
        }

        return updatedUser;
    });
    setLoading(false);
  }

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, sendOtp, loginWithOtp, loginWithEmail, signUp, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
