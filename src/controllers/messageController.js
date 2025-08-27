// Simulação de banco de dados com array
let messages = [];

// Obter todas as mensagens
const getMessages = (req, res) => {
  // Filtrar mensagens pelo usuário atual
  const userMessages = messages.filter(message => message.userId === req.user.id);
  res.json(userMessages);
};

// Obter uma mensagem específica
const getMessage = (req, res) => {
  const message = messages.find(
    message => message.id === req.params.id && message.userId === req.user.id
  );

  if (!message) {
    return res.status(404).json({ message: 'Mensagem não encontrada' });
  }

  res.json(message);
};

// Criar uma nova mensagem
const createMessage = (req, res) => {
  const { recipient, subject, content } = req.body;

  // Validação básica
  if (!recipient || !subject || !content) {
    return res.status(400).json({ message: 'Por favor, forneça destinatário, assunto e conteúdo' });
  }

  // Criar nova mensagem
  const newMessage = {
    id: Date.now().toString(),
    userId: req.user.id,
    recipient,
    subject,
    content,
    createdAt: new Date().toISOString(),
    read: false
  };

  // Adicionar ao array de mensagens
  messages.push(newMessage);

  res.status(201).json(newMessage);
};

// Atualizar uma mensagem
const updateMessage = (req, res) => {
  const { recipient, subject, content } = req.body;

  // Encontrar índice da mensagem
  const index = messages.findIndex(
    message => message.id === req.params.id && message.userId === req.user.id
  );

  if (index === -1) {
    return res.status(404).json({ message: 'Mensagem não encontrada' });
  }

  // Atualizar mensagem
  messages[index] = {
    ...messages[index],
    recipient: recipient || messages[index].recipient,
    subject: subject || messages[index].subject,
    content: content || messages[index].content,
    updatedAt: new Date().toISOString()
  };

  res.json(messages[index]);
};

// Excluir uma mensagem
const deleteMessage = (req, res) => {
  // Encontrar índice da mensagem
  const index = messages.findIndex(
    message => message.id === req.params.id && message.userId === req.user.id
  );

  if (index === -1) {
    return res.status(404).json({ message: 'Mensagem não encontrada' });
  }

  // Remover mensagem
  const deletedMessage = messages.splice(index, 1)[0];

  res.json({ message: 'Mensagem excluída com sucesso', deletedMessage });
};

module.exports = {
  getMessages,
  getMessage,
  createMessage,
  updateMessage,
  deleteMessage
};