const fs = require('fs').promises;
const path = require('path');

class CartManager {
constructor() {
    this.filepath = path.join(__dirname, '../data/carts.json');
}

async _readFile() {
    try {
    const data = await fs.readFile(this.filepath, 'utf-8');
    return JSON.parse(data);
    } catch {
    return [];
    }
}

async _writeFile(data) {
    await fs.writeFile(this.filepath, JSON.stringify(data, null, 2));
}

async createCart() {
    const carts = await this._readFile();
    const newId = carts.length > 0 ? Math.max(...carts.map(c => Number(c.id))) + 1 : 1;

    const newCart = {
    id: newId.toString(),
    products: []
    };

    carts.push(newCart);
    await this._writeFile(carts);
    return newCart;
}

async getCartById(id) {
    const carts = await this._readFile();
    return carts.find(c => c.id == id) || null;
}

async addProductToCart(cid, pid) {
    const carts = await this._readFile();
    const cartIndex = carts.findIndex(c => c.id == cid);

    if (cartIndex === -1) return null;

    const cart = carts[cartIndex];

    // Buscar producto dentro del carrito
    const productInCart = cart.products.find(p => p.product == pid);

    if (productInCart) {
      // Incrementar cantidad
    productInCart.quantity += 1;
    } else {
      // Agregar producto nuevo con quantity 1
    cart.products.push({ product: pid, quantity: 1 });
    }

    carts[cartIndex] = cart;
    await this._writeFile(carts);

    return cart;
}
}

module.exports = CartManager;