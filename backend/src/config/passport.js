const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const { store } = require("../data/store");

function configurePassport() {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password"
      },
      async (email, password, done) => {
        try {
          const user = store.users.find((item) => item.email === email.toLowerCase());

          if (!user) {
            return done(null, false, { message: "Credenciais invalidas" });
          }

          const isValidPassword = await bcrypt.compare(password, user.passwordHash);
          if (!isValidPassword) {
            return done(null, false, { message: "Credenciais invalidas" });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    const user = store.users.find((item) => item.id === id);

    if (!user) {
      return done(new Error("Usuario da sessao nao encontrado"));
    }

    return done(null, user);
  });
}

module.exports = {
  configurePassport
};
