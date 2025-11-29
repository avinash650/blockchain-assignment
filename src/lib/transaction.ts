import CryptoJS from 'crypto-js';

export class Transaction {
  public timestamp: number;
  public signature: string;

  constructor(
    public fromAddress: string,
    public toAddress: string,
    public amount: number
  ) {
    this.timestamp = Date.now();
    this.signature = '';
  }

  calculateHash(): string {
    return CryptoJS.SHA256(
      this.fromAddress + this.toAddress + this.amount + this.timestamp
    ).toString();
  }

  signTransaction(signingKey: string): void {
    this.signature = CryptoJS.HmacSHA256(this.calculateHash(), signingKey).toString();
  }

  isValid(): boolean {
    // System transactions (mining rewards and merchant issuance) are always valid
    if (this.fromAddress === 'system' || this.fromAddress === 'merchant-system') return true;
    
    if (!this.signature || this.signature.length === 0) {
      return false;
    }

    return true;
  }
}