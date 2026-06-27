# 06 - Gestao de Identidade e Acesso (Passport, Sessao e Cookies)

## Objetivo

Autenticar usuarios, manter sessao e proteger rotas sensiveis.

## Componentes

- `passport` e `passport-local` para login por email/senha
- `express-session` para armazenar sessao no servidor
- cookie `connect.sid` (HTTP-only) para associar cliente a sessao

## 1) Configurar estrategia local

```js
// backend/src/config/passport.js
passport.use(
  new LocalStrategy({ usernameField: "email", passwordField: "password" }, async (email, password, done) => {
    // busca usuario, compara hash e retorna done(...)
  })
);
```

## 2) Serializacao da sessao

```js
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  const user = store.users.find((item) => item.id === id);
  done(null, user);
});
```

## 3) Configurar app com sessao e passport

```js
app.use(session({
  secret: process.env.SESSION_SECRET || "super-secret-session",
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, secure: false, maxAge: 1000 * 60 * 60 * 2 }
}));

app.use(passport.initialize());
app.use(passport.session());
```

## 4) Login e logout

### Login

```js
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (!user) return res.status(401).json({ error: info?.message || "Falha no login" });
    req.logIn(user, (loginError) => {
      if (loginError) return next(loginError);
      return res.json({ message: "Login realizado com sucesso" });
    });
  })(req, res, next);
});
```

### Logout

```js
router.post("/logout", (req, res, next) => {
  req.logout((error) => {
    if (error) return next(error);
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      return res.json({ message: "Logout realizado" });
    });
  });
});
```

## 5) Proteger rotas sensiveis

```js
router.post("/products", ensureAdmin, handler);
router.post("/orders", ensureAuthenticated, handler);
```

## Onde esta no projeto

- [backend/src/config/passport.js](../../backend/src/config/passport.js)
- [backend/src/app.js](../../backend/src/app.js)
- [backend/src/routes/authRoutes.js](../../backend/src/routes/authRoutes.js)
- [backend/src/middlewares/auth.js](../../backend/src/middlewares/auth.js)
