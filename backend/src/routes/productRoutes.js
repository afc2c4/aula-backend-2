const express = require("express");
const { store, getNextId } = require("../data/store");
const { ensureAdmin } = require("../middlewares/auth");
const { upload } = require("../middlewares/upload");
const { validateRequest } = require("../middlewares/validateRequest");
const {
  productIdParam,
  createProductValidation,
  updateProductValidation,
  patchProductValidation
} = require("../validators/productValidators");

const router = express.Router();

router.get("/", (req, res) => {
  const { category, minPrice, maxPrice, sort, q } = req.query;
  let products = [...store.products];

  if (category) {
    products = products.filter((item) => item.category.toLowerCase() === String(category).toLowerCase());
  }

  if (minPrice) {
    products = products.filter((item) => item.price >= Number(minPrice));
  }

  if (maxPrice) {
    products = products.filter((item) => item.price <= Number(maxPrice));
  }

  if (q) {
    const query = String(q).toLowerCase();
    products = products.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
    );
  }

  if (sort === "price_asc") {
    products.sort((a, b) => a.price - b.price);
  } else if (sort === "price_desc") {
    products.sort((a, b) => b.price - a.price);
  }

  res.json({ products });
});

router.get("/:id", productIdParam, validateRequest, (req, res) => {
  const id = Number(req.params.id);
  const product = store.products.find((item) => item.id === id);

  if (!product) {
    return res.status(404).json({ error: "Produto nao encontrado" });
  }

  return res.json({ product });
});

router.post(
  "/",
  ensureAdmin,
  upload.single("image"),
  createProductValidation,
  validateRequest,
  (req, res) => {
    const { name, description, category, price, stock, imageUrl, active } = req.body;

    const createdProduct = {
      id: getNextId("products"),
      name,
      description,
      category,
      price: Number(price),
      stock: Number(stock),
      imageUrl: imageUrl || null,
      active: active === undefined ? true : Boolean(active)
    };

    store.products.push(createdProduct);

    return res.status(201).json({ product: createdProduct });
  }
);

router.put(
  "/:id",
  ensureAdmin,
  productIdParam,
  updateProductValidation,
  validateRequest,
  (req, res) => {
    const id = Number(req.params.id);
    const product = store.products.find((item) => item.id === id);

    if (!product) {
      return res.status(404).json({ error: "Produto nao encontrado" });
    }

    const { name, description, category, price, stock, imageUrl, active } = req.body;

    product.name = name;
    product.description = description;
    product.category = category;
    product.price = Number(price);
    product.stock = Number(stock);
    product.imageUrl = imageUrl || null;
    product.active = active === undefined ? true : Boolean(active);

    return res.json({ product });
  }
);

router.patch(
  "/:id",
  ensureAdmin,
  productIdParam,
  patchProductValidation,
  validateRequest,
  (req, res) => {
    const id = Number(req.params.id);
    const product = store.products.find((item) => item.id === id);

    if (!product) {
      return res.status(404).json({ error: "Produto nao encontrado" });
    }

    const { name, description, category, price, stock, imageUrl, active } = req.body;

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (category !== undefined) product.category = category;
    if (price !== undefined) product.price = Number(price);
    if (stock !== undefined) product.stock = Number(stock);
    if (imageUrl !== undefined) product.imageUrl = imageUrl;
    if (active !== undefined) product.active = Boolean(active);

    return res.json({ product });
  }
);

router.delete("/:id", ensureAdmin, productIdParam, validateRequest, (req, res) => {
  const id = Number(req.params.id);
  const productIndex = store.products.findIndex((item) => item.id === id);

  if (productIndex === -1) {
    return res.status(404).json({ error: "Produto nao encontrado" });
  }

  const [removedProduct] = store.products.splice(productIndex, 1);
  return res.json({ removed: removedProduct });
});

module.exports = {
  productRoutes: router
};
