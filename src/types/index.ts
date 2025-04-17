
export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

export interface Miner {
  id: number;
  name: string;
  hashrate: number;
  power: number;
}

export interface Cryptocurrency {
  id: number;
  name: string;
  symbol: string;
  current_price: number;
  algorithm: string;
}

export interface ProfitabilityResult {
  id?: number;
  user_id?: number;
  miner_id: number;
  miner_name: string;
  crypto_id: number;
  crypto_name: string;
  hashrate: number;
  power_consumption: number;
  electricity_rate: number;
  daily_revenue: number;
  daily_cost: number;
  daily_profit: number;
  monthly_profit: number;
  calculation_date: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
