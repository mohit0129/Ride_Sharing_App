import express from 'express';
import { 
    signin, 
    signup, 
    adminLogin, 
    adminRegister,
    refreshToken, 
    getAllUsers, 
    getUserById, 
    updateUser, 
    updateUserStatus, 
    deleteUser, 
    createUser
  } from '../controllers/auth.js';
  import auth, { restrictTo } from '../middleware/authentication.js';
import authMiddleware from '../middleware/authentication.js';

const router = express.Router();

router.post('/refresh-token', refreshToken);
router.post('/signin', signin);
router.post('/signup', signup);

// Admin routes
router.post('/admin/register', adminRegister);
router.post('/admin/login', adminLogin);

// User management routes (admin only)
router.get('/users', auth, restrictTo("admin"), getAllUsers);
router.get('/users/:id', auth, restrictTo("admin"), getUserById);
router.put('/users/:id', auth, restrictTo("admin"), updateUser);
router.patch('/users/:id/status', auth, restrictTo("admin"), updateUserStatus);
router.delete('/users/:id', auth, restrictTo("admin"), deleteUser);
router.post('/users', auth, restrictTo("admin"), createUser);

export default router;