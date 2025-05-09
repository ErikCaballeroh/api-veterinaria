const express = require('express');
const citasController = require('../controllers/citas.controller');

const router = express.Router();

router.get('/citas', citasController.getAllCitasByUsuario);

module.exports = router;