const mapStatusCode = require('./product.status.controller');
const productService = require('../services/product.service');

const getAllProducts = async (req, res) => {
  const product = await productService.getAllProducts();
  return res.status(mapStatusCode(product.status)).json(product.data);
};

const getProductsByID = async (req, res) => {
  const { id } = req.params;
  const product = await productService.getProductsByID(id);
  const { status, data } = product;
  return res.status(mapStatusCode(status)).json(data);
};

const addProduct = async (req, res) => {
  const product = req.body;
  console.log(product);
  const newProduct = await productService.addProduct(product);
  const { status, data } = newProduct;
  return res.status(mapStatusCode(status)).json(data);
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const product = req.body;
  const updated = await productService.updateProduct(id, product);
  const { status, data } = updated;
  return res.status(mapStatusCode(status)).json(data);
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const deleted = await productService.deleteProduct(id);
  const { status, data } = deleted;
  return res.status(mapStatusCode(status)).json(data);
};

module.exports = {
  getAllProducts,
  getProductsByID,
  addProduct,
  updateProduct,
  deleteProduct,
};