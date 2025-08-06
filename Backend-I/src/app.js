const express = require('express');
const productsRouter = require('./routes/products.routes');
const cartsRouter = require('./routes/cart.routes');

const app = express();
const PORT = 8080;

// Middleware para leer JSON en body
app.use(express.json());

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Ruta de prueba para verificar servidor
app.get('/', (req, res) => {
res.send('Servidor Backend I funcionando ');
});

// Iniciar servidor
app.listen(PORT, () => {
console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
