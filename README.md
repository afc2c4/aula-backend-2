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

## Debugging com Google Chrome + DevTools (3 casos de uso)

### 1) Login/sessão (cookie + auth)

1. Abra `http://localhost:5173/login` e o DevTools (`F12`).
2. Vá em **Network** e faça login com um usuário válido (ex.: o usuário admin inicial descrito acima).
3. Inspecione `POST /api/auth/login` e depois `GET /api/auth/session`.
4. Confira em **Application > Cookies** se o cookie de sessão foi criado.
5. Se falhar, valide status HTTP, payload enviado e resposta de erro.

### 2) Filtros do catálogo (query params)

1. Na home (`/`), aplique busca, categoria e ordenação.
2. No **Network**, abra `GET /api/products?...`.
3. Verifique se os query params `q`, `category`, `sort` estão corretos.
4. Em **Response**, confirme se `data.products` veio no formato esperado.
5. Se a tela não atualizar, use **Sources > Event Listener Breakpoints** no evento `submit`.

### 3) Checkout e permissões (carrinho + admin)

1. Adicione item no catálogo, vá para `/cart` e clique em **Finalizar compra**.
2. Veja no **Network** o `POST /api/orders` com `items[{productId, quantity}]`.
3. Sem login, confirme o erro esperado: "Faça login para finalizar a compra".
4. Com login, valide sucesso e mensagem `Pedido #... criado com sucesso`.
5. Abra `/admin`: se não for admin, confirme redirecionamento para `/` (regra de `user.role !== "admin"`).