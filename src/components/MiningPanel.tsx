import { useState } from 'react';
import { Wallet } from '@/lib/wallet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Pickaxe, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface MiningPanelProps {
  wallets: Wallet[];
  pendingTransactions: number;
  difficulty: number;
  onMineBlock: (minerAddress: string) => Promise<void>;
  onChangeDifficulty: (difficulty: number) => void;
}

export default function MiningPanel({
  wallets,
  pendingTransactions,
  difficulty,
  onMineBlock,
  onChangeDifficulty
}: MiningPanelProps) {
  const [minerAddress, setMinerAddress] = useState('');
  const [isMining, setIsMining] = useState(false);

  const handleMine = async () => {
    if (!minerAddress) {
      toast.error('Please select a miner wallet');
      return;
    }

    if (pendingTransactions === 0) {
      toast.error('No pending transactions to mine');
      return;
    }

    setIsMining(true);
    try {
      await onMineBlock(minerAddress);
      toast.success('Block mined successfully! Mining reward added.');
    } catch (error) {
      toast.error('Mining failed');
    } finally {
      setIsMining(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pickaxe className="w-5 h-5" />
          Block Mining
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
          <div>
            <p className="text-sm text-muted-foreground">Pending Transactions</p>
            <p className="text-2xl font-bold text-blue-600">{pendingTransactions}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Mining Difficulty</p>
            <p className="text-2xl font-bold text-purple-600">{difficulty}</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="difficulty">Adjust Difficulty (1-5)</Label>
          <input
            id="difficulty"
            type="range"
            min="1"
            max="5"
            value={difficulty}
            onChange={(e) => onChangeDifficulty(parseInt(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Higher difficulty = more computational work required
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="minerAddress">Miner Wallet (receives reward)</Label>
          <select
            id="minerAddress"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={minerAddress}
            onChange={(e) => setMinerAddress(e.target.value)}
            disabled={isMining}
          >
            <option value="">Select miner wallet</option>
            {wallets.map((wallet) => (
              <option key={wallet.address} value={wallet.address}>
                {wallet.name}
              </option>
            ))}
          </select>
        </div>

        <Button
          onClick={handleMine}
          disabled={isMining || pendingTransactions === 0 || !minerAddress}
          className="w-full"
        >
          {isMining ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Mining Block...
            </>
          ) : (
            <>
              <Pickaxe className="w-4 h-4 mr-2" />
              Mine Block
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}