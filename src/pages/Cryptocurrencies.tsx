
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from '@/components/ui/skeleton';
import { useDatabase } from '@/contexts/DatabaseContext';
import { Cryptocurrency } from '@/types';
import { formatCurrency } from '@/utils/calculationUtils';

const Cryptocurrencies = () => {
  const [cryptocurrencies, setCryptocurrencies] = useState<Cryptocurrency[]>([]);
  const [loading, setLoading] = useState(true);
  const { executeQuery } = useDatabase();

  useEffect(() => {
    const fetchCryptocurrencies = async () => {
      try {
        const result = await executeQuery("SELECT * FROM cryptocurrencies ORDER BY current_price DESC");
        setCryptocurrencies(result);
      } catch (error) {
        console.error("Error fetching cryptocurrencies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCryptocurrencies();
  }, [executeQuery]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Cryptocurrencies</h2>
          <p className="text-muted-foreground">
            Current prices and mining algorithms for supported cryptocurrencies.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Available Cryptocurrencies</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-96 w-full" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Current Price</TableHead>
                    <TableHead>Algorithm</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cryptocurrencies.map((crypto) => (
                    <TableRow key={crypto.id}>
                      <TableCell className="font-medium">{crypto.name}</TableCell>
                      <TableCell>{crypto.symbol}</TableCell>
                      <TableCell>{formatCurrency(crypto.current_price)}</TableCell>
                      <TableCell>{crypto.algorithm}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Cryptocurrencies;
