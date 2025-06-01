const express = require('express');
const router = express.Router();
const usuarioController = require('../controller/UsuarioController');

router.post('/crear', usuarioController.createUsuario);
router.get('/usuarios', usuarioController.getUsuarios);
router.put('/actualizar/:ci', usuarioController.updateUsuario);
router.delete('/eliminar/:ciAdmin', usuarioController.deleteUsuario);

module.exports = router;