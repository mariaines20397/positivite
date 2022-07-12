const express = require("express");
const app = express();
const path = require("path");
const webRoutes = require("./routes/webRoutes");
const usersRoutes = require("./routes/usersRoutes");
const adminRoutes = require("./routes/adminRoutes");
const productsRoutes = require("./routes/productsRoutes");
const carritoRoutes = require("./routes/carritoRoutes");
const methodOverride = require('method-override');
const session = require('express-session');
const cookies = require('cookie-parser');
const userLoggedMiddleware = require("./middlewares/userLoggedMiddleware");
const carritoCantidadMiddleware = require('./middlewares/carritoCantidad');


//Aquí llamo a la ruta de las api de productos
const apiProductsRouter = require('./routes/api/products');
const apiUsersRouter = require('./routes/api/users');


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static("public"));

//Captura y convierte lo que viene de un formulario en un objeto literal y nos de la posibilidad de convertilo a un formato json
app.use(express.urlencoded({extended:false}));

app.use(express.json());

//Para poder usar PUT y DELETE
app.use(methodOverride('_method'));

app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true }));
app.use(cookies());
app.use(userLoggedMiddleware);

app.use(carritoCantidadMiddleware);

app.use("/", webRoutes);
app.use("/users", usersRoutes);
app.use("/products", productsRoutes);
app.use("/admin", adminRoutes);
app.use("/carrito", carritoRoutes);

//Aquí creo la colección de mis recursos de productos (APIs)
app.use('/api/products',apiProductsRouter);
app.use('/api/users',apiUsersRouter);

app.use((req, res, next) => {
  res.status(404).render("partials/error404");
})

app.listen(3030, () => {
  console.log("Servidor corriendo");
});
