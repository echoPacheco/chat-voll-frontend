# Chat Voll - Frontend

Este é o frontend da aplicação **Chat Voll**, desenvolvida com **Ruby on Rails**, **Vue.js** e **PostgreSQL**, com suporte a autenticação de usuários, envio de mensagens, upload de arquivos e visualização de métricas.

## Tecnologias Utilizadas

- **Vue.js**
- **Vue Router**
- **Vuex**
- **Tailwind CSS**
- **Yarn**

## Requisitos

- Node.js (versão utilizada: 16.20.2)
- Yarn (versão utilizada: 1.22.22)

## Como rodar o projeto

1. **Clone o repositório**

```bash
git clone https://github.com/echoPacheco/chat-voll-frontend
cd chat-voll-frontend
```
2. **Instale as dependências com Yarn**
```bash
yarn install
```

3. **Execute o servidor de desenvolvimento**

```bash
yarn dev
```

4. **Acesse no navegador:**
```bash
http://localhost:8080
```


**✅ Funcionalidades**

- Envio de mensagens entre usuários

- Autenticação utilizando token JWT

- Comunicação em tempo real via WebSocket

- Suporte ao envio de arquivos

- Paginação na listagem de mensagens

- Endpoint de métricas