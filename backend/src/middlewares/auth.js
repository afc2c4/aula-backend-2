function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  return res.status(401).json({ error: "Nao autenticado" });
}

function ensureAdmin(req, res, next) {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ error: "Nao autenticado" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Acesso restrito para administradores" });
  }

  return next();
}

module.exports = {
  ensureAuthenticated,
  ensureAdmin
};
