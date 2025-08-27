const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');

// Carregar variáveis de ambiente
dotenv.config();

// Inicializar o app Express
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// Importar rotas
const messageRoutes = require('./routes/messageRoutes');
const userRoutes = require('./routes/userRoutes');

// Usar rotas
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);

// Rota básica
app.get('/', (req, res) => {
  res.json({ message: 'Bem-vindo à API do SaaS de Comunicação' });
});

// Porta
const PORT = process.env.PORT || 3000;

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});