const express = require('express');
const consultasController = require('../controllers/consultas.controller');

const router = express.Router();

router.get('/', consultasController.getAllConsultas);
router.get('/:id', consultasController.getConsultaById);
router.post('/', consultasController.createConsulta);
router.put('/:id', consultasController.updateConsulta);
router.delete('/:id', consultasController.deleteConsulta);

module.exports = router;