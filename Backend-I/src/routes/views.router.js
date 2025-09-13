const { Router } = require("express");
const Product = require("../models/product.model.js");
const Cart = require("../models/Cart.js");

const router = Router();

// Home (productos desde MongoDB)
router.get("/", async (req, res) => {
try {
    const products = await Product.find().lean();
    res.render("home", { products });
} catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar los productos");
}
});

// Realtime (con socket.io)
router.get("/realtimeproducts", async (req, res) => {
try {
    const products = await Product.find().lean();
    res.render("realtimeproducts", { products });
} catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar los productos en tiempo real");
}
});

// Carrito por ID
router.get("/cart/:cid", async (req, res) => {
try {
    const cart = await Cart.findById(req.params.cid)
      .populate("products.product") // trae los datos completos del producto
    .lean();

    if (!cart) {
    return res.status(404).send("Carrito no encontrado");
    }

    res.render("cart", { cart });
} catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar el carrito");
}
});

module.exports = router;
