
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Miner, Cryptocurrency, MiningPool, ProfitabilityResult } from '@/types';
import MinerSelector from '@/components/miners/MinerSelector';
import CryptoSelector from '@/components/crypto/CryptoSelector';
import ElectricityCalculator from '@/components/electricity/ElectricityCalculator';
import MiningPoolSelector from '@/components/pools/MiningPoolSelector';
import ProfitabilitySummary from '@/components/results/ProfitabilitySummary';
import ProfitabilityChart from '@/components/dashboard/ProfitabilityChart';
import { calculateProfitability } from '@/utils/calculationUtils';
import AppLayout from '@/components/layout/AppLayout';
import { useDatabase } from '@/contexts/DatabaseContext';

const Index = () => {
  const [selectedMiner, setSelectedMiner] = useState<Miner | null>(null);
  const [selectedCrypto, setSelectedCrypto] = useState<Cryptocurrency | null>(null);
  const [selectedPool, setSelectedPool] = useState<MiningPool | null>(null);
  const [electricityRate, setElectricityRate] = useState<number>(0.12);
  const [profitabilityResult, setProfitabilityResult] = useState<ProfitabilityResult | null>(null);

  const { loading } = useDatabase();

  useEffect(() => {
    if (selectedMiner && selectedCrypto && selectedPool) {
      const result = calculateProfitability(
        selectedMiner,
        selectedCrypto,
        electricityRate,
        selectedPool.fee
      );
      setProfitabilityResult(result);
    }
  }, [selectedMiner, selectedCrypto, selectedPool, electricityRate]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Mining Profitability Calculator</h2>
          <p className="text-muted-foreground">
            Calculate your potential mining profits based on hardware, cryptocurrency, and electricity costs.
          </p>
        </div>

        <ProfitabilitySummary data={profitabilityResult} loading={loading} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProfitabilityChart data={profitabilityResult} />
          
          <Tabs defaultValue="hardware" className="h-full">
            <TabsList className="grid grid-cols-4 h-10">
              <TabsTrigger value="hardware">Hardware</TabsTrigger>
              <TabsTrigger value="crypto">Crypto</TabsTrigger>
              <TabsTrigger value="electricity">Power</TabsTrigger>
              <TabsTrigger value="pool">Pool</TabsTrigger>
            </TabsList>
            <TabsContent value="hardware" className="h-[calc(100%-40px)]">
              <MinerSelector 
                onSelect={setSelectedMiner}
                selectedMinerId={selectedMiner?.id}
              />
            </TabsContent>
            <TabsContent value="crypto" className="h-[calc(100%-40px)]">
              <CryptoSelector 
                onSelect={setSelectedCrypto}
                selectedCryptoId={selectedCrypto?.id}
              />
            </TabsContent>
            <TabsContent value="electricity" className="h-[calc(100%-40px)]">
              <ElectricityCalculator 
                onRateChange={setElectricityRate}
                defaultRate={electricityRate}
              />
            </TabsContent>
            <TabsContent value="pool" className="h-[calc(100%-40px)]">
              <MiningPoolSelector 
                onSelect={setSelectedPool}
                selectedPoolId={selectedPool?.id}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
