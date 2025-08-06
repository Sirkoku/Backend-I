const express = require('express');
const CartManager = require('../managers/CartManager');

const router = express.Router();
const cartManager = new CartManager();

// Crear un carrito nuevo
router.post('/', async (req, res) => {
    try{
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
    }catch(error){
    res.status(500).json({error: "Error al crear el carrito"});
    }
});

// Obtener carrito por id
router.get('/:cid', async (req, res) => {
const cid = req.params.cid;
const cart = await cartManager.getCartById(cid);

if (cart) {
    res.json(cart);
} else {
    res.status(404).json({ error: 'Carrito no encontrado' });
}
});

// Agregar producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
const cid = req.params.cid;
const pid = req.params.pid;

const updatedCart = await cartManager.addProductToCart(cid, pid);

if (updatedCart) {
    res.json(updatedCart);
} else {
    res.status(404).json({ error: 'Carrito o producto no encontrado' });
}
});

module.exports = router;
