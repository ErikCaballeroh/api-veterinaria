const express = require('express');
const citasController = require('../controllers/citas.controller');

const router = express.Router();

router.get('/', citasController.getAllCitas);
router.get('/:id', citasController.getCitaById);
router.post('/', citasController.createCita);
router.put('/:id', citasController.updateCita);
router.delete('/:id', citasController.deleteCita);

module.exports = router;