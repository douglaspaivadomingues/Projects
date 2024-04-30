const route = require('express').Router();
const productController = require('../controllers/product.controller');

route.delete('/:id', productController.deleteProduct);
route.get('/', productController.getAllProducts);
route.get('/:id', productController.getProductsByID);
route.post('/', productController.addProduct);
route.put('/:id', productController.updateProduct);

module.exports = route;