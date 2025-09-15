const express = require("express");
const CartsManager = require("../managers/CartsManager.js");
const router = express.Router();

const cartsManager = new CartsManager();

// Crear carrito vacío
router.post("/", async (req, res) => {
try {
    const newCart = await cartsManager.createCart();
    res.status(201).json({ status: "success", payload: newCart });
} catch (error) {
    res.status(500).json({ status: "error", error: error.message });
}
});

// Obtener carrito con populate
router.get("/:cid", async (req, res) => {
try {
    const cart = await cartsManager.getCartById(req.params.cid);
    if (!cart) {
    return res.status(404).json({ status: "error", error: "Carrito no encontrado" });
    }
    res.json({ status: "success", payload: cart });
} catch (error) {
    res.status(500).json({ status: "error", error: error.message });
}
});

// Reemplazar productos en carrito
router.put("/:cid", async (req, res) => {
try {
    const updatedCart = await cartsManager.replaceProducts(req.params.cid, req.body.products);
    res.json({ status: "success", payload: updatedCart });
} catch (error) {
    res.status(500).json({ status: "error", error: error.message });
}
});

// Agregar/actualizar producto en carrito
router.put("/:cid/products/:pid", async (req, res) => {
try {
    const updatedCart = await cartsManager.updateProductQuantity(req.params.cid, req.params.pid, req.body.quantity);
    res.json({ status: "success", payload: updatedCart });
} catch (error) {
    res.status(500).json({ status: "error", error: error.message });
}
});

// Eliminar producto del carrito
router.delete("/:cid/products/:pid", async (req, res) => {
try {
    const updatedCart = await cartsManager.removeProduct(req.params.cid, req.params.pid);
    res.json({ status: "success", payload: updatedCart });
} catch (error) {
    res.status(500).json({ status: "error", error: error.message });
}
});

// Vaciar carrito
router.delete("/:cid", async (req, res) => {
try {
    const emptiedCart = await cartsManager.clearCart(req.params.cid);
    res.json({ status: "success", payload: emptiedCart });
} catch (error) {
    res.status(500).json({ status: "error", error: error.message });
}
});

module.exports = router;
