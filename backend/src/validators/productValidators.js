const { body, param } = require("express-validator");

const productIdParam = param("id").isInt({ min: 1 }).withMessage("ID invalido");

const createProductValidation = [
  body("name").isLength({ min: 3 }).withMessage("Nome invalido").trim().escape(),
  body("description")
    .isLength({ min: 5 })
    .withMessage("Descricao invalida")
    .trim()
    .escape(),
  body("category").isLength({ min: 2 }).withMessage("Categoria invalida").trim().escape(),
  body("price").isFloat({ gt: 0 }).withMessage("Preco deve ser maior que zero"),
  body("stock").isInt({ min: 0 }).withMessage("Estoque invalido"),
  body("imageUrl").optional().isURL().withMessage("URL de imagem invalida"),
  body("active").optional().isBoolean().withMessage("active deve ser booleano")
];

const updateProductValidation = [...createProductValidation];

const patchProductValidation = [
  body("name").optional().isLength({ min: 3 }).withMessage("Nome invalido").trim().escape(),
  body("description")
    .optional()
    .isLength({ min: 5 })
    .withMessage("Descricao invalida")
    .trim()
    .escape(),
  body("category")
    .optional()
    .isLength({ min: 2 })
    .withMessage("Categoria invalida")
    .trim()
    .escape(),
  body("price").optional().isFloat({ gt: 0 }).withMessage("Preco invalido"),
  body("stock").optional().isInt({ min: 0 }).withMessage("Estoque invalido"),
  body("imageUrl").optional().isURL().withMessage("URL de imagem invalida"),
  body("active").optional().isBoolean().withMessage("active deve ser booleano")
];

module.exports = {
  productIdParam,
  createProductValidation,
  updateProductValidation,
  patchProductValidation
};
