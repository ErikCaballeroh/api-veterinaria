const express = require("express");
const usuariosController = require("../controllers/usuarios.controller");

const router = express.Router();

router.get("/empleados", usuariosController.getEmpleados);
router.get("/clientes", usuariosController.getClientes);
router.get("/:id", usuariosController.getUsuarioById);
router.post("/:id", usuariosController.updateUsuario);
router.delete("/:id", usuariosController.deleteUsuario);

module.exports = router;