const mapStatusCode = require('./product.status.controller');
const salesService = require('../services/sales.service');

const getSales = async (req, res) => {
  const sales = await salesService.getSales();
  const status = mapStatusCode(sales.status);
  return res.status(status).json(sales.data);
};

const getSaleByID = async (req, res) => {
  const { id } = req.params;
  const sales = await salesService.getSaleByID(id);
  const status = mapStatusCode(sales.status);
  return res.status(status).json(sales.data);
};

const addSales = async (req, res) => {
  const product = req.body;
  const newProduct = await salesService.addSales(product);
  const status = mapStatusCode(newProduct.status);
  return res.status(status).json(newProduct.data);
};

module.exports = {
  addSales,
  getSales,
  getSaleByID,
};