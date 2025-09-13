const express = require("express");
const Product = require("../models/product.model.js");
const router = express.Router();

router.get("/", async (req, res) => {
try {
    const { limit = 10, page = 1, sort, query } = req.query;
    const filter = query ? { $or: [{ category: query }, { status: query }] } : {};

    const options = {
    limit: parseInt(limit),
    page: parseInt(page),
    sort: sort ? { price: sort === "asc" ? 1 : -1 } : {}
    };

    const result = await Product.paginate(filter, options);

    res.json({
    status: "success",
    payload: result.docs,
    totalPages: result.totalPages,
    prevPage: result.prevPage,
    nextPage: result.nextPage,
    page: result.page,
    hasPrevPage: result.hasPrevPage,
    hasNextPage: result.hasNextPage,
    prevLink: result.hasPrevPage ? `http://localhost:8080/api/products?page=${result.prevPage}` : null,
    nextLink: result.hasNextPage ? `http://localhost:8080/api/products?page=${result.nextPage}` : null
    });
} catch (err) {
    res.status(500).json({ status: "error", error: err.message });
}
});
// GET un producto por ID
router.get("/:pid", async (req, res) => {
try {
    const product = await Product.findById(req.params.pid).lean();
    if (!product) {
    return res.status(404).json({ status: "error", error: "Producto no encontrado" });
    }
    res.json({ status: "success", payload: product });
} catch (err) {
    res.status(500).json({ status: "error", error: err.message });
}
});




router.post("/", async (req, res) => {
try {
    const { title, price, code, stock, category, status } = req.body;

    
    if (!title || !price || !code || !stock || !category) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const validCategories = ["Municion", "Indumentaria", "Accesorios", "Armas"];
    if (!validCategories.includes(category)) {
    return res.status(400).json({ error: `Categoría inválida. Las válidas son: ${validCategories.join(", ")}` });
    }

    const newProduct = await Product.create({
    title,
    price,
    code,
    stock,
    category,
    status: status !== undefined ? status : true
    });

    res.status(201).json({ status: "success", payload: newProduct });
} catch (error) {
    console.error(error);
    // Manejo de error por código duplicado
    if (error.code === 11000) {
    return res.status(400).json({ error: "El código del producto ya existe" });
    }
    res.status(500).json({ error: "Error al crear el producto" });
}
});

module.exports = router;
