const express = require("express");
const bcrypt = require("bcryptjs");
const { store } = require("../data/store");
const { sanitizeUser } = require("../utils/sanitize");
const { ensureAuthenticated, ensureAdmin } = require("../middlewares/auth");
const { validateRequest } = require("../middlewares/validateRequest");
const {
  userIdParam,
  updateUserValidation,
  patchUserValidation
} = require("../validators/userValidators");

const router = express.Router();

function canAccessUser(req, userId) {
  return req.user.role === "admin" || req.user.id === userId;
}

router.get("/", ensureAdmin, (req, res) => {
  res.json({ users: store.users.map(sanitizeUser) });
});

router.get("/:id", ensureAuthenticated, userIdParam, validateRequest, (req, res) => {
  const userId = Number(req.params.id);

  if (!canAccessUser(req, userId)) {
    return res.status(403).json({ error: "Sem permissao para acessar este perfil" });
  }

  const user = store.users.find((item) => item.id === userId);
  if (!user) {
    return res.status(404).json({ error: "Usuario nao encontrado" });
  }

  return res.json({ user: sanitizeUser(user) });
});

router.put(
  "/:id",
  ensureAuthenticated,
  userIdParam,
  updateUserValidation,
  validateRequest,
  async (req, res, next) => {
    try {
      const userId = Number(req.params.id);
      if (!canAccessUser(req, userId)) {
        return res.status(403).json({ error: "Sem permissao para editar este perfil" });
      }

      const user = store.users.find((item) => item.id === userId);
      if (!user) {
        return res.status(404).json({ error: "Usuario nao encontrado" });
      }

      const { name, email, password, role } = req.body;
      user.name = name;
      user.email = email.toLowerCase();
      user.role = req.user.role === "admin" && role ? role : user.role;
      user.passwordHash = await bcrypt.hash(password, 10);

      return res.json({ user: sanitizeUser(user) });
    } catch (error) {
      return next(error);
    }
  }
);

router.patch(
  "/:id",
  ensureAuthenticated,
  userIdParam,
  patchUserValidation,
  validateRequest,
  async (req, res, next) => {
    try {
      const userId = Number(req.params.id);
      if (!canAccessUser(req, userId)) {
        return res.status(403).json({ error: "Sem permissao para editar este perfil" });
      }

      const user = store.users.find((item) => item.id === userId);
      if (!user) {
        return res.status(404).json({ error: "Usuario nao encontrado" });
      }

      const { name, email, password, role } = req.body;

      if (name !== undefined) user.name = name;
      if (email !== undefined) user.email = email.toLowerCase();
      if (password !== undefined) user.passwordHash = await bcrypt.hash(password, 10);
      if (role !== undefined && req.user.role === "admin") user.role = role;

      return res.json({ user: sanitizeUser(user) });
    } catch (error) {
      return next(error);
    }
  }
);

router.delete("/:id", ensureAuthenticated, userIdParam, validateRequest, (req, res) => {
  const userId = Number(req.params.id);

  if (!canAccessUser(req, userId) && req.user.role !== "admin") {
    return res.status(403).json({ error: "Sem permissao para excluir este perfil" });
  }

  const userIndex = store.users.findIndex((item) => item.id === userId);
  if (userIndex === -1) {
    return res.status(404).json({ error: "Usuario nao encontrado" });
  }

  const [removedUser] = store.users.splice(userIndex, 1);

  if (req.user.id === userId) {
    req.logout(() => {});
  }

  return res.json({ removed: sanitizeUser(removedUser) });
});

module.exports = {
  userRoutes: router
};
