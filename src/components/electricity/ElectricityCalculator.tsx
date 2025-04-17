
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from "@/components/ui/slider";
import { useDatabase } from '@/contexts/DatabaseContext';
import { ElectricityRate } from '@/types';

interface ElectricityCalculatorProps {
  onRateChange: (rate: number) => void;
  defaultRate?: number;
}

const ElectricityCalculator: React.FC<ElectricityCalculatorProps> = ({ onRateChange, defaultRate }) => {
  const [rates, setRates] = useState<ElectricityRate[]>([]);
  const [customRate, setCustomRate] = useState<number>(defaultRate || 0.12);
  const [loading, setLoading] = useState(true);
  const { executeQuery } = useDatabase();

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const result = await executeQuery("SELECT * FROM electricity_rates ORDER BY avg_rate ASC");
        setRates(result);
      } catch (error) {
        console.error("Error fetching electricity rates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, [executeQuery]);

  useEffect(() => {
    if (!defaultRate) {
      onRateChange(customRate);
    }
  }, []);

  const handleCountryChange = (countryId: string) => {
    const id = parseInt(countryId);
    const selectedRate = rates.find(r => r.id === id);
    if (selectedRate) {
      setCustomRate(selectedRate.avg_rate);
      onRateChange(selectedRate.avg_rate);
    }
  };

  const handleCustomRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRate = parseFloat(e.target.value);
    if (!isNaN(newRate)) {
      setCustomRate(newRate);
      onRateChange(newRate);
    }
  };

  const handleSliderChange = (value: number[]) => {
    setCustomRate(value[0]);
    onRateChange(value[0]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Electricity Cost</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="country">Country</Label>
              <Select onValueChange={handleCountryChange}>
                <SelectTrigger id="country">
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  {rates.map((rate) => (
                    <SelectItem key={rate.id} value={rate.id.toString()}>
                      {rate.country} (${rate.avg_rate.toFixed(2)}/kWh)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="customRate">Custom Rate ($/kWh)</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="customRate"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={customRate}
                  onChange={handleCustomRateChange}
                />
                <div className="w-20 text-right text-muted-foreground">
                  ${customRate.toFixed(2)}
                </div>
              </div>
            </div>
            
            <div className="pt-2">
              <Slider
                defaultValue={[customRate]}
                min={0.01}
                max={0.5}
                step={0.01}
                value={[customRate]}
                onValueChange={handleSliderChange}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>$0.01</span>
                <span>$0.25</span>
                <span>$0.50</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ElectricityCalculator;
