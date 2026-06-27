Este código-fonte é o coração do sistema de **Autenticação e Sessão** da sua aplicação. Ele utiliza o **Passport.js** (o middleware de autenticação padrão do ecossistema Node.js) configurado com a estratégia **Local** (autenticação tradicional por e-mail e senha).

Abaixo está a explicação detalhada e arquitetural de como cada parte funciona.

---

### 1. Dependências e Configuração Inicial
```javascript
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const { store } = require("../data/store");
```
* **`passport`**: O framework de autenticação.
* **`LocalStrategy`**: Uma estratégia do Passport para autenticar usuários localmente usando um banco de dados próprio (em vez de OAuth como Google ou Facebook).
* **`bcryptjs`**: Usado para comparar a senha enviada pelo usuário com o hash salvo no banco de dados.
* **`store`**: O banco de dados em memória que analisamos anteriormente.

---

### 2. A Estratégia Local (`LocalStrategy`)
Dentro de `configurePassport`, definimos como o Passport deve validar as credenciais do usuário:

```javascript
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",    // Diz ao Passport para ler o campo "email" do corpo da requisição (req.body)
      passwordField: "password"  // Diz ao Passport para ler o campo "password" do corpo da requisição
    },
    async (email, password, done) => {
      try {
        // 1. Busca o usuário pelo e-mail (convertido para minúsculo para evitar problemas de caixa alta)
        const user = store.users.find((item) => item.email === email.toLowerCase());

        // 2. Se o usuário não existir, falha silenciosamente por segurança
        if (!user) {
          return done(null, false, { message: "Credenciais invalidas" });
        }

        // 3. Compara a senha digitada com o hash salvo (ASSÍNCRONO - Não bloqueia a Event Loop)
        const isValidPassword = await bcrypt.compare(password, user.passwordHash);
        if (!isValidPassword) {
          return done(null, false, { message: "Credenciais invalidas" });
        }

        // 4. Sucesso! Retorna o objeto do usuário
        return done(null, user);
      } catch (error) {
        // Trata erros inesperados do sistema
        return done(error);
      }
    }
  )
);
```

#### 💡 Detalhe de Segurança Crítico (Prevenção de Enumeração de Usuários)
Note que se o usuário não for encontrado **OU** se a senha estiver errada, a mensagem de erro retornada é exatamente a mesma: `"Credenciais invalidas"`. 
* **Por que isso é bom?** Isso impede que um atacante mal-intencionado descubra quais e-mails estão cadastrados no seu sistema (técnica conhecida como *User Enumeration*).

---

### 3. Gerenciamento de Sessão (Serialização e Desserialização)
O Passport utiliza esses dois métodos para manter o usuário conectado entre diferentes requisições HTTP (geralmente usando cookies de sessão).

```javascript
passport.serializeUser((user, done) => {
  done(null, user.id);
});
```
* **`serializeUser` (Entrada na Sessão):** Define quais dados do usuário devem ser salvos na sessão (no Cookie enviado ao navegador). 
* **Boa prática:** Salvamos **apenas o `id`** do usuário. Isso mantém o cookie leve e seguro, evitando expor dados sensíveis como o hash da senha no navegador.

```javascript
passport.deserializeUser((id, done) => {
  const user = store.users.find((item) => item.id === id);

  if (!user) {
    return done(new Error("Usuario da sessao nao encontrado"));
  }

  return done(null, user);
});
```
* **`deserializeUser` (Recuperação da Sessão):** Em cada nova requisição que o usuário fizer, o Passport pega o `id` que estava salvo no cookie, busca o usuário completo no "banco de dados" (`store.users`) e o anexa ao objeto da requisição.
* **Resultado:** Nas suas rotas do Express, você poderá acessar o usuário logado simplesmente digitando **`req.user`** (ex: `req.user.name`, `req.user.role`).

---

### 🔄 Fluxo Completo de Login

```text
[Cliente] envia Email/Senha 
   │
   ▼
[Passport LocalStrategy] 
   │  ↳ 1. Busca usuário na 'store' pelo email
   │  ↳ 2. Compara a senha usando 'bcrypt.compare'
   │
   ├─► [Falhou] ──► Retorna "Credenciais inválidas" (401)
   │
   ▼ [Sucesso]
[serializeUser] ──► Salva apenas o ID do usuário na sessão (Cookie)
   │
   ▼
[Cliente] agora está autenticado!
```

Nas requisições seguintes, o **`deserializeUser`** entra em ação automaticamente, lê o ID do cookie, busca o usuário na `store` e popula o `req.user` para que suas rotas saibam quem está acessando.