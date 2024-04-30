const salesModel = require('../models/sales.model');
const validateSales = require('../middlewares/validate.sales');

const getSales = async () => {
  const [result] = await salesModel.getSales();
  if (result) {
    const saleProducts = result.map((prod) => (
      {
        saleId: prod.id,
        date: prod.date,
        productId: prod.product_id,
        quantity: prod.quantity,
      }));
    return { status: 'SUCCESS', data: saleProducts };
  }
  return { status: 'NOT_FOUND', data: { message: 'Product not found' } };
};

const getSaleByID = async (id) => {
  try {
    if (id) {
      const [sale] = await salesModel.getSaleByID(id);
      if (sale.length > 0) {
        const saleProducts = sale.map((prod) => (
          {
            date: prod.sd,
            productId: prod.product_id,
            quantity: prod.quantity,
          }));
        return { status: 'SUCCESS', data: saleProducts };
      }
    }
    return { status: 'NOT_FOUND', data: { message: 'Sale not found' } }; 
  } catch (error) {
    return { status: 'INTERNAL_SERVER_ERROR', data: { message: 'Failed to retrieve product' } };
  }
};

const addSales = async (products) => {
  const validProduct = await validateSales.validSale(products);
  try {
    if (validProduct.status === 'SUCCESS') {
      const saleAdd = await salesModel.addSales(products);
      const saleReturn = saleAdd.map((sale) => (
        {
          productId: sale.productId,
          quantity: sale.quantity,
        }
      ));
      return { status: 'CREATED', data: { id: saleAdd[0].saleId, itemsSold: saleReturn } };
    }
    return validProduct;
  } catch (error) {
    return { status: 'INTERNAL_SERVER_ERROR', data: { message: 'Failed to create product' } };
  }
};

module.exports = { 
  addSales,
  getSales,
  getSaleByID,
};
