const express = require("express");
const ProductsManager = require("../managers/ProductsManager.js");
const router = express.Router();

const productsManager = new ProductsManager();


router.get("/", async (req, res) => {
try {
    const { limit = 10, page = 1, sort, query } = req.query;
    const filter = query ? { $or: [{ category: query }, { status: query }] } : {};

    const options = {
    limit: parseInt(limit),
    page: parseInt(page),
    sort: sort ? { price: sort === "asc" ? 1 : -1 } : {}
    };

    const result = await productsManager.getProducts(filter, options);

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

router.get("/:pid", async (req, res) => {
try {
    const product = await productsManager.getProductById(req.params.pid);
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
    const newProduct = await productsManager.createProduct(req.body);
    res.status(201).json({ status: "success", payload: newProduct });
} catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
}
});

module.exports = router;
