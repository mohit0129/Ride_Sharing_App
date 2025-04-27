// admin.js routes
import express from 'express';
import auth, { restrictTo, hasAdminPermission } from '../middleware/authentication.js';

const router = express.Router();

// Example of protected admin routes
router.get('/dashboard', auth, restrictTo('admin'), (req, res) => {
  res.status(200).json({ message: 'Admin dashboard access granted' });
});

// Example of permission-based route
router.post('/settings', auth, restrictTo('admin'), hasAdminPermission('manage'), (req, res) => {
  res.status(200).json({ message: 'Admin settings access granted' });
});

export default router;