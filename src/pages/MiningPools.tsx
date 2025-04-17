
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from '@/components/ui/skeleton';
import { useDatabase } from '@/contexts/DatabaseContext';
import { MiningPool } from '@/types';

const MiningPools = () => {
  const [pools, setPools] = useState<MiningPool[]>([]);
  const [loading, setLoading] = useState(true);
  const { executeQuery } = useDatabase();

  useEffect(() => {
    const fetchPools = async () => {
      try {
        const result = await executeQuery("SELECT * FROM mining_pools ORDER BY fee ASC");
        setPools(result);
      } catch (error) {
        console.error("Error fetching mining pools:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPools();
  }, [executeQuery]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Mining Pools</h2>
          <p className="text-muted-foreground">
            Compare different mining pools, their fees and minimum payouts.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Available Mining Pools</CardTitle>
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
                    <TableHead>Fee (%)</TableHead>
                    <TableHead>Minimum Payout (BTC)</TableHead>
                    <TableHead>Location</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pools.map((pool) => (
                    <TableRow key={pool.id}>
                      <TableCell className="font-medium">{pool.name}</TableCell>
                      <TableCell>{pool.fee}%</TableCell>
                      <TableCell>{pool.min_payout} BTC</TableCell>
                      <TableCell>{pool.location}</TableCell>
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

export default MiningPools;
