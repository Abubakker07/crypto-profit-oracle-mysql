
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from '@/components/ui/skeleton';
import { ProfitabilityResult } from '@/types';
import { formatCurrency } from '@/utils/calculationUtils';

interface ProfitabilitySummaryProps {
  data: ProfitabilityResult | null;
  loading?: boolean;
}

const ProfitabilitySummary: React.FC<ProfitabilitySummaryProps> = ({ data, loading = false }) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profitability Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Array(4).fill(0).map((_, index) => (
              <Skeleton key={index} className="h-24 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profitability Summary</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Select mining parameters to view results</p>
        </CardContent>
      </Card>
    );
  }

  const isProfitable = data.dailyProfit > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profitability Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="grid-card">
            <div className="text-xs uppercase text-muted-foreground">Daily Profit</div>
            <div className={`text-2xl font-bold ${isProfitable ? 'text-green-500' : 'text-red-500'}`}>
              {formatCurrency(data.dailyProfit)}
            </div>
          </div>
          
          <div className="grid-card">
            <div className="text-xs uppercase text-muted-foreground">Weekly Profit</div>
            <div className={`text-2xl font-bold ${isProfitable ? 'text-green-500' : 'text-red-500'}`}>
              {formatCurrency(data.weeklyProfit)}
            </div>
          </div>
          
          <div className="grid-card">
            <div className="text-xs uppercase text-muted-foreground">Monthly Profit</div>
            <div className={`text-2xl font-bold ${isProfitable ? 'text-green-500' : 'text-red-500'}`}>
              {formatCurrency(data.monthlyProfit)}
            </div>
          </div>
          
          <div className="grid-card">
            <div className="text-xs uppercase text-muted-foreground">Break-even</div>
            <div className="text-2xl font-bold text-primary">
              {data.breakEvenDays === Infinity ? 'Never' : `${data.breakEvenDays} days`}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfitabilitySummary;
