const { body, param } = require("express-validator");

const orderIdParam = param("id").isInt({ min: 1 }).withMessage("ID invalido");

const createOrderValidation = [
  body("items")
    .isArray({ min: 1 })
    .withMessage("Pedido precisa de pelo menos um item"),
  body("items.*.productId")
    .isInt({ min: 1 })
    .withMessage("productId precisa ser inteiro positivo"),
  body("items.*.quantity")
    .isInt({ min: 1 })
    .withMessage("quantity precisa ser inteiro positivo")
];

const patchOrderStatusValidation = [
  body("status")
    .isIn(["pending", "paid", "shipped", "cancelled"])
    .withMessage("Status invalido")
];

module.exports = {
  orderIdParam,
  createOrderValidation,
  patchOrderStatusValidation
};
