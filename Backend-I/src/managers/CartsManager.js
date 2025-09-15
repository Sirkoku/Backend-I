const Cart = require("../models/Cart.js");

class CartsManager {
async createCart() {
    return await Cart.create({ products: [] });
}

async getCartById(cid) {
    return await Cart.findById(cid).populate("products.product").lean();
}

async addProductToCart(cid, pid, quantity = 1) {
    const cart = await Cart.findById(cid);
    if (!cart) throw new Error("Carrito no encontrado");

    const productIndex = cart.products.findIndex(p => p.product.toString() === pid);

    if (productIndex >= 0) {
    cart.products[productIndex].quantity += quantity;
    } else {
    cart.products.push({ product: pid, quantity });
    }

    await cart.save();
    return cart;
}

async removeProductFromCart(cid, pid) {
    const cart = await Cart.findById(cid);
    if (!cart) throw new Error("Carrito no encontrado");

    cart.products = cart.products.filter(p => p.product.toString() !== pid);
    await cart.save();
    return cart;
}

async clearCart(cid) {
    return await Cart.findByIdAndUpdate(cid, { products: [] }, { new: true });
}
}

module.exports = CartsManager;
