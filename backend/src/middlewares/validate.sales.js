const productService = require('../services/product.service');

const validProductById = async (id) => {
  if (!id) {
    return { status: 'BAD_REQUEST', data: { message: '"productId" is required' } }; 
  }
  const result = await productService.getProductsByID(id);
  if (result.status !== 'SUCCESS') {
    return { status: 'NOT_FOUND', data: { message: 'Product not found' } };
  }
  return { status: 'SUCCESS' };
};

const validProductByQuantity = async (quantity, productId) => {
  if (quantity <= 0) {
    return {
      status: 'UNAUTHORIZED',
      data: { message: '"quantity" must be greater than or equal to 1' } };
  }
  if (quantity === undefined) {
    return { status: 'BAD_REQUEST', data: { message: '"quantity" is required' } };
  }
  if (productId === undefined) {
    return { status: 'NOT_FOUND', data: { message: 'Product not found' } };
  }

  return { status: 'SUCCESS' };
};

const validSale = async (products) => {
  const validations = products.map(async (product) => {
    const validateID = await validProductById(product.productId);
    if (validateID.status !== 'SUCCESS') {
      return validateID;
    }
    const validateQuantity = await validProductByQuantity(product.quantity, product.productId);
    if (validateQuantity.status !== 'SUCCESS') {
      return validateQuantity;
    }
    
    return { status: 'SUCCESS' };
  });
  
  const results = await Promise.all(validations);

  const allSuccess = results.every((result) => result.status === 'SUCCESS');
  const errorResult = results.find((result) => result.status !== 'SUCCESS');
  return allSuccess ? { status: 'SUCCESS' } : errorResult;
};

module.exports = {
  validProductById,
  validSale,
  validProductByQuantity,
};