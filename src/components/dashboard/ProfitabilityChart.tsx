
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { formatCurrency } from '@/utils/calculationUtils';
import { ProfitabilityResult } from '@/types';

interface ProfitabilityChartProps {
  data: ProfitabilityResult | null;
}

const ProfitabilityChart: React.FC<ProfitabilityChartProps> = ({ data }) => {
  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profitability Analysis</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">Select mining hardware and parameters to view profitability.</p>
        </CardContent>
      </Card>
    );
  }

  const chartData = [
    {
      name: 'Revenue',
      daily: data.dailyRevenue,
      weekly: data.dailyRevenue * 7,
      monthly: data.dailyRevenue * 30,
      yearly: data.dailyRevenue * 365,
    },
    {
      name: 'Cost',
      daily: data.dailyCost,
      weekly: data.dailyCost * 7,
      monthly: data.dailyCost * 30,
      yearly: data.dailyCost * 365,
    },
    {
      name: 'Profit',
      daily: data.dailyProfit,
      weekly: data.dailyProfit * 7,
      monthly: data.dailyProfit * 30,
      yearly: data.dailyProfit * 365,
    },
  ];

  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-3 rounded-md border border-border shadow-md">
          <p className="text-sm font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value as number)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profitability Analysis</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
            <YAxis 
              stroke="rgba(255,255,255,0.5)" 
              tickFormatter={(value) => `$${value}`} 
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="daily" name="Daily" fill="#9b87f5" />
            <Bar dataKey="weekly" name="Weekly" fill="#7E69AB" />
            <Bar dataKey="monthly" name="Monthly" fill="#8B5CF6" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ProfitabilityChart;
