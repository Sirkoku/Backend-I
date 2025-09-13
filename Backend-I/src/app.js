const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const path = require("path");
const exphbs = require("express-handlebars");

// Routers
const productsRouter = require("./routes/products.routes.js");
const cartsRouter = require("./routes/cart.routes.js");
const viewsRouter = require("./routes/views.router.js");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// MongoDB
const MONGO_URI = "mongodb+srv://Coder:dKp4y8LtYXoZdplQ@cluster0.oa50ipp.mongodb.net/dbprueba?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch(err => console.error("❌ Error de conexión Mongo:", err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

// Websockets
const Product = require("./models/product.model.js");

io.on("connection", async (socket) => {
  console.log("Cliente conectado");

  const products = await Product.find().lean();
  socket.emit("updateProducts", products);

  socket.on("newProduct", async (data) => {
    await Product.create(data);
    const updatedProducts = await Product.find().lean();
    io.emit("updateProducts", updatedProducts);
  });

  socket.on("deleteProduct", async (id) => {
    await Product.findByIdAndDelete(id);
    const updatedProducts = await Product.find().lean();
    io.emit("updateProducts", updatedProducts);
  });
});

// Levantar server
const PORT = 8080;
httpServer.listen(PORT, () =>
  console.log(`🚀 Servidor en http://localhost:${PORT}`)
);
