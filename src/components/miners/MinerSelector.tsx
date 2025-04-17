
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from '@/components/ui/skeleton';
import { useDatabase } from '@/contexts/DatabaseContext';
import { Miner } from '@/types';
import { formatHashrate, formatPower } from '@/utils/calculationUtils';

interface MinerSelectorProps {
  onSelect: (miner: Miner) => void;
  selectedMinerId?: number;
}

const MinerSelector: React.FC<MinerSelectorProps> = ({ onSelect, selectedMinerId }) => {
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

  useEffect(() => {
    if (miners.length > 0 && !selectedMinerId) {
      onSelect(miners[0]);
    }
  }, [miners, onSelect, selectedMinerId]);

  const handleSelectChange = (value: string) => {
    const minerId = parseInt(value);
    const selectedMiner = miners.find(m => m.id === minerId);
    if (selectedMiner) {
      onSelect(selectedMiner);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mining Hardware</CardTitle>
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
              value={selectedMinerId?.toString() || miners[0]?.id.toString()}
              onValueChange={handleSelectChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select mining hardware" />
              </SelectTrigger>
              <SelectContent>
                {miners.map((miner) => (
                  <SelectItem key={miner.id} value={miner.id.toString()}>
                    {miner.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedMinerId && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                {miners.filter(m => m.id === selectedMinerId).map((miner) => (
                  <React.Fragment key={miner.id}>
                    <div className="grid-card">
                      <div className="text-xs uppercase text-muted-foreground">Hashrate</div>
                      <div className="text-2xl font-bold text-primary">{formatHashrate(miner.hashrate)}</div>
                    </div>
                    <div className="grid-card">
                      <div className="text-xs uppercase text-muted-foreground">Power</div>
                      <div className="text-2xl font-bold text-primary">{formatPower(miner.power)}</div>
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

export default MinerSelector;
