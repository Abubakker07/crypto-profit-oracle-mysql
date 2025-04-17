
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ProfitabilityResult } from '@/types';
import { formatCurrency, formatHashrate } from '@/utils/calculationUtils';
import { useDatabase } from '@/contexts/DatabaseContext';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { History as HistoryIcon, Printer, ArrowLeft, Trash } from 'lucide-react';

const History = () => {
  const { getCalculationHistory, loading } = useDatabase();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [history, setHistory] = useState<ProfitabilityResult[]>([]);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    const loadHistory = async () => {
      if (user) {
        const calculationHistory = await getCalculationHistory(user.id);
        setHistory(calculationHistory);
      }
    };
    
    loadHistory();
  }, [getCalculationHistory, user, isAuthenticated, navigate]);
  
  const handleExportResult = (calculation: ProfitabilityResult) => {
    navigate('/export', { state: { calculationResult: calculation } });
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Calculation History</h2>
            <p className="text-muted-foreground">
              Your last {history.length} mining profitability calculations
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate('/calculator')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Calculator
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <HistoryIcon className="mr-2 h-5 w-5" />
              Recent Calculations
            </CardTitle>
            <CardDescription>
              View and export your recent mining profitability calculations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <p>Loading history...</p>
              </div>
            ) : history.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Hardware</TableHead>
                    <TableHead>Cryptocurrency</TableHead>
                    <TableHead>Hashrate</TableHead>
                    <TableHead>Daily Profit</TableHead>
                    <TableHead>Monthly Profit</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((calculation) => (
                    <TableRow key={calculation.id}>
                      <TableCell>
                        {new Date(calculation.calculation_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{calculation.miner_name}</TableCell>
                      <TableCell>{calculation.crypto_name}</TableCell>
                      <TableCell>{formatHashrate(calculation.hashrate)}</TableCell>
                      <TableCell>{formatCurrency(calculation.daily_profit)}</TableCell>
                      <TableCell>{formatCurrency(calculation.monthly_profit)}</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleExportResult(calculation)}
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <HistoryIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No calculation history found</p>
                <Button 
                  variant="outline" 
                  className="mt-4" 
                  onClick={() => navigate('/calculator')}
                >
                  Create Your First Calculation
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default History;
