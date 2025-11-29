import { useState } from 'react';
import { Wallet, WalletManager as WM } from '@/lib/wallet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Wallet as WalletIcon, Plus, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface WalletManagerProps {
  wallets: Wallet[];
  onCreateWallet: (wallet: Wallet) => void;
  balances: { [address: string]: number };
}

export default function WalletManagerComponent({ wallets, onCreateWallet, balances }: WalletManagerProps) {
  const [walletName, setWalletName] = useState('');
  const [walletType, setWalletType] = useState<'user' | 'merchant'>('user');
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const handleCreateWallet = () => {
    if (!walletName.trim()) {
      toast.error('Please enter a wallet name');
      return;
    }

    const wallet = WM.createWallet(walletName, walletType);
    onCreateWallet(wallet);
    setWalletName('');
    toast.success(`${walletType === 'merchant' ? 'Merchant' : 'User'} wallet created successfully!`);
  };

  const copyToClipboard = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    toast.success('Address copied to clipboard');
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <WalletIcon className="w-5 h-5" />
          Wallet Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-2">
            <Label htmlFor="walletName">Wallet Name</Label>
            <Input
              id="walletName"
              placeholder="Enter wallet name"
              value={walletName}
              onChange={(e) => setWalletName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="walletType">Wallet Type</Label>
            <select
              id="walletType"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={walletType}
              onChange={(e) => setWalletType(e.target.value as 'user' | 'merchant')}
            >
              <option value="user">User</option>
              <option value="merchant">Merchant</option>
            </select>
          </div>
          <div className="flex items-end">
            <Button onClick={handleCreateWallet} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Create Wallet
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-sm">Active Wallets ({wallets.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
            {wallets.map((wallet) => (
              <Card key={wallet.address} className="bg-gradient-to-br from-slate-50 to-slate-100">
                <CardContent className="pt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{wallet.name}</h4>
                    <Badge variant={wallet.type === 'merchant' ? 'default' : 'secondary'}>
                      {wallet.type}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Address:</p>
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-xs break-all flex-1">{WM.getShortAddress(wallet.address)}</p>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(wallet.address)}
                      >
                        {copiedAddress === wallet.address ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-sm font-semibold">
                      Balance: <span className="text-blue-600">{balances[wallet.address] || 0}</span> Points
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}