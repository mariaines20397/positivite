const express = require('express');
const router = express.Router();
const productsAPIControllers = require('../../controllers/api/productsAPIControllers');

//Rutas
//Listado de pproductos
router.get('/', productsAPIControllers.list);

//Detalle de una película
router.get('/:id', productsAPIControllers.detail);


module.exports = router;