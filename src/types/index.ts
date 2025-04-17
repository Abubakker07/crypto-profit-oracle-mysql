
export interface Miner {
  id: number;
  name: string;
  hashrate: number;
  power: number;
  release_date: string;
}

export interface Cryptocurrency {
  id: number;
  name: string;
  symbol: string;
  current_price: number;
  algorithm: string;
}

export interface MiningPool {
  id: number;
  name: string;
  fee: number;
  min_payout: number;
  location: string;
}

export interface ElectricityRate {
  id: number;
  country: string;
  avg_rate: number;
  currency: string;
}

export interface ProfitabilityResult {
  dailyRevenue: number;
  dailyCost: number;
  dailyProfit: number;
  weeklyProfit: number;
  monthlyProfit: number;
  yearlyProfit: number;
  breakEvenDays: number;
}
