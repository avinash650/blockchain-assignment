import { useState, useEffect } from 'react';
import { Blockchain } from '@/lib/blockchain';
import { Transaction } from '@/lib/transaction';
import { Wallet } from '@/lib/wallet';
import BlockchainVisualizer from '@/components/BlockchainVisualizer';
import WalletManagerComponent from '@/components/WalletManager';
import TransactionForm from '@/components/TransactionForm';
import TransactionHistory from '@/components/TransactionHistory';
import MerchantPanel from '@/components/MerchantPanel';
import MiningPanel from '@/components/MiningPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

export default function Index() {
  const [blockchain] = useState(() => new Blockchain());
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [balances, setBalances] = useState<{ [address: string]: number }>({});
  const [, setRefresh] = useState(0);

  useEffect(() => {
    updateBalances();
  }, [wallets]);

  const updateBalances = () => {
    const newBalances: { [address: string]: number } = {};
    wallets.forEach(wallet => {
      newBalances[wallet.address] = blockchain.getBalanceOfAddress(wallet.address);
    });
    setBalances(newBalances);
    setRefresh(prev => prev + 1);
  };

  const handleCreateWallet = (wallet: Wallet) => {
    setWallets([...wallets, wallet]);
  };

  const handleSubmitTransaction = (fromAddress: string, toAddress: string, amount: number, privateKey: string) => {
    const transaction = new Transaction(fromAddress, toAddress, amount);
    transaction.signTransaction(privateKey);

    const success = blockchain.addTransaction(transaction);
    if (success) {
      toast.success('Transaction added to pending pool. Mine a block to confirm.');
      setRefresh(prev => prev + 1);
    } else {
      toast.error('Transaction failed. Check balance and try again.');
    }
  };

  const handleIssuePoints = (merchantAddress: string, toAddress: string, amount: number, privateKey: string) => {
    // FIX: Merchants issue points from 'merchant-system' pool, not from their personal balance
    // This prevents merchants from going into negative balance
    const transaction = new Transaction('merchant-system', toAddress, amount);
    transaction.signTransaction(privateKey);

    blockchain.pendingTransactions.push(transaction);
    toast.success('Points issued from merchant pool! Mine a block to confirm the transaction.');
    setRefresh(prev => prev + 1);
  };

  const handleMineBlock = async (minerAddress: string) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        blockchain.minePendingTransactions(minerAddress);
        updateBalances();
        toast.success(`Block mined! Reward sent to miner.`);
        resolve();
      }, 100);
    });
  };

  const handleChangeDifficulty = (difficulty: number) => {
    blockchain.difficulty = difficulty;
    setRefresh(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Loyalty Points Exchange System
          </h1>
          <p className="text-muted-foreground">Blockchain-based Point Transfer Platform</p>
        </div>

        <BlockchainVisualizer blocks={blockchain.chain} isValid={blockchain.isChainValid()} />

        <Tabs defaultValue="wallets" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="wallets">Wallets</TabsTrigger>
            <TabsTrigger value="transfer">Transfer</TabsTrigger>
            <TabsTrigger value="merchant">Merchant</TabsTrigger>
            <TabsTrigger value="mining">Mining</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="wallets">
            <WalletManagerComponent
              wallets={wallets}
              onCreateWallet={handleCreateWallet}
              balances={balances}
            />
          </TabsContent>

          <TabsContent value="transfer">
            <TransactionForm
              wallets={wallets}
              onSubmitTransaction={handleSubmitTransaction}
              balances={balances}
            />
          </TabsContent>

          <TabsContent value="merchant">
            <MerchantPanel wallets={wallets} onIssuePoints={handleIssuePoints} />
          </TabsContent>

          <TabsContent value="mining">
            <MiningPanel
              wallets={wallets}
              pendingTransactions={blockchain.pendingTransactions.length}
              difficulty={blockchain.difficulty}
              onMineBlock={handleMineBlock}
              onChangeDifficulty={handleChangeDifficulty}
            />
          </TabsContent>

          <TabsContent value="history">
            <TransactionHistory transactions={blockchain.getAllTransactions()} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}