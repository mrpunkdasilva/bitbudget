import express from 'express';
import { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get all categories
router.get('/', protect, getCategories);

// Get a category by ID
router.get('/:id', protect, getCategoryById);

// Create a new category
router.post('/', protect, createCategory);

// Update a category
router.put('/:id', protect, updateCategory);

// Delete a category
router.delete('/:id', protect, deleteCategory);

export default router;