const fs = require('fs').promises;
const path = require('path');

class ProductManager {
constructor() {
    this.path = path.join(__dirname, '../data/products.json');
}

  // Leer archivo de productos
async _readFile() {
    try {
    console.log("Leyendo desde:", this.path);
    const data = await fs.readFile(this.path, 'utf-8');
    return JSON.parse(data);
    } catch (error) {
    console.error("Error leyendo el archivo:", error);
    return [];
    }
}

  // Escribir archivo de productos
async _writeFile(data) {
    try {
    await fs.writeFile(this.path, JSON.stringify(data, null, 2));
    } catch (error) {
    console.error("Error escribiendo el archivo:", error);
    throw new Error("No se pudo guardar el archivo de productos.");
    }
}

  // Obtener todos los productos
async getProducts() {
    try {
    return await this._readFile();
    } catch (error) {
    console.error("Error obteniendo productos:", error);
    return [];
    }
}

  // Agregar producto
async addProduct(product) {
    try {
    const products = await this._readFile();

      // Validar código único
    if (products.some(p => p.code === product.code)) {
        throw new Error("El código ya existe, debe ser único.");
    }

      // Generar ID automático
    const newId = products.length > 0
        ? Math.max(...products.map(p => Number(p.id))) + 1
        : 1;

    const newProduct = {
        id: newId,
        status: true,
        thumbnails: [],
        ...product
    };

    products.push(newProduct);
    await this._writeFile(products);
    return newProduct;
    } catch (error) {
    console.error("Error agregando producto:", error);
    throw error;
    }
}

  // Actualizar producto
async updateProduct(id, updateData) {
    try {
    const products = await this._readFile();
    const index = products.findIndex(p => p.id == id);

    if (index === -1) return null;

    const updatedProduct = {
        ...products[index],
        ...updateData,
        id: products[index].id // Evitamos cambiar el ID
    };

    products[index] = updatedProduct;
    await this._writeFile(products);
    return updatedProduct;
    } catch (error) {
    console.error("Error actualizando producto:", error);
    throw error;
    }
}

  // Eliminar producto
async deleteProduct(id) {
    try {
    const products = await this._readFile();
    const index = products.findIndex(p => p.id == id);

    if (index === -1) return false;

    products.splice(index, 1);
    await this._writeFile(products);
    return true;
    } catch (error) {
    console.error("Error eliminando producto:", error);
    throw error;
    }
}
}

module.exports = ProductManager;
