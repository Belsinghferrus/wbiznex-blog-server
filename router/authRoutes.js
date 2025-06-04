import express from 'express'
import { login, register, logout, checkAuth } from '../controller/auth.js';
import protectRoute from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login)
router.post('/logout', logout)
router.get('/verify', protectRoute, checkAuth)


export default router