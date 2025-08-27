const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { 
  getMessages, 
  getMessage, 
  createMessage, 
  updateMessage, 
  deleteMessage 
} = require('../controllers/messageController');

// Rotas protegidas por autenticação
router.use(authenticate);

// Obter todas as mensagens
router.get('/', getMessages);

// Obter uma mensagem específica
router.get('/:id', getMessage);

// Criar uma nova mensagem
router.post('/', createMessage);

// Atualizar uma mensagem
router.put('/:id', updateMessage);

// Excluir uma mensagem
router.delete('/:id', deleteMessage);

module.exports = router;