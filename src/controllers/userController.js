const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Simulação de banco de dados com array
let users = [];

// Registrar um novo usuário
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validação básica
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Por favor, forneça nome, email e senha' });
    }

    // Verificar se o usuário já existe
    if (users.find(user => user.email === email)) {
      return res.status(400).json({ message: 'Usuário já existe com este email' });
    }

    // Hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Criar novo usuário
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    // Adicionar ao array de usuários
    users.push(newUser);

    // Gerar token JWT
    const token = jwt.sign(
      { id: newUser.id, name: newUser.name, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.status(201).json({
      message: 'Usuário registrado com sucesso',
      token
    });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ message: 'Erro ao registrar usuário' });
  }
};

// Login de usuário
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validação básica
    if (!email || !password) {
      return res.status(400).json({ message: 'Por favor, forneça email e senha' });
    }

    // Verificar se o usuário existe
    const user = users.find(user => user.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Verificar senha
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({
      message: 'Login realizado com sucesso',
      token
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ message: 'Erro ao fazer login' });
  }
};

// Obter perfil do usuário
const getProfile = (req, res) => {
  const user = users.find(user => user.id === req.user.id);

  if (!user) {
    return res.status(404).json({ message: 'Usuário não encontrado' });
  }

  // Remover senha do objeto de resposta
  const { password, ...userWithoutPassword } = user;

  res.json(userWithoutPassword);
};

// Atualizar perfil do usuário
const updateProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Encontrar índice do usuário
    const index = users.findIndex(user => user.id === req.user.id);

    if (index === -1) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Preparar dados atualizados
    let updatedUser = { ...users[index] };

    if (name) updatedUser.name = name;
    if (email) updatedUser.email = email;
    
    // Atualizar senha se fornecida
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updatedUser.password = await bcrypt.hash(password, salt);
    }

    updatedUser.updatedAt = new Date().toISOString();

    // Atualizar usuário no array
    users[index] = updatedUser;

    // Remover senha do objeto de resposta
    const { password: pwd, ...userWithoutPassword } = updatedUser;

    res.json({
      message: 'Perfil atualizado com sucesso',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ message: 'Erro ao atualizar perfil' });
  }
};

// Excluir perfil do usuário
const deleteProfile = (req, res) => {
  // Encontrar índice do usuário
  const index = users.findIndex(user => user.id === req.user.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Usuário não encontrado' });
  }

  // Remover usuário
  const deletedUser = users.splice(index, 1)[0];

  // Remover senha do objeto de resposta
  const { password, ...userWithoutPassword } = deletedUser;

  res.json({
    message: 'Perfil excluído com sucesso',
    user: userWithoutPassword
  });
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  deleteProfile
};