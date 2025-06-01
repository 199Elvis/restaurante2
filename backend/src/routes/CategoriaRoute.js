const express = require('express');
const router = express.Router();
const usuarioController = require('../controller/CategoriaController');

router.post('/crear', usuarioController.createCategoria);

module.exports = router;