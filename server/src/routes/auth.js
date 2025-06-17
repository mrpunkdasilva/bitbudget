import express from 'express';
import { register, verifyEmail, login, forgotPassword, resetPassword } from '../controllers/authController.js';

const router = express.Router();

// Register a new user
router.post('/register', register);

// Verify email
router.get('/verify/:token', verifyEmail);

// Login user
router.post('/login', login);

// Forgot password
router.post('/forgot-password', forgotPassword);

// Reset password
router.post('/reset-password/:token', resetPassword);

export default router;