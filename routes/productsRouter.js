const express = require("express");
const productsContainer = require("../controllers/productHandler.js");
const router = express.Router();

let userAdmin = false;

function validateProduct(req, res, next) {
  const { title, description, price, img } = req.body;

  if (!title || !description || !price || !img) {
    res.json({ Error: "Faltan datos del producto" });
  } else if (isNaN(price)) {
    res.json({ Error: "El precio del producto debe ser de tipo number" });
  }
  req.title = title;
  req.description = description;
  req.price = price;
  req.img = img;
  next();
}

function validateAdmin(req, res, next) {
  if (userAdmin) {
    next();
  } else {
    res.status(403).json({ User: "No es Admin" });
  }
}

router.get("/login", (req, res) => {
  userAdmin = true;
  res.status(200).json({ User: "Admin" });
});

router.get("/logout", (req, res) => {
  userAdmin = false;
  res.status(200).json({ User: "No es Admin" });
});

router.get("/:id?", async (req, res) => {
  if (!req.params.id) {
    let products = await productsContainer.getAllFile();
    res.json({
      data: products,
    });
  } else {
    let foundProduct = await productsContainer.getById(req.params.id);
    if (!foundProduct) {
      res.status(404).json({
        error: "NOT FOUND 404 !! no existe ese ID",
      });
    } else {
      res.json({
        data: foundProduct,
      });
    }
  }
});

router.post("/", validateAdmin, validateProduct, async (req, res) => {
  let newProduct = await productsContainer.saveInFile(req.body);
  res.json({
    data: newProduct,
  });
});

router.put("/:id", validateAdmin, async (req, res) => {
  let foundProduct = await productsContainer.getById(req.params.id);
  if (!foundProduct) {
    res.status(404).json({
      error: "NOT FOUND 404!! producto no encontrado!!",
    });
  } else {
    let newValues = req.body;
    for (const element in foundProduct) {
      for (const elem in newValues) {
        if (element === elem) {
          foundProduct[element] = newValues[elem];
        }
      }
    }
    await productsContainer.deleteById(req.params.id);
    await productsContainer.saveInFile(req.params.id);

    res.json({
      msg: "El producto fue modificado correctamente",
    });
  }
});

router.delete("/:id", validateAdmin, async (req, res) => {
  let foundProduct = await productsContainer.getById(req.params.id);
  if (!foundProduct) {
    res.status(404).json({
      error: "NOT FOUND 404!!! producto no encontrado",
    });
  } else {
    await productsContainer.deleteById(req.params.id);
    res.json({
      msg: "Se ha eliminado el producto correctamente",
    });
  }
});

module.exports = router;
