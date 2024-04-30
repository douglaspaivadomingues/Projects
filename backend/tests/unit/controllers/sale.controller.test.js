const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const salesService = require('../../../src/services/sales.service');
const saleController = require('../../../src/controllers/sales.controller');
const { mockSales } = require('../../mocks/sales.mock');

const { expect } = chai;

chai.use(chaiHttp);
chai.use(sinonChai);

describe('Testes da camada controller', function () {
  afterEach(function () {
    sinon.restore();
  });
  it('Teste da camada de controller com produto de id inválido', async function () {
    sinon.stub(salesService, 'addSales').resolves({
      status: 'NOT_FOUND',
      data: { message: 'Product not found' },
    });

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    const req = [
      { productId: 55, quantity: 1 },
      { productId: 100, quantity: 1 },
    ];
    await saleController.addSales(req, res);
    expect(res.status).to.have.calledWith(404);
    expect(res.json).to.have.been.calledWith({ message: 'Product not found' });
  });
  it('Teste da camada de controller com produto sem id', async function () {
    sinon.stub(salesService, 'addSales').resolves({
      status: 'BAD_REQUEST',
      data: { message: 'productId is required' },
    });

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    const req = [
      { quantity: 1 },
      { quantity: 1 },
    ];

    await saleController.addSales(req, res);
    expect(res.status).to.be.have.calledWith(400);
    expect(res.json).to.be.have.been.calledWith({ message: 'productId is required' });
  });
  it('Teste da camada de controller add', async function () {
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    
    const req = [
      { productId: 1, quantity: 1 },
      { productId: 2, quantity: 1 },
    ];

    sinon.stub(salesService, 'addSales').resolves({
      status: 'CREATED',
      data: { id: 1, ...req.body },
    });

    await saleController.addSales(req, res);
    expect(res.status).to.be.have.calledWith(201);
  });
  it('Get tudo controller', async function () {
    const req = {};
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    sinon.stub(salesService, 'getSales').resolves({ status: 'SUCCESS', data: mockSales });
    await saleController.getSales(req, res);
    expect(res.status).to.be.have.calledWith(200);
  });
  it('Controller objeto vazio', async function () {
    const req = { params: {} };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    sinon.stub(salesService, 'getSaleByID').resolves({ status: 'NOT_FOUND', data: { message: 'Sale not found' } });
    await saleController.getSaleByID(req, res);
    expect(res.status).to.be.have.calledWith(404);
  });
});