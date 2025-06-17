import express from 'express';
import { connectWallet, getWalletInfo, syncAssets, getAssets } from '../controllers/web3Controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Connect wallet
router.post('/connect-wallet', protect, connectWallet);

// Get wallet info
router.get('/wallet-info', protect, getWalletInfo);

// Sync assets
router.post('/sync-assets', protect, syncAssets);

// Get assets
router.get('/assets', protect, getAssets);

export default router;