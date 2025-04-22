const express = require('express');
const mascotasController = require('../controllers/mascotas.controller');

const router = express.Router();

router.get('/', mascotasController.getAllMascotas);
router.get('/:id', mascotasController.getMascotaById);
router.post('/', mascotasController.createMascota);
router.put('/:id', mascotasController.updateMascota);
router.delete('/:id', mascotasController.deleteMascota);

module.exports = router;