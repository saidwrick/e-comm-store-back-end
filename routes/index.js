const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const categoriesController = require('../controllers/categoriesController');

router.get('/inventory', inventoryController.inventoryGet);
router.post('/inventory', inventoryController.inventoryPost);
router.put('/inventory/:id', inventoryController.inventoryPut);
router.delete('/inventory/:id', inventoryController.inventoryDelete);

router.get('/categories', categoriesController.categoriesGet);
router.post('/categories', categoriesController.categoriesPost);
router.put('/categories/:id', categoriesController.categoriesPut);
router.delete('/categories/:id', categoriesController.categoriesDelete);
module.exports = router;
