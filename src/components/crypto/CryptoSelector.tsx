
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from '@/components/ui/skeleton';
import { useDatabase } from '@/contexts/DatabaseContext';
import { Cryptocurrency } from '@/types';
import { formatCurrency } from '@/utils/calculationUtils';

interface CryptoSelectorProps {
  onSelect: (crypto: Cryptocurrency) => void;
  selectedCryptoId?: number;
}

const CryptoSelector: React.FC<CryptoSelectorProps> = ({ onSelect, selectedCryptoId }) => {
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

  useEffect(() => {
    if (cryptocurrencies.length > 0 && !selectedCryptoId) {
      onSelect(cryptocurrencies[0]);
    }
  }, [cryptocurrencies, onSelect, selectedCryptoId]);

  const handleSelectChange = (value: string) => {
    const cryptoId = parseInt(value);
    const selectedCrypto = cryptocurrencies.find(c => c.id === cryptoId);
    if (selectedCrypto) {
      onSelect(selectedCrypto);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cryptocurrency</CardTitle>
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
              value={selectedCryptoId?.toString() || cryptocurrencies[0]?.id.toString()}
              onValueChange={handleSelectChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select cryptocurrency" />
              </SelectTrigger>
              <SelectContent>
                {cryptocurrencies.map((crypto) => (
                  <SelectItem key={crypto.id} value={crypto.id.toString()}>
                    {crypto.name} ({crypto.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedCryptoId && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                {cryptocurrencies.filter(c => c.id === selectedCryptoId).map((crypto) => (
                  <React.Fragment key={crypto.id}>
                    <div className="grid-card">
                      <div className="text-xs uppercase text-muted-foreground">Price</div>
                      <div className="text-2xl font-bold text-primary">{formatCurrency(crypto.current_price)}</div>
                    </div>
                    <div className="grid-card">
                      <div className="text-xs uppercase text-muted-foreground">Algorithm</div>
                      <div className="text-lg font-bold text-primary">{crypto.algorithm}</div>
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

export default CryptoSelector;
