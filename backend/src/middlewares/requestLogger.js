function requestLogger(req, res, next) {
  const startedAt = Date.now();

  res.on("finish", () => {
    const elapsed = Date.now() - startedAt;
    // Log sucinto para rastrear latencia e fluxo das rotas.
    console.log(`[custom-log] ${req.method} ${req.originalUrl} ${res.statusCode} - ${elapsed}ms`);
  });

  next();
}

module.exports = {
  requestLogger
};
