const productModel = require('../models/product.model');
const validateProduct = require('../middlewares/validate.product');

const PRODUCT_NOT_FOUND = 'Product not found';

const getAllProducts = async () => {
  try {
    const [products] = await productModel.getAllProducts();
    if (products) {
      return { status: 'SUCCESS', data: products };
    }
    return { status: 'NOT_FOUND', data: { message: PRODUCT_NOT_FOUND } };
  } catch (error) {
    return { status: 'INTERNAL_SERVER_ERROR', data: { message: 'Falha na requisição' } };
  }
};

const getProductsByID = async (id) => {
  try {
    if (id === undefined) {
      return { status: 'NOT_FOUND', data: { message: PRODUCT_NOT_FOUND } };
    }
    const validProduct = await validateProduct.validateByID(id);
    if (validProduct.status === 'SUCCESS') {
      const [product] = await productModel.getProductsByID(id);
      return { status: 'SUCCESS', data: product[0] };
    }
    return { status: 'NOT_FOUND', data: { message: PRODUCT_NOT_FOUND } };
  } catch (error) {
    return { status: 'INTERNAL_SERVER_ERROR', data: { message: 'Failed to retrieve product' } };
  }
};

const addProduct = async (product) => {
  try {
    const validProduct = await validateProduct.validate(product);
    if (validProduct.status === 'SUCCESS') {
      const [result] = await productModel.addProduct(product);
      return { status: 'CREATED', data: { id: result.insertId, name: product.name } };
    }
    return validProduct;
  } catch (error) {
    return { status: 'INTERNAL_SERVER_ERROR', data: { message: 'Failed to create product' },
    };
  }
};

const updateProduct = async (id, product) => {
  try {
    const validID = await validateProduct.validateByID(id);
    if (validID.status !== 'SUCCESS') {
      return validID;
    }
    const validProduct = await validateProduct.validate(product);
    if (validProduct.status !== 'SUCCESS') {
      return validProduct;
    }
    const [newProduct] = await productModel.updateProduct(id, product);
    if (newProduct) {
      const newId = Number(id);
      return { status: 'SUCCESS', data: { id: newId, name: product.name } };
    }
    return { status: 'NOT_FOUND', data: { message: PRODUCT_NOT_FOUND } };
  } catch (error) {
    return { status: 'INTERNAL_SERVER_ERROR', data: { message: 'Failed to retrieve product' } };
  }
};

const deleteProduct = async (id) => {
  try {
    const [result] = await productModel.deleteProduct(id);
    console.log(result);
    if (result.affectedRows > 0) {
      return { status: 'DELETED' };
    }
    return { status: 'NOT_FOUND', data: { message: PRODUCT_NOT_FOUND } };
  } catch (error) {
    return { status: 'INTERNAL_SERVER_ERROR', 
      data: { message: 'Failed to retrieve product' } };
  }
};

module.exports = {
  getAllProducts,
  getProductsByID,
  addProduct,
  updateProduct,
  deleteProduct,
};
