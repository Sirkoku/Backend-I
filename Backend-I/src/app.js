const express = require('express');
const {Server}=require("socket.io");
const path = require("path");
const exphbs= require("express-handlebars");
const {createServer} = require("http");

// routers
const productsRouter = require('./routes/products.routes');
const cartsRouter = require('./routes/cart.routes');
const viewRouter= require('./routes/views.router');



const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const ProductManager = require('./managers/ProductManager');
const productManager = new ProductManager();


// Middleware para leer JSON en body
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,"public")));

//handlebars
app.engine('handlebars',exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views',path.join(__dirname,'views'));

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/',viewRouter);

// Websockets
io.on("connection", async (socket) => {
console.log("Cliente conectado");

  // Enviar productos al conectarse
const products = await productManager.getProducts();
socket.emit("updateProducts", products);

  // Cuando llega un nuevo producto desde el cliente
socket.on("newProduct", async (data) => {
    await productManager.addProduct(data);
    const updatedProducts = await productManager.getProducts();
    io.emit("updateProducts", updatedProducts);
});

// eliminar prod
socket.on("deleteProduct", async(id) => {
await productManager.deleteProduct(id);
const updatedProducts= await productManager.getProducts();
io.emit("updateProducts", updatedProducts);
});
});

// Levantar server
const PORT = 8080;
httpServer.listen(PORT, () => {
console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
