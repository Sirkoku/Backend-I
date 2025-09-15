const Product = require("../models/product.model.js");

class ProductsManager {
async getProducts(filter = {}, options = {}) {
    try {
    return await Product.paginate(filter, options);
    } catch (error) {
    throw new Error("Error al obtener los productos: " + error.message);
    }
}

async getProductById(pid) {
    try {
    const product = await Product.findById(pid).lean();
    if (!product) {
        throw new Error("Producto no encontrado");
    }
    return product;
    } catch (error) {
    throw new Error("Error al buscar el producto: " + error.message);
    }
}

async createProduct(data) {
    const { title, price, code, stock, category, status } = data;

    // ✅ Validaciones
    if (!title || !price || !code || !stock || !category) {
    throw new Error("Todos los campos son obligatorios");
    }

    const validCategories = ["Municion", "Indumentaria", "Accesorios", "Armas"];
    if (!validCategories.includes(category)) {
    throw new Error(
        `Categoría inválida. Las válidas son: ${validCategories.join(", ")}`
    );
    }

    try {
    const newProduct = await Product.create({
        title,
        price,
        code,
        stock,
        category,
        status: status !== undefined ? status : true,
    });
    return newProduct;
    } catch (error) {
    if (error.code === 11000) {
        throw new Error("El código del producto ya existe");
    }
    throw new Error("Error al crear el producto: " + error.message);
    }
}

async updateProduct(pid, data) {
    try {
    const updated = await Product.findByIdAndUpdate(pid, data, { new: true });
    if (!updated) {
        throw new Error("Producto no encontrado para actualizar");
    }
    return updated;
    } catch (error) {
    throw new Error("Error al actualizar el producto: " + error.message);
    }
}

async deleteProduct(pid) {
    try {
    const deleted = await Product.findByIdAndDelete(pid);
    if (!deleted) {
        throw new Error("Producto no encontrado para eliminar");
    }
    return deleted;
    } catch (error) {
    throw new Error("Error al eliminar el producto: " + error.message);
    }
}
}

module.exports = ProductsManager;
