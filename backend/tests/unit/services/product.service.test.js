const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const productService = require('../../../src/services/product.service');
const productModel = require('../../../src/models/product.model');
const mockProducts = require('../../mocks/products.mock');
const connection = require('../../../src/models/connection');
const validateProduct = require('../../../src/middlewares/validate.product');

const { expect } = chai;

chai.use(chaiHttp);

const PRODUCT_NOT_FOUND = 'Product not found';

describe('Testes da camada Service', function () {
  afterEach(function () {
    sinon.restore();
  });

  it('Testando a busca de um produto pelo ID inexistente', async function () {
    sinon.stub(productModel, 'getProductsByID').resolves([]);
    sinon.stub(validateProduct, 'validateByID').resolves({ 
      status: 'NOT_FOUND', data: { message: PRODUCT_NOT_FOUND } });
    const result = await productService.getProductsByID(15);
    expect(result.status).to.deep.equal('NOT_FOUND');
    expect(result.data).to.deep.equal({ message: PRODUCT_NOT_FOUND });
  });
  it('Testando a busca de um produto sem ID', async function () {
    sinon.stub(productModel, 'getProductsByID').resolves([]);
    sinon.stub(validateProduct, 'validateByID').resolves({ 
      status: 'NOT_FOUND', data: { message: PRODUCT_NOT_FOUND } });
    const result = await productService.getProductsByID();
    expect(result.status).to.deep.equal('NOT_FOUND');
    expect(result.data).to.deep.equal({ message: PRODUCT_NOT_FOUND });
  });
  it('Testando a busca de um produto com retorno false', async function () {
    sinon.stub(productModel, 'getProductsByID').resolves([false]);
    const result = await productService.getProductsByID(99);
    expect(result.status).to.deep.equal('NOT_FOUND');
    expect(result.data).to.deep.equal({ message: PRODUCT_NOT_FOUND });
  });
  it('Testando a busca de todos os produtos', async function () {
    sinon.stub(productModel, 'getAllProducts').resolves([mockProducts]);
    const result = await productService.getAllProducts();

    const expectedResult = {
      status: 'SUCCESS',
      data: mockProducts,
    };
    expect(result).to.deep.equal(expectedResult);
  });
  it('Testando a busca de todos os produtos sem retorno', async function () {
    sinon.stub(productModel, 'getAllProducts').resolves([]);
    const result = await productService.getAllProducts();

    const expectedResult = {
      status: 'NOT_FOUND',
      data: { message: PRODUCT_NOT_FOUND },
    };
    expect(result).to.deep.equal(expectedResult);
  });
  it('Testando adicionar um produto', async function () {
    const produto = { name: 'Capa do thor' };

    sinon.stub(productModel, 'addProduct').resolves([{ insertId: 2 }]);
    const result = await productService.addProduct(produto);

    expect(result).to.deep.equal({
      status: 'CREATED',
      data: { id: 2, name: 'Capa do thor' },
    });
  });

  // it('Testando deletar um produto que não existe', async function () {
  //   const id = '2';
  //   sinon.stub(validateProduct, 'validateByID').resolves({ 
  //     status: 'NOT_FOUND', data: { message: PRODUCT_NOT_FOUND } });
  
  //   const result = await productService.deleteProduct(id);

  //   expect(result).to.deep.equal({
  //     status: 'NOT_FOUND', data: { message: PRODUCT_NOT_FOUND },
  //   });
  // });
  it('Testando deletar um produto existente', async function () {
    const id = '2';
    sinon.stub(productModel, 'deleteProduct').resolves([{ affectedRows: 1 }]);
    sinon.stub(productModel, 'getProductsByID').resolves([{ id: 2, name: 'Martelo do thot' }]);
  
    const result = await productService.deleteProduct(id);

    expect(result).to.deep.equal({ status: 'DELETED' });
  });
  it('Testando editar um produto existente', async function () {
    sinon.stub(connection, 'execute').resolves([[{ affectedRows: 1 }]]);
    const id = '2';
    const product = { name: 'Martelo do thor' };
    sinon.stub(productModel, 'updateProduct').resolves([{ affectedRows: 1 }]);
  
    const result = await productService.updateProduct(id, product);

    expect(result).to.deep.equal({ status: 'SUCCESS', data: { id: 2, name: 'Martelo do thor' } });
  });
  it('Testando editar um produto sem sucesso', async function () {
    sinon.stub(connection, 'execute').resolves([[{ affectedRows: 0 }]]);
    const id = '2';
    const product = { name: 'Martelo do thor' };
    sinon.stub(productModel, 'updateProduct').resolves([false]);
  
    const result = await productService.updateProduct(id, product);

    expect(result).to.deep.equal({ status: 'NOT_FOUND', data: { message: 'Product not found' } });
  });
});