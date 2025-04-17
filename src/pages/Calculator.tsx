
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Miner, Cryptocurrency, ProfitabilityResult } from '@/types';
import { calculateProfitability, formatCurrency, formatHashrate, formatPower } from '@/utils/calculationUtils';
import { useDatabase } from '@/contexts/DatabaseContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Calculator as CalculatorIcon, Bolt, Bitcoin, DollarSign, Save } from 'lucide-react';

const Calculator = () => {
  const { executeQuery, saveCalculation, loading } = useDatabase();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Form state
  const [miners, setMiners] = useState<Miner[]>([]);
  const [cryptocurrencies, setCryptocurrencies] = useState<Cryptocurrency[]>([]);
  const [selectedMiner, setSelectedMiner] = useState<Miner | null>(null);
  const [selectedCrypto, setSelectedCrypto] = useState<Cryptocurrency | null>(null);
  const [electricityRate, setElectricityRate] = useState<number>(0.12);
  const [calculationResult, setCalculationResult] = useState<ProfitabilityResult | null>(null);
  
  // Load miners and cryptocurrencies
  useEffect(() => {
    const loadData = async () => {
      try {
        const minersData = await executeQuery("SELECT * FROM miners");
        const cryptosData = await executeQuery("SELECT * FROM cryptocurrencies");
        
        setMiners(minersData);
        setCryptocurrencies(cryptosData);
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    };
    
    loadData();
  }, [executeQuery]);
  
  const handleCalculate = () => {
    if (!selectedMiner || !selectedCrypto) {
      return;
    }
    
    const result = calculateProfitability(
      selectedMiner,
      selectedCrypto,
      electricityRate
    );
    
    setCalculationResult(result);
  };
  
  const handleSaveCalculation = async () => {
    if (!calculationResult || !isAuthenticated) {
      if (!isAuthenticated) {
        navigate('/login');
      }
      return;
    }
    
    try {
      const calculationWithUserId = {
        ...calculationResult,
        user_id: user?.id
      };
      
      await saveCalculation(calculationWithUserId);
    } catch (error) {
      console.error("Failed to save calculation:", error);
    }
  };
  
  const handleViewHistory = () => {
    navigate('/history');
  };
  
  const handleExportResults = () => {
    navigate('/export', { state: { calculationResult } });
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Input Form */}
          <Card className="md:w-1/2">
            <CardHeader>
              <CardTitle>Mining Calculator</CardTitle>
              <CardDescription>Enter your mining parameters to calculate profitability</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="miner">Select Mining Hardware</Label>
                <Select onValueChange={(value) => {
                  const miner = miners.find(m => m.id === parseInt(value));
                  setSelectedMiner(miner || null);
                }}>
                  <SelectTrigger id="miner">
                    <SelectValue placeholder="Select mining hardware" />
                  </SelectTrigger>
                  <SelectContent>
                    {miners.map((miner) => (
                      <SelectItem key={miner.id} value={miner.id.toString()}>
                        {miner.name} - {formatHashrate(miner.hashrate)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="crypto">Select Cryptocurrency</Label>
                <Select onValueChange={(value) => {
                  const crypto = cryptocurrencies.find(c => c.id === parseInt(value));
                  setSelectedCrypto(crypto || null);
                }}>
                  <SelectTrigger id="crypto">
                    <SelectValue placeholder="Select cryptocurrency" />
                  </SelectTrigger>
                  <SelectContent>
                    {cryptocurrencies.map((crypto) => (
                      <SelectItem key={crypto.id} value={crypto.id.toString()}>
                        {crypto.name} ({crypto.symbol}) - {formatCurrency(crypto.current_price)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="electricity">Electricity Rate ($/kWh)</Label>
                <Input
                  id="electricity"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={electricityRate}
                  onChange={(e) => setElectricityRate(parseFloat(e.target.value))}
                />
              </div>
              
              <Button 
                onClick={handleCalculate} 
                className="w-full" 
                disabled={!selectedMiner || !selectedCrypto || loading}
              >
                <CalculatorIcon className="mr-2 h-4 w-4" />
                Calculate Profitability
              </Button>
            </CardContent>
          </Card>
          
          {/* Results */}
          <Card className="md:w-1/2">
            <CardHeader>
              <CardTitle>Profitability Results</CardTitle>
              <CardDescription>Your estimated mining profits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {calculationResult ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Hardware</p>
                      <p className="font-medium">{calculationResult.miner_name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Cryptocurrency</p>
                      <p className="font-medium">{calculationResult.crypto_name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Hashrate</p>
                      <p className="font-medium">{formatHashrate(calculationResult.hashrate)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Power Consumption</p>
                      <p className="font-medium">{formatPower(calculationResult.power_consumption)}</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Bitcoin className="h-5 w-5 mr-2 text-yellow-500" />
                        <span>Daily Revenue</span>
                      </div>
                      <span className="font-medium">{formatCurrency(calculationResult.daily_revenue)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Bolt className="h-5 w-5 mr-2 text-red-500" />
                        <span>Daily Electricity Cost</span>
                      </div>
                      <span className="font-medium">{formatCurrency(calculationResult.daily_cost)}</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <DollarSign className="h-5 w-5 mr-2 text-green-500" />
                        <span>Daily Profit</span>
                      </div>
                      <span className="font-medium text-lg">
                        {formatCurrency(calculationResult.daily_profit)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <DollarSign className="h-5 w-5 mr-2 text-green-500" />
                        <span>Monthly Profit</span>
                      </div>
                      <span className="font-medium text-lg">
                        {formatCurrency(calculationResult.monthly_profit)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2 mt-4">
                    <Button onClick={handleSaveCalculation} disabled={loading || !isAuthenticated}>
                      <Save className="mr-2 h-4 w-4" />
                      {isAuthenticated ? "Save Calculation" : "Login to Save"}
                    </Button>
                    <Button variant="outline" onClick={handleExportResults}>
                      Export Results
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <CalculatorIcon className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Fill out the form and calculate to see your mining profitability results
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {isAuthenticated && (
          <Button variant="outline" onClick={handleViewHistory} className="ml-auto">
            View Calculation History
          </Button>
        )}
      </div>
    </Layout>
  );
};

export default Calculator;
