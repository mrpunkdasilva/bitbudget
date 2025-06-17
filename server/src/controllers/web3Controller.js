import { ethers } from 'ethers';
import { User, Web3Asset } from '../models/index.js';

// Simple ERC20 ABI for token balance checking
const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)'
];

// @desc    Connect wallet address to user account
// @route   POST /api/web3/connect-wallet
// @access  Private
export const connectWallet = async (req, res) => {
  try {
    const { walletAddress } = req.body;
    
    // Validate wallet address
    if (!ethers.isAddress(walletAddress)) {
      return res.status(400).json({ message: 'Invalid wallet address' });
    }
    
    // Update user with wallet address
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.walletAddress = walletAddress;
    await user.save();
    
    res.status(200).json({ 
      message: 'Wallet connected successfully',
      walletAddress
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user's wallet info
// @route   GET /api/web3/wallet-info
// @access  Private
export const getWalletInfo = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    
    if (!user || !user.walletAddress) {
      return res.status(400).json({ message: 'No wallet connected to this account' });
    }
    
    // For simplicity, we're just returning the wallet address
    // In a real app, you might fetch balance, transactions, etc.
    res.status(200).json({
      walletAddress: user.walletAddress
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Fetch and store user's token balances
// @route   POST /api/web3/sync-assets
// @access  Private
export const syncAssets = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    
    if (!user || !user.walletAddress) {
      return res.status(400).json({ message: 'No wallet connected to this account' });
    }
    
    // For simplicity, we're using a public Ethereum provider
    // In production, you should use a more reliable provider
    const provider = new ethers.JsonRpcProvider('https://eth.llamarpc.com');
    
    // Get ETH balance
    const ethBalance = await provider.getBalance(user.walletAddress);
    const formattedEthBalance = ethers.formatEther(ethBalance);
    
    // Store or update ETH balance in database
    const [ethAsset, created] = await Web3Asset.findOrCreate({
      where: {
        userId: user.id,
        symbol: 'ETH',
        tokenType: 'NATIVE',
        network: 'ethereum'
      },
      defaults: {
        name: 'Ethereum',
        symbol: 'ETH',
        balance: formattedEthBalance,
        tokenType: 'NATIVE',
        network: 'ethereum',
        userId: user.id
      }
    });
    
    if (!created) {
      ethAsset.balance = formattedEthBalance;
      ethAsset.lastUpdated = new Date();
      await ethAsset.save();
    }
    
    // For simplicity, we're just syncing ETH
    // In a real app, you would sync multiple tokens
    
    // Get all user's assets
    const assets = await Web3Asset.findAll({
      where: { userId: user.id }
    });
    
    res.status(200).json({
      message: 'Assets synced successfully',
      assets
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user's assets
// @route   GET /api/web3/assets
// @access  Private
export const getAssets = async (req, res) => {
  try {
    const assets = await Web3Asset.findAll({
      where: { userId: req.user.id },
      order: [['lastUpdated', 'DESC']]
    });
    
    res.status(200).json(assets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};