import CryptoJS from 'crypto-js';

export interface Wallet {
  address: string;
  privateKey: string;
  name: string;
  type: 'user' | 'merchant';
}

export class WalletManager {
  static createWallet(name: string, type: 'user' | 'merchant' = 'user'): Wallet {
    const privateKey = CryptoJS.lib.WordArray.random(32).toString();
    const address = CryptoJS.SHA256(privateKey + Date.now()).toString().substring(0, 40);

    return {
      address,
      privateKey,
      name,
      type
    };
  }

  static getShortAddress(address: string): string {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  }
}