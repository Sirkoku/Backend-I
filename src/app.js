const express = require('express');
const app = express();
const PORT = 8080;

// Middlewares
app.use(express.json());

// Ruta base para probar que funcione
app.get('/', (req, res) => {
res.send('Servidor funcionando correctamente');
});

// Servidor escuchando
app.listen(PORT, () => {
console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
