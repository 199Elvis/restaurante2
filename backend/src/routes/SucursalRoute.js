const express = require('express');
const router = express.Router();
const sucursalController = require('../controller/SucursalController');

router.post('/crear', sucursalController.createSucursal);

module.exports = router;