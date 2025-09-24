# SaaS de Comunicação

Um simples SaaS de comunicação desenvolvido com Node.js e Express.

## Funcionalidades

- Sistema de autenticação de usuários (registro, login, gerenciamento de perfil)
- Envio e recebimento de mensagens
- API RESTful para integração com outros sistemas

## Tecnologias Utilizadas

- Node.js
- Express
- JWT para autenticação
- bcryptjs para criptografia de senhas

## Estrutura do Projeto

```
├── src/
│   ├── controllers/     # Controladores da aplicação
│   ├── middleware/      # Middlewares personalizados
│   ├── routes/          # Rotas da API
│   └── server.js        # Ponto de entrada da aplicação
├── .env                 # Variáveis de ambiente
├── package.json         # Dependências e scripts
└── README.md           # Documentação
```

## Instalação

1. Clone o repositório
2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente no arquivo `.env`
4. Inicie o servidor:

```bash
npm start
```

Para desenvolvimento, use:

```bash
npm run dev
```

## API Endpoints

### Autenticação

- `POST /api/users/register` - Registrar um novo usuário
- `POST /api/users/login` - Login de usuário

### Usuários

- `GET /api/users/profile` - Obter perfil do usuário atual
- `PUT /api/users/profile` - Atualizar perfil do usuário
- `DELETE /api/users/profile` - Excluir perfil do usuário

### Mensagens

- `GET /api/messages` - Listar todas as mensagens do usuário
- `GET /api/messages/:id` - Obter uma mensagem específica
- `POST /api/messages` - Criar uma nova mensagem
- `PUT /api/messages/:id` - Atualizar uma mensagem
- `DELETE /api/messages/:id` - Excluir uma mensagem

## Formato das Mensagens

Exemplo de uma mensagem:

```json
{
  "id": "1621543164853",
  "userId": "1621543164000",
  "recipient": "usuario@exemplo.com",
  "subject": "Assunto da mensagem",
  "content": "Conteúdo da mensagem em formato texto",
  "createdAt": "2023-05-20T15:26:04.853Z",
  "read": false
}
```

## Licença

MIT
