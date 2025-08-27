const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { 
  registerUser, 
  loginUser, 
  getProfile, 
  updateProfile, 
  deleteProfile 
} = require('../controllers/userController');

// Rotas públicas
router.post('/register', registerUser);
router.post('/login', loginUser);

// Rotas protegidas por autenticação
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.delete('/profile', authenticate, deleteProfile);

module.exports = router;