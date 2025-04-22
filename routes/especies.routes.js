const express = require('express');
const especiesController = require('../controllers/especies.controller');

const router = express.Router();

router.get('/', especiesController.getAllEspecies);
router.get('/:id', especiesController.getEspecieById);
router.post('/', especiesController.createEspecie);
router.put('/:id', especiesController.updateEspecie);
router.delete('/:id', especiesController.deleteEspecie);

module.exports = router;