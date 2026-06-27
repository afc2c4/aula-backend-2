# 03 - Parametros de Rota e Parametros de Consulta

## Objetivo

Permitir navegação e busca flexivel por recursos da API.

## Parametros de rota

Usados para identificar um recurso especifico.

Exemplo:

- `GET /api/products/:id`

```js
router.get("/:id", productIdParam, validateRequest, (req, res) => {
  const id = Number(req.params.id);
  const product = store.products.find((item) => item.id === id);

  if (!product) {
    return res.status(404).json({ error: "Produto nao encontrado" });
  }

  return res.json({ product });
});
```

## Query params

Usados para filtro, busca e ordenacao.

Exemplo:

- `GET /api/products?category=eletronicos&sort=price_asc&q=notebook`

```js
router.get("/", (req, res) => {
  const { category, minPrice, maxPrice, sort, q } = req.query;
  let products = [...store.products];

  if (category) {
    products = products.filter((item) => item.category.toLowerCase() === String(category).toLowerCase());
  }

  if (minPrice) {
    products = products.filter((item) => item.price >= Number(minPrice));
  }

  if (maxPrice) {
    products = products.filter((item) => item.price <= Number(maxPrice));
  }

  if (sort === "price_asc") {
    products.sort((a, b) => a.price - b.price);
  }

  res.json({ products });
});
```

## Boas praticas

- Validar `:id` com `express-validator`
- Converter valores numericos de query (`Number(...)`)
- Retornar `404` quando o recurso nao existir

## Onde esta no projeto

- [backend/src/routes/productRoutes.js](../../backend/src/routes/productRoutes.js)
- [backend/src/validators/productValidators.js](../../backend/src/validators/productValidators.js)
