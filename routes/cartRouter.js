const express = require("express");
const router = express.Router();
const cartContainer = require("../controllers/cartHandler.js");
const productsContainer = require("../controllers/productHandler.js");

router.post("/", async (req, res) => {
  const cartWithId = await cartContainer.saveInFile();

  res.json({
    data: cartWithId,
  });
});

router.delete("/:id", async (req, res) => {
  await cartContainer.deleteById(req.params.id);
});

router.get("/:id/productos", async (req, res) => {
  const cart = await cartContainer.getById(req.params.id);
  res.json({
    data: cart.products,
  });
});

router.post("/:id/productos", async (req, res) => {
  const cart = await cartContainer.getById(req.params.id);
  const product = await productsContainer.getById(req.body.id);
  cart.products.push(product);
  await cartContainer.readFile();
  res.send(console.log(`Producto agregado al carrito ${req.params.id}`));
});

router.delete("/:id/productos/:id_prod", async (req, res) => {
  //ELIMINAR UN PRODUCTO DEL CARRITO POR SU ID DE CARRITO Y ID DE PRODUCTO
  const cart = await cartContainer.getById(req.params.id);

  let newListProducts = [];
  newListProducts = cart.productos.filter(
    (product) => product.id != req.params.id_prod
  );
  cart.productos = newListProducts;

  await cartContainer.updateFile(cart);

  res.send(console.log("Producto eliminado del carrito correctamente"));
});

module.exports = router;
