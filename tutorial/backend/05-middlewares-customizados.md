# 05 - Middlewares Customizados (Fluxo e Regras)

## Objetivo

Usar middlewares para interceptar requisicoes e aplicar politicas transversais:

- observabilidade (logs)
- padronizacao de erros
- validacao de tipo de arquivo
- protecao de rotas

## 1) Logger de requisicoes

```js
// backend/src/middlewares/requestLogger.js
function requestLogger(req, res, next) {
  const startedAt = Date.now();

  res.on("finish", () => {
    const elapsed = Date.now() - startedAt;
    console.log(`[custom-log] ${req.method} ${req.originalUrl} ${res.statusCode} - ${elapsed}ms`);
  });

  next();
}
```

Registrado globalmente em [backend/src/app.js](../../backend/src/app.js).

## 2) Tratamento global de erros

```js
// backend/src/middlewares/errorHandler.js
function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || "Erro interno do servidor";
  res.status(status).json({ error: message });
}
```

Aplicado ao final da cadeia de middlewares em [backend/src/app.js](../../backend/src/app.js).

## 3) Verificacao de upload de imagem

```js
// backend/src/middlewares/upload.js
const multer = require("multer");

function fileFilter(req, file, cb) {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Apenas arquivos de imagem sao permitidos"));
  }

  return cb(null, true);
}
```

Aplicacao em rota de criacao de produto:

```js
router.post("/", ensureAdmin, upload.single("image"), createProductValidation, validateRequest, handler);
```

## 4) Middlewares de autenticacao/autorizacao

- `ensureAuthenticated`
- `ensureAdmin`

Implementados em [backend/src/middlewares/auth.js](../../backend/src/middlewares/auth.js).
