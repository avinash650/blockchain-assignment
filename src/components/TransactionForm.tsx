import { useState } from 'react';
import { Wallet, WalletManager as WM } from '@/lib/wallet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRightLeft } from 'lucide-react';
import { toast } from 'sonner';

interface TransactionFormProps {
  wallets: Wallet[];
  onSubmitTransaction: (fromAddress: string, toAddress: string, amount: number, privateKey: string) => void;
  balances: { [address: string]: number };
}

export default function TransactionForm({ wallets, onSubmitTransaction, balances }: TransactionFormProps) {
  const [fromAddress, setFromAddress] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fromAddress || !toAddress || !amount) {
      toast.error('Please fill in all fields');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (fromAddress === toAddress) {
      toast.error('Cannot send points to the same wallet');
      return;
    }

    const fromWallet = wallets.find(w => w.address === fromAddress);
    if (!fromWallet) {
      toast.error('Sender wallet not found');
      return;
    }

    const balance = balances[fromAddress] || 0;
    if (balance < amountNum) {
      toast.error('Insufficient balance');
      return;
    }

    onSubmitTransaction(fromAddress, toAddress, amountNum, fromWallet.privateKey);
    setFromAddress('');
    setToAddress('');
    setAmount('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRightLeft className="w-5 h-5" />
          Transfer Points
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fromAddress">From Wallet</Label>
            <select
              id="fromAddress"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={fromAddress}
              onChange={(e) => setFromAddress(e.target.value)}
            >
              <option value="">Select sender wallet</option>
              {wallets.map((wallet) => (
                <option key={wallet.address} value={wallet.address}>
                  {wallet.name} ({WM.getShortAddress(wallet.address)}) - {balances[wallet.address] || 0} pts
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="toAddress">To Wallet</Label>
            <select
              id="toAddress"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
            >
              <option value="">Select recipient wallet</option>
              {wallets.map((wallet) => (
                <option key={wallet.address} value={wallet.address}>
                  {wallet.name} ({WM.getShortAddress(wallet.address)})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (Points)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              step="1"
            />
          </div>

          <Button type="submit" className="w-full">
            Send Points
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}