const express = require("express");
const { store, getNextId } = require("../data/store");
const { ensureAuthenticated, ensureAdmin } = require("../middlewares/auth");
const { validateRequest } = require("../middlewares/validateRequest");
const {
  orderIdParam,
  createOrderValidation,
  patchOrderStatusValidation
} = require("../validators/orderValidators");

const router = express.Router();

router.get("/", ensureAuthenticated, (req, res) => {
  const orders =
    req.user.role === "admin"
      ? store.orders
      : store.orders.filter((order) => order.userId === req.user.id);

  res.json({ orders });
});

router.get("/:id", ensureAuthenticated, orderIdParam, validateRequest, (req, res) => {
  const id = Number(req.params.id);
  const order = store.orders.find((item) => item.id === id);

  if (!order) {
    return res.status(404).json({ error: "Pedido nao encontrado" });
  }

  if (req.user.role !== "admin" && order.userId !== req.user.id) {
    return res.status(403).json({ error: "Sem permissao para visualizar este pedido" });
  }

  return res.json({ order });
});

router.post("/", ensureAuthenticated, createOrderValidation, validateRequest, (req, res) => {
  const { items } = req.body;

  const detailedItems = [];
  let total = 0;

  for (const item of items) {
    const product = store.products.find((prod) => prod.id === Number(item.productId));

    if (!product || !product.active) {
      return res.status(400).json({ error: `Produto ${item.productId} indisponivel` });
    }

    if (product.stock < Number(item.quantity)) {
      return res.status(400).json({
        error: `Estoque insuficiente para ${product.name}`
      });
    }

    const quantity = Number(item.quantity);
    const unitPrice = Number(product.price);
    const subtotal = unitPrice * quantity;

    detailedItems.push({
      productId: product.id,
      name: product.name,
      quantity,
      unitPrice,
      subtotal
    });

    total += subtotal;
  }

  for (const item of detailedItems) {
    const product = store.products.find((prod) => prod.id === item.productId);
    product.stock -= item.quantity;
  }

  const order = {
    id: getNextId("orders"),
    userId: req.user.id,
    items: detailedItems,
    status: "pending",
    total,
    createdAt: new Date().toISOString()
  };

  store.orders.push(order);

  return res.status(201).json({ order });
});

router.patch(
  "/:id/status",
  ensureAdmin,
  orderIdParam,
  patchOrderStatusValidation,
  validateRequest,
  (req, res) => {
    const id = Number(req.params.id);
    const order = store.orders.find((item) => item.id === id);

    if (!order) {
      return res.status(404).json({ error: "Pedido nao encontrado" });
    }

    order.status = req.body.status;
    return res.json({ order });
  }
);

router.delete("/:id", ensureAuthenticated, orderIdParam, validateRequest, (req, res) => {
  const id = Number(req.params.id);
  const orderIndex = store.orders.findIndex((item) => item.id === id);

  if (orderIndex === -1) {
    return res.status(404).json({ error: "Pedido nao encontrado" });
  }

  const order = store.orders[orderIndex];
  const canDelete = req.user.role === "admin" || order.userId === req.user.id;

  if (!canDelete) {
    return res.status(403).json({ error: "Sem permissao para cancelar este pedido" });
  }

  if (order.status !== "pending" && req.user.role !== "admin") {
    return res.status(400).json({ error: "Apenas pedidos pendentes podem ser cancelados" });
  }

  const [removedOrder] = store.orders.splice(orderIndex, 1);
  return res.json({ removed: removedOrder });
});

module.exports = {
  orderRoutes: router
};
