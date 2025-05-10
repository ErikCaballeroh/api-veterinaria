const express = require('express');
const usuariosController = require('../controllers/usuarios.controller');

const router = express.Router();

router.get('/empleados', usuariosController.getAllEmpleados);
router.get('/clientes', usuariosController.getAllClientes);
router.get('/:id', usuariosController.getUsuarioById);
router.put('/empleados/:id', usuariosController.convertirUsuarioEnEmpleado);
router.put('/:id', usuariosController.updateUsuario);
router.delete('/:id', usuariosController.deleteUsuario);

module.exports = router;