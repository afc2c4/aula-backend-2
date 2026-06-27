# E-commerce Full Stack (React + Express)

Projeto de e-commerce com arquitetura cliente-servidor dividido em duas camadas:

- Frontend em React (Vite)
- Backend em Node.js com Express (API RESTful)

## Estrutura

- `backend`: API com autenticação, sessão e regras de negócio
- `frontend`: interface web com catálogo, carrinho e painel administrativo

## Funcionalidades Implementadas

### Backend

- Roteamento modular em `express.Router`:
	- `/api/auth`
	- `/api/users`
	- `/api/products`
	- `/api/orders`
- Métodos HTTP completos:
	- `GET`, `POST`, `PUT`, `PATCH`, `DELETE`
- Parâmetros de rota e query params:
	- `GET /api/products/:id`
	- `GET /api/products?category=...&sort=price_asc&q=...`
- Validação e sanitização com `express-validator`
- Middlewares customizados:
	- log de requisições
	- tratamento global de erros
	- filtro de upload de imagens via `multer`
- Autenticação com `Passport.js` (estratégia local)
- Sessões no servidor com `express-session`
- Cookies HTTP-only para manter login

### Frontend

- Catálogo de produtos com filtros e busca
- Página de detalhes por produto (`/products/:id`)
- Login e cadastro com tratamento de erros da API
- Carrinho com adição, remoção, ajuste de quantidade e checkout
- Painel administrativo protegido para:
	- criar/remover produtos
	- atualizar status de pedidos

## Como Executar

### 1) Backend

```bash
cd backend
npm install
npm run dev
```

Servidor em `http://localhost:3000`.

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Aplicação em `http://localhost:5173`.

O frontend está configurado com proxy para `/api` apontando para `http://localhost:3000`.

## Usuário Admin Inicial

- Email: `admin@shop.com`
- Senha: `admin123`

## Observações

- Os dados estão em memória (`backend/src/data/store.js`), sem banco persistente.
- Reiniciar o backend limpa usuários/produtos/pedidos criados em tempo de execução.

## Tutorial Backend

Foi criada uma pasta com tutorial detalhado de cada requisito funcional do backend:

- `tutorial/backend/README.md`
- `tutorial/backend/01-roteamento-modularizado.md`
- `tutorial/backend/02-metodos-http-crud.md`
- `tutorial/backend/03-parametros-rota-e-query.md`
- `tutorial/backend/04-validacao-e-sanitizacao.md`
- `tutorial/backend/05-middlewares-customizados.md`
- `tutorial/backend/06-passport-sessoes-cookies.md`