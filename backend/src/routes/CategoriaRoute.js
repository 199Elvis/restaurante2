const express = require('express');
const router = express.Router();
const categoriaController = require('../controller/CategoriaController');

router.post('/crear', categoriaController.createCategoria);
router.get('/listar', categoriaController.getCategorias);
router.put('/actualizar/:idCategoria', categoriaController.updateCategoria);


module.exports = router;