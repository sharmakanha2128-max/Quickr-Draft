
import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { Retailer } from '../types';
import * as googleSheetApi from '../services/googleSheetApi';

interface RetailerContextType {
  retailers: Retailer[];
  loading: boolean;
  error: string | null;
  fetchRetailers: () => Promise<void>;
  updateStoreDetails: (updatedRetailer: Retailer) => Promise<Retailer>;
}

const RetailerContext = createContext<RetailerContextType | undefined>(undefined);

export const RetailerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRetailers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await googleSheetApi.getRetailers();
      setRetailers(data);
    } catch (err) {
      setError("Failed to fetch store data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRetailers();
  }, [fetchRetailers]);

  const updateStoreDetails = async (updatedRetailer: Retailer): Promise<Retailer> => {
    setLoading(true);
    try {
        const result = await googleSheetApi.updateRetailer(updatedRetailer);
        setRetailers(prevRetailers => 
            prevRetailers.map(r => r.id === result.id ? result : r)
        );
        setLoading(false);
        return result;
    } catch (err) {
        setLoading(false);
        console.error(err);
        throw new Error("Failed to update store details");
    }
  };

  return (
    <RetailerContext.Provider value={{ retailers, loading, error, fetchRetailers, updateStoreDetails }}>
      {children}
    </RetailerContext.Provider>
  );
};

export const useRetailer = (): RetailerContextType => {
  const context = useContext(RetailerContext);
  if (context === undefined) {
    throw new Error('useRetailer must be used within a RetailerProvider');
  }
  return context;
};
