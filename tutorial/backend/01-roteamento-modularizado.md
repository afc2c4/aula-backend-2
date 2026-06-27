# 01 - Roteamento Modularizado (Roteadores)

## Objetivo

Organizar as rotas por dominio para manter o backend escalavel e facil de manter.

No projeto, os dominios sao separados em:

- autenticacao (`/api/auth`)
- usuarios (`/api/users`)
- produtos (`/api/products`)
- pedidos (`/api/orders`)

## Passo a passo

### 1. Criar um roteador por dominio

Exemplo para produtos:

```js
// backend/src/routes/productRoutes.js
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ products: [] });
});

module.exports = { productRoutes: router };
```

### 2. Registrar rotas no app principal

```js
// backend/src/app.js
const { productRoutes } = require("./routes/productRoutes");

app.use("/api/products", productRoutes);
```

### 3. Repetir para os demais dominios

- [backend/src/routes/authRoutes.js](../../backend/src/routes/authRoutes.js)
- [backend/src/routes/userRoutes.js](../../backend/src/routes/userRoutes.js)
- [backend/src/routes/orderRoutes.js](../../backend/src/routes/orderRoutes.js)

## Beneficios

- Facilita manutencao e leitura
- Diminui acoplamento entre features
- Permite evoluir cada dominio separadamente

## Onde esta no projeto

- [backend/src/app.js](../../backend/src/app.js)
- [backend/src/routes/authRoutes.js](../../backend/src/routes/authRoutes.js)
- [backend/src/routes/userRoutes.js](../../backend/src/routes/userRoutes.js)
- [backend/src/routes/productRoutes.js](../../backend/src/routes/productRoutes.js)
- [backend/src/routes/orderRoutes.js](../../backend/src/routes/orderRoutes.js)
