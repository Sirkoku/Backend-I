const express = require("express");
const Cart = require("../models/Cart");
const router = express.Router();

// Crear carrito vacío
router.post("/", async (req, res) => {
try {
    const newCart = await Cart.create({ products: [] });
    res.json(newCart);
} catch (error) {
    res.status(500).json({ error: error.message });
}
});

// GET carrito con populate
router.get("/:cid", async (req, res) => {
try {
    const cart = await Cart.findById(req.params.cid)
    .populate("products.product")
    .lean();
    res.json(cart);
} catch (error) {
    res.status(500).json({ error: error.message });
}
});

// PUT reemplazar productos
router.put("/:cid", async (req, res) => {
try {
    const { products } = req.body;
    const cart = await Cart.findByIdAndUpdate(req.params.cid, { products }, { new: true });
    res.json(cart);
} catch (error) {
    res.status(500).json({ error: error.message });
}
});

// PUT actualizar cantidad / agregar producto al carrito
router.put("/:cid/products/:pid", async (req, res) => {
try {
    const { quantity } = req.body;
    const cart = await Cart.findById(req.params.cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    const item = cart.products.find(p => p.product.toString() === req.params.pid);

    if (item) {
      // Sumar cantidad si ya existe
    item.quantity += quantity;
    } else {
      // Agregar nuevo producto
    cart.products.push({ product: req.params.pid, quantity });
    }

    await cart.save();
    res.json(cart);
} catch (error) {
    res.status(500).json({ error: error.message });
}
});

// DELETE un producto
router.delete("/:cid/products/:pid", async (req, res) => {
try {
    const cart = await Cart.findById(req.params.cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    cart.products = cart.products.filter(p => p.product.toString() !== req.params.pid);
    await cart.save();
    res.json(cart);
} catch (error) {
    res.status(500).json({ error: error.message });
}
});

// DELETE vaciar carrito
router.delete("/:cid", async (req, res) => {
try {
    const cart = await Cart.findByIdAndUpdate(req.params.cid, { products: [] }, { new: true });
    res.json(cart);
} catch (error) {
    res.status(500).json({ error: error.message });
}
});

module.exports = router;
