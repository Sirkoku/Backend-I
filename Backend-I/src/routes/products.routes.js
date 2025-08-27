const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManager');
const productManager = new ProductManager();

// Listar todos los productos
router.get('/', async (req, res) => {
    try {
        let products = await productManager.getProducts();
        const limit = parseInt(req.query.limit);

        if (limit && !isNaN(limit)) {
            products = products.slice(0, limit);
        }

        res.json(products);
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});



// Obtener producto por id
router.get('/:pid', async (req, res) => {
    try{
const pid = parseInt(req.params.pid);
const products = await productManager.getProducts();
const product = products.find(p => p.id == pid);

if (product) {
    res.setHeader("Content-Type","application/json");
    res.status(200).json(product)
} else {
    res.status(404).json({ error: 'Producto no encontrado' });
}
} catch (error){
    res.status(500).json({error:"producto no encontrado"});
}
});

// Agregar un producto nuevo
router.post('/', async (req, res) => {
try {
    const newProduct = req.body;

    // Validaciones
    if (!newProduct.title || !newProduct.price || !newProduct.code) {
    return res.status(400).json({ 
        error: "Faltan campos obligatorios: title, price, code" 
    });
    }
    //validar tipo de datos
    if (typeof newProduct.title !== "string" || typeof newProduct.code !== "string") {
    return res.status(400).json({ error: "Title y code deben ser texto" });
    }
    if (typeof newProduct.price !== "number") {
    return res.status(400).json({ error: "Price debe ser un número" });
    }
    if (!newProduct.stock || typeof newProduct.stock !== "number") {
    return res.status(400).json({ error: "Stock debe ser un número válido" });
    }
    const addedProduct = await productManager.addProduct(newProduct);
    res.status(201).json(addedProduct);

} catch (error) {
    console.error("Error al agregar producto:", error);
    
    if(error.message.includes("El codigo ya existe")){
        return res.status(400).json({error:error.message});
    }

    res.status(500).json({ error: "Error interno del servidor" });
}
});


// Actualizar un producto
router.put('/:pid', async (req, res) => {
    try {
        const pid = parseInt(req.params.pid);
        const updateData = req.body;


        if (updateData.title && typeof updateData.title !== "string") {
            return res.status(400).json({ error: "Title debe ser texto" });
        }
        if (updateData.price && typeof updateData.price !== "number") {
            return res.status(400).json({ error: "Price debe ser un número" });
        }
        if (updateData.code && typeof updateData.code !== "string") {
            return res.status(400).json({ error: "Code debe ser texto" });
        }

        const updatedProduct = await productManager.updateProduct(pid, updateData);

        if (!updatedProduct) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        res.json({ message: "Producto actualizado", product: updatedProduct });

    } catch (error) {
        console.error("Error al actualizar producto:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});



// Eliminar un producto
router.delete('/:pid', async (req, res) => {
try {
    const pid =parseInt(req.params.pid);
    const result = await productManager.deleteProduct(pid);

    if (result) {
    res.json({ message: 'Producto eliminado correctamente' });
    } else {
    res.status(404).json({ error: 'Producto no encontrado' });
    }
} catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
}
});


module.exports = router;