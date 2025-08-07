const express = require('express');
const ProductManager = require('../managers/ProductManager');

const router = express.Router();
const productManager = new ProductManager();

// Listar todos los productos
router.get('/', async (req, res) => {
try {
    const products = await productManager.getProducts();
    res.status(200).json(products);
} catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
}
});


// Obtener producto por id
router.get('/:pid', async (req, res) => {
    try{
const pid = req.params.pid;
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
const newProduct = req.body;
const addedProduct = await productManager.addProduct(newProduct);
res.status(201).json(addedProduct);
});

// Actualizar un producto
router.put('/:pid', async (req, res) => {
const pid = req.params.pid;
const updateData = req.body;

try {
    const updatedProduct = await productManager.updateProduct(pid, updateData);
    if (updatedProduct) {
    res.json({ message: 'Producto actualizado', product: updatedProduct });
    } else {
    res.status(404).json({ error: 'Producto no encontrado' });
    }
} catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto' });
}
});


// Eliminar un producto
router.delete('/:pid', async (req, res) => {
try {
    const pid = req.params.pid;
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