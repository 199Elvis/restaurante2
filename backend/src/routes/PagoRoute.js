const express = require('express');
const router = express.Router();
const pagoController = require('../controller/PagoController');

router.post('/crear/:idUsuario/:idSucursal', pagoController.realizarPago);


module.exports = router;