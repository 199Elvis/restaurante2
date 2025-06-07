const express = require('express');
const router = express.Router();
const productoController = require('../controller/ProductoController');

router.post('/crear', productoController.crearProducto);

module.exports = router;