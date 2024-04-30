const productModel = require('../models/product.model');

const validateByID = async (id) => {
  if (id) {
    const [resultProduct] = await productModel.getProductsByID(id);
    if (resultProduct.length > 0) {
      return { status: 'SUCCESS' };
    }
    return { status: 'NOT_FOUND', data: { message: 'Product not found' } };
  }
};

const validate = async (product) => {
  if (product === undefined || product.name === undefined || product.name === '') {
    return { status: 'BAD_REQUEST', data: { message: '"name" is required' } };
  }
  if (product.name.length <= 5) {
    return {
      status: 'UNAUTHORIZED', 
      data: { message: '"name" length must be at least 5 characters long' } };
  }
  return { status: 'SUCCESS' };
};

module.exports = {
  validate,
  validateByID,
};
