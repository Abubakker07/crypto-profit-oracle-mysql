
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from '@/components/ui/skeleton';
import { useDatabase } from '@/contexts/DatabaseContext';
import { Miner } from '@/types';
import { formatHashrate, formatPower } from '@/utils/calculationUtils';

const Hardware = () => {
  const [miners, setMiners] = useState<Miner[]>([]);
  const [loading, setLoading] = useState(true);
  const { executeQuery } = useDatabase();

  useEffect(() => {
    const fetchMiners = async () => {
      try {
        const result = await executeQuery("SELECT * FROM miners ORDER BY hashrate DESC");
        setMiners(result);
      } catch (error) {
        console.error("Error fetching miners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMiners();
  }, [executeQuery]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Mining Hardware</h2>
          <p className="text-muted-foreground">
            Compare different mining hardware specifications and performance.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Available Mining Hardware</CardTitle>
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
                    <TableHead>Hashrate</TableHead>
                    <TableHead>Power</TableHead>
                    <TableHead>Efficiency</TableHead>
                    <TableHead>Release Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {miners.map((miner) => (
                    <TableRow key={miner.id}>
                      <TableCell className="font-medium">{miner.name}</TableCell>
                      <TableCell>{formatHashrate(miner.hashrate)}</TableCell>
                      <TableCell>{formatPower(miner.power)}</TableCell>
                      <TableCell>
                        {(miner.hashrate / (miner.power / 1000)).toFixed(2)} TH/s/kW
                      </TableCell>
                      <TableCell>{new Date(miner.release_date).toLocaleDateString()}</TableCell>
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

export default Hardware;
