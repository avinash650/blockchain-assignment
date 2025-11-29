import { Block } from '@/lib/blockchain';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Link2 } from 'lucide-react';

interface BlockchainVisualizerProps {
  blocks: Block[];
  isValid: boolean;
}

export default function BlockchainVisualizer({ blocks, isValid }: BlockchainVisualizerProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Blockchain Visualization</CardTitle>
          <Badge variant={isValid ? 'default' : 'destructive'} className="flex items-center gap-1">
            {isValid ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            {isValid ? 'Valid Chain' : 'Invalid Chain'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex overflow-x-auto gap-4 pb-4">
          {blocks.map((block, index) => (
            <div key={block.index} className="flex items-center">
              <Card className="min-w-[280px] bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Block #{block.index}</CardTitle>
                    <Badge variant="outline">{block.transactions.length} txs</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div>
                    <p className="font-semibold text-xs text-muted-foreground">Hash:</p>
                    <p className="font-mono text-xs break-all">{block.hash.substring(0, 20)}...</p>
                  </div>
                  <div>
                    <p className="font-semibold text-xs text-muted-foreground">Previous Hash:</p>
                    <p className="font-mono text-xs break-all">
                      {block.previousHash === '0' ? 'Genesis' : `${block.previousHash.substring(0, 20)}...`}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-xs text-muted-foreground">Nonce:</p>
                    <p className="font-mono text-xs">{block.nonce}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-xs text-muted-foreground">Timestamp:</p>
                    <p className="text-xs">{new Date(block.timestamp).toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>
              {index < blocks.length - 1 && (
                <Link2 className="w-8 h-8 text-blue-500 mx-2 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}