# 02 - Metodos HTTP (GET, POST, PUT, PATCH, DELETE)

## Objetivo

Implementar CRUD e operacoes parciais usando os verbos HTTP corretos.

## Mapeamento recomendado

- `GET`: listar e buscar recurso
- `POST`: criar recurso
- `PUT`: atualizar recurso completo
- `PATCH`: atualizar parte do recurso
- `DELETE`: remover recurso

## Exemplo pratico com produtos

### GET (listar)

```js
router.get("/", (req, res) => {
  res.json({ products: store.products });
});
```

### POST (criar)

```js
router.post("/", ensureAdmin, createProductValidation, validateRequest, (req, res) => {
  // cria produto
  res.status(201).json({ product: createdProduct });
});
```

### PUT (atualizacao completa)

```js
router.put("/:id", ensureAdmin, updateProductValidation, validateRequest, (req, res) => {
  // sobrescreve campos principais
  res.json({ product });
});
```

### PATCH (atualizacao parcial)

```js
router.patch("/:id", ensureAdmin, patchProductValidation, validateRequest, (req, res) => {
  // altera somente campos enviados
  res.json({ product });
});
```

### DELETE (remocao)

```js
router.delete("/:id", ensureAdmin, productIdParam, validateRequest, (req, res) => {
  // remove recurso
  res.json({ removed: removedProduct });
});
```

## Onde esta no projeto

- Produtos: [backend/src/routes/productRoutes.js](../../backend/src/routes/productRoutes.js)
- Usuarios: [backend/src/routes/userRoutes.js](../../backend/src/routes/userRoutes.js)
- Pedidos: [backend/src/routes/orderRoutes.js](../../backend/src/routes/orderRoutes.js)
