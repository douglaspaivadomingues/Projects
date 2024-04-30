const routeSales = require('express').Router();
const salesController = require('../controllers/sales.controller');

routeSales.post('/', salesController.addSales);
routeSales.get('/', salesController.getSales);
routeSales.get('/:id', salesController.getSaleByID);

module.exports = routeSales;