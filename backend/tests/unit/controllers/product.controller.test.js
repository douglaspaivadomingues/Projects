const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');
const mapStatusCode = require('../../../src/controllers/product.status.controller');
const productService = require('../../../src/services/product.service');
const productController = require('../../../src/controllers/product.controller');
const mockProducts = require('../../mocks/products.mock');

const { expect } = chai;

chai.use(chaiHttp);

const PRODUCT_NOT_FOUND = 'Product not found';

describe('Testes da camada controller', function () {
  afterEach(function () {
    sinon.restore();
  });
  it('Test function mapStatus With SUCCESS', async function () {
    const result = mapStatusCode('SUCCESS');
    expect(result).to.be.equal(200);
  });
  it('Test function mapStatus With CREATED', async function () {
    const result = mapStatusCode('CREATED');
    expect(result).to.be.equal(201);
  });
  it('Test function mapStatus With NOT FOUND', async function () {
    const result = mapStatusCode('NOT_FOUND');
    expect(result).to.be.equal(404);
  });
  it('Test function mapStatus With  INTERNAL_SERVER_ERROR:', async function () {
    const result = mapStatusCode(' INTERNAL_SERVER_ERROR');
    expect(result).to.be.equal(500);
  });
  it('Tes function mapStatus with UNAUTHORIZED', async function () {
    const result = mapStatusCode('UNAUTHORIZED');
    expect(result).to.be.equal(422);
  });
  it('Tes function mapStatus with BAD_REQUEST', async function () {
    const result = mapStatusCode('BAD_REQUEST');
    expect(result).to.be.equal(400);
  });

  it('Test get tudo', async function () {
    sinon.stub(productService, 'getAllProducts').resolves({ 
      status: 'SUCCESS', data: mockProducts });
    const req = {};
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    await productController.getAllProducts(req, res);
    expect(res.status).to.be.have.calledWith(200);
  });
  it('Test get tudo failed', async function () {
    sinon.stub(productService, 'getAllProducts').resolves({ 
      status: 'NOT_FOUND', data: { message: PRODUCT_NOT_FOUND } });
    const req = {};
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    await productController.getAllProducts(req, res);
    expect(res.status).to.be.have.calledWith(404);
    expect(res.json).to.be.have.been.calledWith({ message: PRODUCT_NOT_FOUND });
  });
  it('Test get length === 0 ', async function () {
    sinon.stub(productService, 'getAllProducts').resolves({ 
      status: 'NOT_FOUND', data: { message: PRODUCT_NOT_FOUND } });
    const req = {};
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    await productController.getAllProducts(req, res);
    expect(res.status).to.be.have.calledWith(404);
    expect(res.json).to.be.have.been.calledWith({ message: PRODUCT_NOT_FOUND });
  });

  it('Test get tudo by ID', async function () {
    sinon.stub(productService, 'getProductsByID').resolves({
      status: 'SUCCESS', data: mockProducts[0] });
    const req = { params: { id: 1 } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    await productController.getProductsByID(req, res);
    expect(res.status).to.be.have.calledWith(200);
  });
  it('Test get tudo by ID inválido', async function () {
    sinon.stub(productService, 'getProductsByID').resolves({
      status: 'NOT_FOUND', data: { message: PRODUCT_NOT_FOUND } });
    const req = { params: { id: 99 } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    await productController.getProductsByID(req, res);
    expect(res.status).to.be.have.calledWith(404);
    expect(res.json).to.be.have.been.calledWith({ message: PRODUCT_NOT_FOUND });
  });
  it('Test get tudo sem ID', async function () {
    sinon.stub(productService, 'getProductsByID').resolves({
      status: 'NOT_FOUND', data: { message: PRODUCT_NOT_FOUND } });
    const req = { params: {} };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    await productController.getProductsByID(req, res);
    expect(res.status).to.be.have.calledWith(404);
    expect(res.json).to.be.have.been.calledWith({ message: PRODUCT_NOT_FOUND });
  });
  it('Test add Produto', async function () {
    sinon.stub(productService, 'addProduct').resolves({ 
      status: 'CREATED', data: { id: 1, name: 'Capa do dr Estranho' } });
    const req = { name: 'Capa do dr Estranho' };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    await productController.addProduct(req, res);
    expect(res.status).to.be.have.calledWith(201);
    expect(res.json).to.be.have.been.calledWith({ id: 1, name: 'Capa do dr Estranho' });
  });
  it('Test add Produto sem passar produto', async function () {
    sinon.stub(productService, 'addProduct').resolves({ 
      status: 'BAD_REQUEST', data: { message: 'product is required' } });
    const req = {};
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    await productController.addProduct(req, res);
    expect(res.status).to.be.have.calledWith(400);
    expect(res.json).to.be.have.been.calledWith({ message: 'product is required' });
  });
  it('Test add Produto sem passar name', async function () {
    sinon.stub(productService, 'addProduct').resolves({ 
      status: 'BAD_REQUEST', data: { message: 'name is required' } });
    const req = { xablau: 'martelada' };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    await productController.addProduct(req, res);
    expect(res.status).to.be.have.calledWith(400);
    expect(res.json).to.be.have.been.calledWith({ message: 'name is required' });
  });
  it('Test add Produto passando nome curto', async function () {
    sinon.stub(productService, 'addProduct').resolves({ 
      status: 'UNAUTHORIZED', data: { message: 'name length must be at least 5 characters long' } });
    const req = { name: 'thor' };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    await productController.addProduct(req, res);
    expect(res.status).to.be.have.calledWith(422);
    expect(res.json).to.be.have.been.calledWith({ message: 'name length must be at least 5 characters long' });
  });
  it('Test update product', async function () {
    sinon.stub(productService, 'updateProduct').resolves({ 
      status: 'SUCCESS', data: { id: 2, name: 'manta do dr estranho' } });
    const req = { params: 2, name: 'martelo storm do Thor' };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    await productController.updateProduct(req, res);
    expect(res.status).to.be.have.calledWith(200);
    expect(res.json).to.be.have.been.calledWith({ id: 2, name: 'manta do dr estranho' });
  });
  it('Test update product sem id válido', async function () {
    sinon.stub(productService, 'updateProduct').resolves({ 
      status: 'NOT_FOUND', data: { message: PRODUCT_NOT_FOUND } });
    const req = { params: 9999, name: 'martelo storm do Thor' };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    await productController.updateProduct(req, res);
    expect(res.status).to.be.have.calledWith(404);
    expect(res.json).to.be.have.been.calledWith({ message: PRODUCT_NOT_FOUND });
  });
  it('Test update product sem id false', async function () {
    sinon.stub(productService, 'updateProduct').resolves({ 
      status: 'NOT_FOUND', data: { message: 'Product not found' } });
    const req = { params: false, name: 'martelo storm do Thor' };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    await productController.updateProduct(req, res);
    expect(res.status).to.be.have.calledWith(404);
    expect(res.json).to.be.have.been.calledWith({ message: PRODUCT_NOT_FOUND });
  });
  it('Test erro do servidor', async function () {
    sinon.stub(productService, 'addProduct').resolves({ 
      status: 'INTERNAL_SERVER_ERROR', data: { message: 'Failed to retrieve product' } });
    const req = {};
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    await productController.addProduct(req, res);
    expect(res.status).to.be.have.calledWith(500);
    expect(res.json).to.be.have.been.calledWith({ message: 'Failed to retrieve product' });
  });
  it('Test delete', async function () {
    sinon.stub(productService, 'addProduct').resolves({ 
      status: 'DELETED' });
    const req = { params: 2 };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    await productController.addProduct(req, res);
    expect(res.status).to.be.have.calledWith(204);
  });
  it('Test delete false', async function () {
    sinon.stub(productService, 'addProduct').resolves({ 
      status: 'NOT_FOUND', data: { message: PRODUCT_NOT_FOUND } });
    const req = { params: false };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    await productController.addProduct(req, res);
    expect(res.status).to.be.have.calledWith(404);
    expect(res.json).to.be.have.been.calledWith({ message: PRODUCT_NOT_FOUND });
  });
});