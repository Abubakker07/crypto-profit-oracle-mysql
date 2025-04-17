
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "@/components/ui/use-toast";

interface DatabaseContextType {
  isConnected: boolean;
  testConnection: () => void;
  executeQuery: (query: string) => Promise<any>;
  loading: boolean;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const DatabaseProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  // Simulate connection to MySQL (In a real app, this would be a real connection)
  useEffect(() => {
    const connectToDatabase = async () => {
      try {
        // Simulate connection delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsConnected(true);
        toast({
          title: "Database connected",
          description: "Successfully connected to MySQL database",
        });
      } catch (error) {
        console.error("Failed to connect to database:", error);
        toast({
          variant: "destructive",
          title: "Connection error",
          description: "Failed to connect to database. Please check your credentials.",
        });
      }
    };

    connectToDatabase();
  }, []);

  const testConnection = () => {
    setLoading(true);
    setTimeout(() => {
      toast({
        title: "Connection test successful",
        description: "Your MySQL database is connected and working properly.",
      });
      setLoading(false);
    }, 800);
  };

  // Simulate query execution (In a real app, this would execute actual MySQL queries)
  const executeQuery = async (query: string) => {
    setLoading(true);
    try {
      // Simulate query execution delay
      await new Promise(resolve => setTimeout(resolve, 600));
      console.log("Executing query:", query);
      
      // Return mock data based on the query
      let result;
      if (query.includes("SELECT * FROM miners")) {
        result = [
          { id: 1, name: "Antminer S19 Pro", hashrate: 110, power: 3250, release_date: "2020-05-12" },
          { id: 2, name: "Whatsminer M30S++", hashrate: 112, power: 3472, release_date: "2020-08-15" },
          { id: 3, name: "Avalon 1246", hashrate: 90, power: 3420, release_date: "2020-09-22" },
          { id: 4, name: "Innosilicon T3+", hashrate: 67, power: 3300, release_date: "2019-11-05" }
        ];
      } else if (query.includes("SELECT * FROM cryptocurrencies")) {
        result = [
          { id: 1, name: "Bitcoin", symbol: "BTC", current_price: 63250.42, algorithm: "SHA-256" },
          { id: 2, name: "Ethereum", symbol: "ETH", current_price: 3150.18, algorithm: "Ethash" },
          { id: 3, name: "Litecoin", symbol: "LTC", current_price: 85.42, algorithm: "Scrypt" },
          { id: 4, name: "Monero", symbol: "XMR", current_price: 178.65, algorithm: "RandomX" }
        ];
      } else if (query.includes("SELECT * FROM mining_pools")) {
        result = [
          { id: 1, name: "F2Pool", fee: 2.5, min_payout: 0.001, location: "Global" },
          { id: 2, name: "Antpool", fee: 2.0, min_payout: 0.001, location: "China" },
          { id: 3, name: "Poolin", fee: 2.5, min_payout: 0.0005, location: "Global" },
          { id: 4, name: "SlushPool", fee: 2.0, min_payout: 0.001, location: "Europe/US" }
        ];
      } else if (query.includes("SELECT * FROM electricity_rates")) {
        result = [
          { id: 1, country: "USA", avg_rate: 0.12, currency: "USD" },
          { id: 2, country: "China", avg_rate: 0.08, currency: "USD" },
          { id: 3, country: "Russia", avg_rate: 0.06, currency: "USD" },
          { id: 4, country: "Germany", avg_rate: 0.32, currency: "USD" }
        ];
      } else {
        result = [];
      }
      
      return result;
    } catch (error) {
      console.error("Query execution error:", error);
      toast({
        variant: "destructive",
        title: "Query error",
        description: "Failed to execute database query.",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <DatabaseContext.Provider value={{ isConnected, testConnection, executeQuery, loading }}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};
