var express = require('express');
var router = express.Router();
//Aquí llamo al middleware de autenticación. De esta forma aseguro que sólo el usuario logueado pueda ingresar productos al carrito de compras
const authMiddleware = require('../middlewares/authMiddleware');

//Aqui incorporo el middleware que se encarga de validar que la cantidad de productos a incluir al carrito no sea cero
const validador = require('../middlewares/validador');


// ************ Controller Require ************
const cartsControllers = require('../controllers/cartsControllers');

router.get('/carrito', authMiddleware, cartsControllers.cart);
router.post('/adicionarAlCarrito', authMiddleware, cartsControllers.addItemCart);
router.post('/adicionarItemAlCarrito/:id', authMiddleware, cartsControllers.incrementItemCart);
router.post('/restarItemAlCarrito/:id', authMiddleware, cartsControllers.decrementItemCart);
router.post('/borrarItemDelCarrito/:id', authMiddleware, cartsControllers.eraseItemCart);
router.get('/delete', authMiddleware, cartsControllers.deleteCart);
//router.post('/carrito/compra', authMiddleware, carritoController.shop);
//router.get('/carrito/historialCompra', authMiddleware, carritoController.history);
//router.get('/carrito/detalleCompra/:id', authMiddleware, carritoController.buyDetail);

module.exports = router;