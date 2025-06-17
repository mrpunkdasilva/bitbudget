export type Web3Asset = {
  id: string;
  name: string;
  symbol: string;
  balance: string;
  tokenAddress?: string;
  tokenType: 'NATIVE' | 'ERC20' | 'ERC721' | 'ERC1155';
  network: string;
  lastUpdated: string;
  userId: string;
};