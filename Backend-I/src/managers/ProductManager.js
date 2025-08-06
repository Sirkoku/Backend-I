const fs = require('fs').promises;
const path = require('path');

class ProductManager {
constructor() {
    this.path = path.join(__dirname, '../data/products.json');
}

async _readFile() {
    try {
    const data = await fs.readFile(this.path, 'utf-8');
    return JSON.parse(data);
    } catch {
    return [];
    }
}

async _writeFile(data) {
    await fs.writeFile(this.path, JSON.stringify(data, null, 2));
}

async getProducts() {
    return await this._readFile();
}

async addProduct(product) {
    const products = await this._readFile();

    // Generar ID (+)automatico
    const newId = products.length > 0 ? Math.max(...products.map(p => Number(p.id))) + 1 : 1;

    const newProduct = {
    id: newId.toString(),
    status: true,
    thumbnails: [],
    ...product
    };

    products.push(newProduct);
    await this._writeFile(products);
    return newProduct;
}

async updateProduct(id, updateData) {
const products = await this.getProducts();
const index = products.findIndex(p => p.id == id);

if (index === -1) return null;

  // Evitamos que se actualice el ID
const updatedProduct = {
    ...products[index],
    ...updateData,
    id: products[index].id
};

products[index] = updatedProduct;
await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
return updatedProduct;
}


async deleteProduct(id) {
    const products = await this.getProducts();
    const filtered = products.findIndex(p => p.id == id);

    if (index === -1) return false;
    
    products.splice(index,1);

    await fs.promises.writeFile(this.path,JSON.stringify(products,null,2));
    return true;
}
}

module.exports = ProductManager;
