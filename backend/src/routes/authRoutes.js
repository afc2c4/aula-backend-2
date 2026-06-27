const express = require("express");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const { store, getNextId } = require("../data/store");
const { sanitizeUser } = require("../utils/sanitize");
const { validateRequest } = require("../middlewares/validateRequest");
const { registerValidation } = require("../validators/userValidators");

const router = express.Router();

router.post("/register", registerValidation, validateRequest, async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email.toLowerCase();

    const existingUser = store.users.find((user) => user.email === normalizedEmail);
    if (existingUser) {
      return res.status(409).json({ error: "Email ja cadastrado" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = {
      id: getNextId("users"),
      name,
      email: normalizedEmail,
      passwordHash,
      role: "customer"
    };

    store.users.push(newUser);

    return res.status(201).json({ user: sanitizeUser(newUser) });
  } catch (error) {
    return next(error);
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({ error: info?.message || "Falha no login" });
    }

    return req.logIn(user, (loginError) => {
      if (loginError) {
        return next(loginError);
      }

      return res.json({
        message: "Login realizado com sucesso",
        user: sanitizeUser(user)
      });
    });
  })(req, res, next);
});

router.post("/logout", (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }

    req.session.destroy((sessionError) => {
      if (sessionError) {
        return next(sessionError);
      }

      res.clearCookie("connect.sid");
      return res.json({ message: "Logout realizado" });
    });
  });
});

router.get("/session", (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ error: "Nenhuma sessao ativa" });
  }

  return res.json({ user: sanitizeUser(req.user) });
});

module.exports = {
  authRoutes: router
};
