// Elementos do DOM
const authForms = document.getElementById('auth-forms');
const messageArea = document.getElementById('message-area');
const userInfo = document.getElementById('user-info');
const username = document.getElementById('username');
const messageList = document.getElementById('message-list');
const messageFormContainer = document.getElementById('message-form-container');
const messageDetails = document.getElementById('message-details');
const notification = document.getElementById('notification');

// Formulários
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const messageForm = document.getElementById('message-form');

// Botões
const logoutBtn = document.getElementById('logout-btn');
const newMessageBtn = document.getElementById('new-message-btn');
const cancelMessageBtn = document.getElementById('cancel-message');
const replyBtn = document.getElementById('reply-btn');
const deleteBtn = document.getElementById('delete-btn');

// API URL base
const API_URL = 'http://localhost:3000/api';

// Estado da aplicação
let currentUser = null;
let messages = [];
let currentMessage = null;

// Verificar se o usuário está logado ao carregar a página
function checkAuth() {
  const token = localStorage.getItem('token');
  if (token) {
    // Obter informações do usuário
    fetch(`${API_URL}/users/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Sessão expirada');
      }
    })
    .then(data => {
      currentUser = data;
      showLoggedInState();
      loadMessages();
    })
    .catch(error => {
      localStorage.removeItem('token');
      showNotification('Sessão expirada. Por favor, faça login novamente.', true);
    });
  }
}

// Mostrar estado de usuário logado
function showLoggedInState() {
  authForms.classList.add('hidden');
  messageArea.classList.remove('hidden');
  userInfo.classList.remove('hidden');
  username.textContent = currentUser.name;
}

// Mostrar estado de usuário deslogado
function showLoggedOutState() {
  authForms.classList.remove('hidden');
  messageArea.classList.add('hidden');
  userInfo.classList.add('hidden');
  currentUser = null;
  messages = [];
  localStorage.removeItem('token');
}

// Carregar mensagens do usuário
function loadMessages() {
  const token = localStorage.getItem('token');
  if (!token) return;

  fetch(`${API_URL}/messages`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(response => response.json())
  .then(data => {
    messages = data;
    renderMessageList();
  })
  .catch(error => {
    showNotification('Erro ao carregar mensagens', true);
  });
}

// Renderizar lista de mensagens
function renderMessageList() {
  messageList.innerHTML = '';
  
  if (messages.length === 0) {
    const emptyItem = document.createElement('li');
    emptyItem.textContent = 'Nenhuma mensagem encontrada';
    messageList.appendChild(emptyItem);
    return;
  }

  messages.forEach(message => {
    const item = document.createElement('li');
    item.textContent = message.subject;
    item.dataset.id = message.id;
    
    if (!message.read) {
      item.classList.add('unread');
    }
    
    item.addEventListener('click', () => showMessageDetails(message.id));
    messageList.appendChild(item);
  });
}

// Mostrar detalhes da mensagem
function showMessageDetails(messageId) {
  const message = messages.find(m => m.id === messageId);
  if (!message) return;

  currentMessage = message;
  
  // Atualizar detalhes da mensagem
  document.getElementById('detail-subject').textContent = message.subject;
  document.getElementById('detail-sender').textContent = currentUser.email; // Simulação
  document.getElementById('detail-recipient').textContent = message.recipient;
  document.getElementById('detail-date').textContent = new Date(message.createdAt).toLocaleString();
  document.getElementById('detail-content').textContent = message.content;
  
  // Mostrar detalhes e esconder formulário
  messageDetails.classList.remove('hidden');
  messageFormContainer.classList.add('hidden');
  
  // Marcar como lida
  if (!message.read) {
    markAsRead(messageId);
  }
}

// Marcar mensagem como lida
function markAsRead(messageId) {
  const token = localStorage.getItem('token');
  if (!token) return;

  const message = messages.find(m => m.id === messageId);
  if (!message) return;

  fetch(`${API_URL}/messages/${messageId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ read: true })
  })
  .then(response => response.json())
  .then(data => {
    // Atualizar mensagem na lista
    const index = messages.findIndex(m => m.id === messageId);
    if (index !== -1) {
      messages[index].read = true;
      renderMessageList();
    }
  })
  .catch(error => {
    showNotification('Erro ao atualizar mensagem', true);
  });
}

// Mostrar formulário de nova mensagem
function showNewMessageForm() {
  messageFormContainer.classList.remove('hidden');
  messageDetails.classList.add('hidden');
  messageForm.reset();
}

// Mostrar notificação
function showNotification(message, isError = false) {
  notification.textContent = message;
  notification.classList.remove('hidden', 'error');
  
  if (isError) {
    notification.classList.add('error');
  }
  
  notification.classList.add('show');
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.classList.add('hidden'), 300);
  }, 3000);
}

// Event Listeners

// Login
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  
  fetch(`${API_URL}/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Credenciais inválidas');
    }
  })
  .then(data => {
    localStorage.setItem('token', data.token);
    showNotification('Login realizado com sucesso');
    checkAuth();
  })
  .catch(error => {
    showNotification(error.message, true);
  });
});

// Registro
registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const name = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  
  fetch(`${API_URL}/users/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, email, password })
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Erro ao registrar usuário');
    }
  })
  .then(data => {
    localStorage.setItem('token', data.token);
    showNotification('Registro realizado com sucesso');
    checkAuth();
  })
  .catch(error => {
    showNotification(error.message, true);
  });
});

// Logout
logoutBtn.addEventListener('click', () => {
  showLoggedOutState();
  showNotification('Logout realizado com sucesso');
});

// Nova mensagem
newMessageBtn.addEventListener('click', showNewMessageForm);

// Cancelar mensagem
cancelMessageBtn.addEventListener('click', () => {
  messageFormContainer.classList.add('hidden');
});

// Enviar mensagem
messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const recipient = document.getElementById('message-recipient').value;
  const subject = document.getElementById('message-subject').value;
  const content = document.getElementById('message-content').value;
  
  const token = localStorage.getItem('token');
  if (!token) return;
  
  fetch(`${API_URL}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ recipient, subject, content })
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Erro ao enviar mensagem');
    }
  })
  .then(data => {
    messages.push(data);
    renderMessageList();
    messageFormContainer.classList.add('hidden');
    showNotification('Mensagem enviada com sucesso');
  })
  .catch(error => {
    showNotification(error.message, true);
  });
});

// Responder mensagem
replyBtn.addEventListener('click', () => {
  if (!currentMessage) return;
  
  showNewMessageForm();
  
  document.getElementById('message-recipient').value = currentMessage.recipient;
  document.getElementById('message-subject').value = `Re: ${currentMessage.subject}`;
  document.getElementById('message-content').focus();
});

// Excluir mensagem
deleteBtn.addEventListener('click', () => {
  if (!currentMessage) return;
  
  const token = localStorage.getItem('token');
  if (!token) return;
  
  fetch(`${API_URL}/messages/${currentMessage.id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Erro ao excluir mensagem');
    }
  })
  .then(data => {
    // Remover mensagem da lista
    messages = messages.filter(m => m.id !== currentMessage.id);
    renderMessageList();
    messageDetails.classList.add('hidden');
    showNotification('Mensagem excluída com sucesso');
    currentMessage = null;
  })
  .catch(error => {
    showNotification(error.message, true);
  });
});

// Inicializar aplicação
checkAuth();