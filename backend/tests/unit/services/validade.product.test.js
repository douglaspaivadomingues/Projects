const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');
const product = require('../../../src/middlewares/validate.product');
const sales = require('../../../src/middlewares/validate.sales');
const productModel = require('../../../src/models/product.model');

const { expect } = chai;

chai.use(chaiHttp);

describe('Testes da camada controller', function () {
  afterEach(function () {
    sinon.restore();
  });
  it('Testes da função validProduct with UNAUTHORIZED', async function () {
    const result = await product.validate({ name: 'thor' });
    expect(result).to.be.deep.equal({ 
      status: 'UNAUTHORIZED', 
      data: { message: '"name" length must be at least 5 characters long' } });
  });
  it('Testes da função validProduct sem produto', async function () {
    const result = await product.validate();
    expect(result).to.be.deep.equal({ 
      status: 'BAD_REQUEST', 
      data: { message: '"name" is required' } });
  });
  it('Testes da função validProduct sem name', async function () {
    const result = await product.validate({});
    expect(result).to.be.deep.equal({ 
      status: 'BAD_REQUEST', 
      data: { message: '"name" is required' } });
  });
  it('Testes da função validProductById produto inválido', async function () {
    sinon.stub(productModel, 'getProductsByID').resolves([]);
    const result = await sales.validProductById(10);
    expect(result).to.be.deep.equal({ 
      status: 'NOT_FOUND', 
      data: { message: 'Product not found' } });
  });
  it('Testes da função validProductById sem id', async function () {
    const result = await sales.validProductById();
    expect(result).to.be.deep.equal({
      status: 'BAD_REQUEST', data: { message: '"productId" is required' } });
  });
  it('Testes da função validProductById com id false', async function () {
    const id = false;
    const result = await sales.validProductById(id);
    expect(result).to.be.deep.equal({
      status: 'BAD_REQUEST', data: { message: '"productId" is required' } });
  });
  it('Testes da função validQuantity', async function () {
    const result = await sales.validProductByQuantity();
    expect(result).to.be.deep.equal({
      status: 'BAD_REQUEST', data: { message: '"quantity" is required' } });
  });
  it('Testes da função validQuantity com 0', async function () {
    const produto = 0;
    const result = await sales.validProductByQuantity(produto);
    expect(result).to.be.deep.equal({
      status: 'UNAUTHORIZED', data: { message: '"quantity" must be greater than or equal to 1' } });
  });
  it('Testes da função validQuantity com -1', async function () {
    const produto = -1;
    const result = await sales.validProductByQuantity(produto);
    expect(result).to.be.deep.equal({
      status: 'UNAUTHORIZED', data: { message: '"quantity" must be greater than or equal to 1' } });
  });
  it('Testes da função validQuantity sem quantity', async function () {
    const result = await sales.validProductByQuantity();
    expect(result).to.be.deep.equal({
      status: 'BAD_REQUEST', data: { message: '"quantity" is required' } });
  });
});