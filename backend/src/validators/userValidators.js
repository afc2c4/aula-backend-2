const { body, param } = require("express-validator");

const emailRule = body("email")
  .isEmail()
  .withMessage("Email invalido")
  .normalizeEmail();

const passwordRule = body("password")
  .isLength({ min: 6 })
  .withMessage("Senha deve ter no minimo 6 caracteres")
  .trim();

const nameRule = body("name")
  .isLength({ min: 2 })
  .withMessage("Nome deve ter no minimo 2 caracteres")
  .trim()
  .escape();

const roleRuleOptional = body("role")
  .optional()
  .isIn(["customer", "admin"])
  .withMessage("Role invalida");

const userIdParam = param("id").isInt({ min: 1 }).withMessage("ID invalido");

const registerValidation = [nameRule, emailRule, passwordRule];

const updateUserValidation = [
  nameRule,
  emailRule,
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Senha deve ter no minimo 6 caracteres"),
  roleRuleOptional
];

const patchUserValidation = [
  body("name")
    .optional()
    .isLength({ min: 2 })
    .withMessage("Nome deve ter no minimo 2 caracteres")
    .trim()
    .escape(),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Email invalido")
    .normalizeEmail(),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Senha deve ter no minimo 6 caracteres"),
  roleRuleOptional
];

module.exports = {
  registerValidation,
  updateUserValidation,
  patchUserValidation,
  userIdParam
};
