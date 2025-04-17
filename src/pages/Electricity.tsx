
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from '@/components/ui/skeleton';
import { useDatabase } from '@/contexts/DatabaseContext';
import { ElectricityRate } from '@/types';

const Electricity = () => {
  const [rates, setRates] = useState<ElectricityRate[]>([]);
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

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Electricity Costs</h2>
          <p className="text-muted-foreground">
            Average electricity rates by country for mining cost calculations.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Electricity Rates by Country</CardTitle>
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
                    <TableHead>Country</TableHead>
                    <TableHead>Average Rate (kWh)</TableHead>
                    <TableHead>Currency</TableHead>
                    <TableHead>Daily Cost for 3000W Miner</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rates.map((rate) => (
                    <TableRow key={rate.id}>
                      <TableCell className="font-medium">{rate.country}</TableCell>
                      <TableCell>${rate.avg_rate.toFixed(2)}</TableCell>
                      <TableCell>{rate.currency}</TableCell>
                      <TableCell>${((3000 * 24 / 1000) * rate.avg_rate).toFixed(2)}</TableCell>
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

export default Electricity;
