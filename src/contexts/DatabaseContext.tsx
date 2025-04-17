
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "@/components/ui/use-toast";
import { ProfitabilityResult, User } from '@/types';

interface DatabaseContextType {
  isConnected: boolean;
  testConnection: () => void;
  executeQuery: (query: string) => Promise<any>;
  saveCalculation: (result: ProfitabilityResult) => Promise<number>;
  getCalculationHistory: (userId: number) => Promise<ProfitabilityResult[]>;
  getUserByCredentials: (email: string, password: string) => Promise<User | null>;
  registerUser: (username: string, email: string, password: string) => Promise<User | null>;
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

  // Simulate query execution
  const executeQuery = async (query: string) => {
    setLoading(true);
    try {
      // Simulate query execution delay
      await new Promise(resolve => setTimeout(resolve, 600));
      console.log("Executing query:", query);
      
      let result;
      if (query.includes("SELECT * FROM miners")) {
        result = [
          { id: 1, name: "Antminer S19 Pro", hashrate: 110, power: 3250 },
          { id: 2, name: "Whatsminer M30S++", hashrate: 112, power: 3472 },
          { id: 3, name: "Avalon 1246", hashrate: 90, power: 3420 },
          { id: 4, name: "Innosilicon T3+", hashrate: 67, power: 3300 }
        ];
      } else if (query.includes("SELECT * FROM cryptocurrencies")) {
        result = [
          { id: 1, name: "Bitcoin", symbol: "BTC", current_price: 63250.42, algorithm: "SHA-256" },
          { id: 2, name: "Ethereum", symbol: "ETH", current_price: 3150.18, algorithm: "Ethash" },
          { id: 3, name: "Litecoin", symbol: "LTC", current_price: 85.42, algorithm: "Scrypt" },
          { id: 4, name: "Monero", symbol: "XMR", current_price: 178.65, algorithm: "RandomX" }
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

  // Save calculation to history
  const saveCalculation = async (result: ProfitabilityResult): Promise<number> => {
    setLoading(true);
    try {
      // In a real implementation, this would insert the calculation into MySQL
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simulate an ID being returned from the database
      const id = Math.floor(Math.random() * 1000) + 1;
      
      toast({
        title: "Calculation saved",
        description: "Your calculation has been saved to history.",
      });
      
      return id;
    } catch (error) {
      console.error("Failed to save calculation:", error);
      toast({
        variant: "destructive",
        title: "Save error",
        description: "Failed to save calculation to history.",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get calculation history for a user
  const getCalculationHistory = async (userId: number): Promise<ProfitabilityResult[]> => {
    setLoading(true);
    try {
      // Simulate fetching from database
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data for calculation history
      const history: ProfitabilityResult[] = [
        {
          id: 1,
          user_id: userId,
          miner_id: 1,
          miner_name: "Antminer S19 Pro",
          crypto_id: 1,
          crypto_name: "Bitcoin",
          hashrate: 110,
          power_consumption: 3250,
          electricity_rate: 0.12,
          daily_revenue: 15.42,
          daily_cost: 9.36,
          daily_profit: 6.06,
          monthly_profit: 181.80,
          calculation_date: new Date().toISOString()
        },
        {
          id: 2,
          user_id: userId,
          miner_id: 2,
          miner_name: "Whatsminer M30S++",
          crypto_id: 1,
          crypto_name: "Bitcoin",
          hashrate: 112,
          power_consumption: 3472,
          electricity_rate: 0.10,
          daily_revenue: 15.72,
          daily_cost: 8.33,
          daily_profit: 7.39,
          monthly_profit: 221.70,
          calculation_date: new Date(Date.now() - 86400000).toISOString() // 1 day ago
        },
        {
          id: 3,
          user_id: userId,
          miner_id: 1,
          miner_name: "Antminer S19 Pro",
          crypto_id: 2,
          crypto_name: "Ethereum",
          hashrate: 110,
          power_consumption: 3250,
          electricity_rate: 0.15,
          daily_revenue: 16.20,
          daily_cost: 11.70,
          daily_profit: 4.50,
          monthly_profit: 135.00,
          calculation_date: new Date(Date.now() - 172800000).toISOString() // 2 days ago
        }
      ];
      
      return history.slice(0, 5); // Return only the last 5 entries
    } catch (error) {
      console.error("Failed to get calculation history:", error);
      toast({
        variant: "destructive",
        title: "History error",
        description: "Failed to retrieve calculation history.",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Authenticate user
  const getUserByCredentials = async (email: string, password: string): Promise<User | null> => {
    setLoading(true);
    try {
      // Simulate authentication delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user authentication (in a real app, this would query MySQL)
      if (email === "user@example.com" && password === "password") {
        return {
          id: 1,
          username: "demo_user",
          email: "user@example.com",
          created_at: new Date().toISOString()
        };
      }
      
      return null;
    } catch (error) {
      console.error("Authentication error:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Register new user
  const registerUser = async (username: string, email: string, password: string): Promise<User | null> => {
    setLoading(true);
    try {
      // Simulate registration delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Mock user registration (in a real app, this would insert into MySQL)
      const newUser: User = {
        id: Math.floor(Math.random() * 1000) + 1,
        username,
        email,
        created_at: new Date().toISOString()
      };
      
      toast({
        title: "Registration successful",
        description: "Your account has been created.",
      });
      
      return newUser;
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "Failed to create your account. Please try again.",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <DatabaseContext.Provider value={{ 
      isConnected, 
      testConnection, 
      executeQuery, 
      saveCalculation,
      getCalculationHistory,
      getUserByCredentials,
      registerUser,
      loading 
    }}>
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
