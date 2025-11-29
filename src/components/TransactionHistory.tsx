import { Transaction } from '@/lib/transaction';
import { WalletManager as WM } from '@/lib/wallet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { History, ArrowRight } from 'lucide-react';

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export default function TransactionHistory({ transactions }: TransactionHistoryProps) {
  const sortedTransactions = [...transactions].reverse();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5" />
          Transaction History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedTransactions.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No transactions yet</p>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {sortedTransactions.map((tx, index) => (
              <Card key={index} className="bg-gradient-to-r from-slate-50 to-blue-50">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={tx.fromAddress === 'system' ? 'default' : 'secondary'}>
                      {tx.fromAddress === 'system' ? 'Mining Reward' : 'Transfer'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(tx.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-mono">
                      {tx.fromAddress === 'system' ? 'System' : WM.getShortAddress(tx.fromAddress)}
                    </span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    <span className="font-mono">{WM.getShortAddress(tx.toAddress)}</span>
                    <span className="ml-auto font-semibold text-blue-600">{tx.amount} pts</span>
                  </div>
                  <div className="mt-2 pt-2 border-t">
                    <p className="text-xs text-muted-foreground">Hash:</p>
                    <p className="font-mono text-xs break-all">{tx.calculateHash()}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}