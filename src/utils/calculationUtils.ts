
import { Miner, Cryptocurrency, MiningPool, ElectricityRate } from "@/types";

export const calculateProfitability = (
  miner: Miner,
  crypto: Cryptocurrency,
  electricityRate: number,
  poolFee: number
) => {
  // Calculate daily revenue (simplified calculation)
  // For Bitcoin: Daily revenue = (hashrate in TH/s * 24 hours * block reward * block probability) - pool fee
  // This is simplified for demonstration purposes
  const hashrateTH = miner.hashrate;
  
  // Simplified calculation for daily mining rewards
  // In a real calculator, this would involve network difficulty, block rewards, etc.
  const dailyReward = crypto.algorithm === "SHA-256" 
    ? (hashrateTH * 0.000008 * crypto.current_price)
    : crypto.algorithm === "Ethash" 
    ? (hashrateTH * 0.00004 * crypto.current_price)
    : (hashrateTH * 0.00001 * crypto.current_price);
    
  // Apply pool fee
  const poolFeeAmount = dailyReward * (poolFee / 100);
  const dailyRevenue = dailyReward - poolFeeAmount;
  
  // Calculate electricity cost
  // kWh per day = Power consumption (W) * 24 hours / 1000
  const dailyKWh = (miner.power * 24) / 1000;
  const dailyCost = dailyKWh * electricityRate;
  
  // Calculate profits
  const dailyProfit = dailyRevenue - dailyCost;
  const weeklyProfit = dailyProfit * 7;
  const monthlyProfit = dailyProfit * 30;
  const yearlyProfit = dailyProfit * 365;
  
  // Calculate break-even (assuming miner cost is approximately hashrate * $60)
  const minerCost = miner.hashrate * 60;
  const breakEvenDays = dailyProfit > 0 ? Math.round(minerCost / dailyProfit) : Infinity;
  
  return {
    dailyRevenue,
    dailyCost,
    dailyProfit,
    weeklyProfit,
    monthlyProfit,
    yearlyProfit,
    breakEvenDays,
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
