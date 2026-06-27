# 04 - Seguranca e Validacao de Entrada (express-validator)

## Objetivo

Garantir que dados recebidos em criacao/edicao tenham formato valido antes da regra de negocio.

## Estrategia

1. Definir regras de validacao em arquivos separados por dominio.
2. Aplicar essas regras na rota.
3. Centralizar resposta de erro em middleware de validacao.

## Exemplo de regras

```js
// backend/src/validators/userValidators.js
const { body } = require("express-validator");

const registerValidation = [
  body("name").isLength({ min: 2 }).trim().escape(),
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 6 }).trim()
];
```

## Middleware de consolidacao de erros

```js
// backend/src/middlewares/validateRequest.js
const { validationResult } = require("express-validator");

function validateRequest(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
}
```

## Aplicando na rota

```js
router.post("/register", registerValidation, validateRequest, async (req, res) => {
  // so entra aqui se passou na validacao
});
```

## Onde esta no projeto

- [backend/src/validators/userValidators.js](../../backend/src/validators/userValidators.js)
- [backend/src/validators/productValidators.js](../../backend/src/validators/productValidators.js)
- [backend/src/validators/orderValidators.js](../../backend/src/validators/orderValidators.js)
- [backend/src/middlewares/validateRequest.js](../../backend/src/middlewares/validateRequest.js)
