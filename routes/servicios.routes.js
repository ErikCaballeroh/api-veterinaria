const express = require('express');
const serviciosController = require('../controllers/servicios.controller');

const router = express.Router();

router.get('/', serviciosController.getAllServicios);
router.get('/:id', serviciosController.getServicioById);
router.post('/', serviciosController.createServicio);
router.put('/:id', serviciosController.updateServicio);
router.delete('/:id', serviciosController.deleteServicio);

module.exports = router;