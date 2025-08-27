const jwt = require('jsonwebtoken');

// Middleware para autenticação de usuários
const authenticate = (req, res, next) => {
  try {
    // Verificar se o token está presente no cabeçalho
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
    }

    // Extrair o token do cabeçalho
    const token = authHeader.split(' ')[1];

    // Verificar e decodificar o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Adicionar o usuário decodificado à requisição
    req.user = decoded;

    // Prosseguir para o próximo middleware ou controlador
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
};

module.exports = { authenticate };