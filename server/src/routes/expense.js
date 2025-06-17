import express from 'express';
import { getTransactions, getTransactionById, createTransaction, updateTransaction, deleteTransaction, getTransactionSummary } from '../controllers/transactionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get transaction summary
router.get('/summary', protect, getTransactionSummary);

// Get all transactions
router.get('/', protect, getTransactions);

// Get a transaction by ID
router.get('/:id', protect, getTransactionById);

// Create a new transaction
router.post('/', protect, createTransaction);

// Update a transaction
router.put('/:id', protect, updateTransaction);

// Delete a transaction
router.delete('/:id', protect, deleteTransaction);

export default router;