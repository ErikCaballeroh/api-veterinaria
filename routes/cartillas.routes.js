const express = require('express');
const router = express.Router();

const cartillasController = require('../controllers/cartillas.controller');

router.get('/', cartillasController.getCartillas);
router.get('/mascota/:id/consultas', cartillasController.getConsultasByMascotaId);

module.exports = router;
