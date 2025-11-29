import { useState } from 'react';
import { Wallet, WalletManager as WM } from '@/lib/wallet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Store } from 'lucide-react';
import { toast } from 'sonner';

interface MerchantPanelProps {
  wallets: Wallet[];
  onIssuePoints: (merchantAddress: string, toAddress: string, amount: number, privateKey: string) => void;
}

export default function MerchantPanel({ wallets, onIssuePoints }: MerchantPanelProps) {
  const [merchantAddress, setMerchantAddress] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');

  const merchantWallets = wallets.filter(w => w.type === 'merchant');
  const userWallets = wallets.filter(w => w.type === 'user');

  const handleIssuePoints = (e: React.FormEvent) => {
    e.preventDefault();

    if (!merchantAddress || !recipientAddress || !amount) {
      toast.error('Please fill in all fields');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    const merchant = wallets.find(w => w.address === merchantAddress);
    if (!merchant) {
      toast.error('Merchant wallet not found');
      return;
    }

    onIssuePoints(merchantAddress, recipientAddress, amountNum, merchant.privateKey);
    setMerchantAddress('');
    setRecipientAddress('');
    setAmount('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Store className="w-5 h-5" />
          Merchant Point Issuance
        </CardTitle>
      </CardHeader>
      <CardContent>
        {merchantWallets.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            No merchant wallets available. Create a merchant wallet first.
          </p>
        ) : (
          <form onSubmit={handleIssuePoints} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="merchantAddress">Merchant Wallet</Label>
              <select
                id="merchantAddress"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={merchantAddress}
                onChange={(e) => setMerchantAddress(e.target.value)}
              >
                <option value="">Select merchant wallet</option>
                {merchantWallets.map((wallet) => (
                  <option key={wallet.address} value={wallet.address}>
                    {wallet.name} ({WM.getShortAddress(wallet.address)})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipientAddress">Recipient Wallet</Label>
              <select
                id="recipientAddress"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
              >
                <option value="">Select recipient wallet</option>
                {userWallets.map((wallet) => (
                  <option key={wallet.address} value={wallet.address}>
                    {wallet.name} ({WM.getShortAddress(wallet.address)})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="issueAmount">Points to Issue</Label>
              <Input
                id="issueAmount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                step="1"
              />
            </div>

            <Button type="submit" className="w-full">
              Issue Points
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}