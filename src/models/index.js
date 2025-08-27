// Modelos de dados para o SaaS de comunicação

// Modelo de Usuário
class User {
  constructor(id, name, email, password) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.createdAt = new Date().toISOString();
  }
}

// Modelo de Mensagem
class Message {
  constructor(id, userId, recipient, subject, content) {
    this.id = id;
    this.userId = userId;
    this.recipient = recipient;
    this.subject = subject;
    this.content = content;
    this.createdAt = new Date().toISOString();
    this.read = false;
  }
}

module.exports = {
  User,
  Message
};