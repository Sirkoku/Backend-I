const { Router } = require("express");
const ProductManager = require("../managers/ProductManager");

const router = Router();
const productManager = new ProductManager();

// Home (render normal con productos iniciales)
router.get("/", async (req, res) => {
    const products = await productManager.getProducts();
    res.render("home", { products });
});

// Página realtime (Socket.io)
router.get("/realtimeproducts", async (req, res) => {
    const products = await productManager.getProducts();
    res.render("realtimeproducts", { products });
});

module.exports = router;
