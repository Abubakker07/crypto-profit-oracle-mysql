
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from '@/components/ui/skeleton';
import { useDatabase } from '@/contexts/DatabaseContext';
import { MiningPool } from '@/types';

interface MiningPoolSelectorProps {
  onSelect: (pool: MiningPool) => void;
  selectedPoolId?: number;
}

const MiningPoolSelector: React.FC<MiningPoolSelectorProps> = ({ onSelect, selectedPoolId }) => {
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

  useEffect(() => {
    if (pools.length > 0 && !selectedPoolId) {
      onSelect(pools[0]);
    }
  }, [pools, onSelect, selectedPoolId]);

  const handleSelectChange = (value: string) => {
    const poolId = parseInt(value);
    const selectedPool = pools.find(p => p.id === poolId);
    if (selectedPool) {
      onSelect(selectedPool);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mining Pool</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        ) : (
          <>
            <Select 
              value={selectedPoolId?.toString() || pools[0]?.id.toString()}
              onValueChange={handleSelectChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select mining pool" />
              </SelectTrigger>
              <SelectContent>
                {pools.map((pool) => (
                  <SelectItem key={pool.id} value={pool.id.toString()}>
                    {pool.name} ({pool.fee}% fee)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedPoolId && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                {pools.filter(p => p.id === selectedPoolId).map((pool) => (
                  <React.Fragment key={pool.id}>
                    <div className="grid-card">
                      <div className="text-xs uppercase text-muted-foreground">Pool Fee</div>
                      <div className="text-2xl font-bold text-primary">{pool.fee}%</div>
                    </div>
                    <div className="grid-card">
                      <div className="text-xs uppercase text-muted-foreground">Min. Payout</div>
                      <div className="text-2xl font-bold text-primary">{pool.min_payout} BTC</div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MiningPoolSelector;
