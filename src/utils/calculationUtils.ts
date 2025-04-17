
import { Miner, Cryptocurrency, ProfitabilityResult } from "@/types";

export const calculateProfitability = (
  miner: Miner,
  crypto: Cryptocurrency,
  electricityRate: number
): ProfitabilityResult => {
  // Calculate daily revenue (simplified calculation)
  const hashrateTH = miner.hashrate;
  
  // Simplified calculation for daily mining rewards
  const dailyReward = crypto.algorithm === "SHA-256" 
    ? (hashrateTH * 0.000008 * crypto.current_price)
    : crypto.algorithm === "Ethash" 
    ? (hashrateTH * 0.00004 * crypto.current_price)
    : (hashrateTH * 0.00001 * crypto.current_price);
    
  const dailyRevenue = dailyReward;
  
  // Calculate electricity cost
  // kWh per day = Power consumption (W) * 24 hours / 1000
  const dailyKWh = (miner.power * 24) / 1000;
  const dailyCost = dailyKWh * electricityRate;
  
  // Calculate profits
  const dailyProfit = dailyRevenue - dailyCost;
  const monthlyProfit = dailyProfit * 30;
  
  return {
    miner_id: miner.id,
    miner_name: miner.name,
    crypto_id: crypto.id,
    crypto_name: crypto.name,
    hashrate: miner.hashrate,
    power_consumption: miner.power,
    electricity_rate: electricityRate,
    daily_revenue: dailyRevenue,
    daily_cost: dailyCost,
    daily_profit: dailyProfit,
    monthly_profit: monthlyProfit,
    calculation_date: new Date().toISOString()
  };
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

export const formatHashrate = (hashrate: number): string => {
  if (hashrate >= 1000) {
    return `${(hashrate / 1000).toFixed(2)} PH/s`;
  } else {
    return `${hashrate.toFixed(2)} TH/s`;
  }
};

export const formatPower = (power: number): string => {
  if (power >= 1000) {
    return `${(power / 1000).toFixed(2)} kW`;
  } else {
    return `${power.toFixed(0)} W`;
  }
};
