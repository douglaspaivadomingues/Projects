const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const saleService = require('../../../src/services/sales.service');
const salesModel = require('../../../src/models/sales.model');
const { mockData } = require('../../mocks/sales.mock');
const validateSales = require('../../../src/middlewares/validate.sales');
const app = require('../../../src/app');

const { expect } = chai;

chai.use(chaiHttp);

const SALE_NOT_FOUND = 'Sale not found';

describe('Testes da camada Service', function () {
  afterEach(function () {
    sinon.restore();
  });

  it('Testando a busca de todas as vendas', async function () {
    sinon.stub(salesModel, 'getSales').resolves([mockData]);
    const result = await saleService.getSales();
    if (result.length > 0) { 
      const expectedResult = result.map((prod) => ({
        saleId: prod.sales_id,
        date: prod.sales_date,
        productId: prod.product_id,
        quantity: prod.quantity,
      }));
      expect(result).to.deep.equal({ status: 'SUCCESS', data: expectedResult });
      return { status: 'SUCCESS', data: expectedResult };
    }
  });
  it('Testando a busca uma venda por um id', async function () {
    sinon.stub(salesModel, 'getSales').resolves([mockData]);
    const result = await saleService.getSaleByID(1);
    console.log(result);
    if (result.length > 0) { 
      const expectedResult = result.map((prod) => ({
        saleId: prod.sales_id,
        date: prod.sales_date,
        productId: prod.product_id,
        quantity: prod.quantity,
      }));
      expect(result).to.deep.equal({ status: 'SUCCESS', data: expectedResult });
      return { status: 'SUCCESS', data: expectedResult };
    }
  });
  it('Testando a busca uma venda por um id inexistente', async function () {
    sinon.stub(salesModel, 'getSales').resolves([mockData]);
    const result = await saleService.getSaleByID(999);
    if (result.length > 0) { 
      const expectedResult = result.map((prod) => ({
        saleId: prod.sales_id,
        date: prod.sales_date,
        productId: prod.product_id,
        quantity: prod.quantity,
      }));
      expect(result).to.deep.equal({ status: 'NOT_FOUND', data: { message: SALE_NOT_FOUND } });
      return { status: 'SUCCESS', data: expectedResult };
    }
  });
  it('Testando se sale for false com model retornando array vazio', async function () {
    sinon.stub(salesModel, 'getSaleByID').resolves([]);
    const result = await saleService.getSaleByID(9);
    if (result.length > 0) { 
      const expectedResult = result.map((prod) => ({
        saleId: prod.sales_id,
        date: prod.sales_date,
        productId: prod.product_id,
        quantity: prod.quantity,
      }));
      expect(result).to.deep.equal({ status: 'NOT_FOUND', data: { message: SALE_NOT_FOUND } });
      return { status: 'SUCCESS', data: expectedResult };
    }
  });
  it('Testando se sale for false com model retornando array com false', async function () {
    sinon.stub(salesModel, 'getSaleByID').resolves([false]);
    const result = await saleService.getSaleByID(99);
    if (result.length > 0) { 
      const expectedResult = result.map((prod) => ({
        saleId: prod.sales_id,
        date: prod.sales_date,
        productId: prod.product_id,
        quantity: prod.quantity,
      }));
      expect(result).to.deep.equal({ status: 'NOT_FOUND', data: { message: SALE_NOT_FOUND } });
      return { status: 'SUCCESS', data: expectedResult };
    }
  });
  it('Testando a busca uma venda sem passar um id', async function () {
    sinon.stub(salesModel, 'getSales').resolves([mockData]);
    const result = await saleService.getSaleByID();
    if (result.length > 0) { 
      const expectedResult = result.map((prod) => ({
        saleId: prod.sales_id,
        date: prod.sales_date,
        productId: prod.product_id,
        quantity: prod.quantity,
      }));
      expect(result).to.deep.equal({ status: 'NOT_FOUND', data: { message: SALE_NOT_FOUND } });
      return { status: 'SUCCESS', data: expectedResult };
    }
  });
  it('Testando a busca por id com retorno false', async function () {
    sinon.stub(salesModel, 'getSales').resolves([false]);
    const result = await saleService.getSaleByID();
    if (result.length > 0) { 
      const expectedResult = result.map((prod) => ({
        saleId: prod.sales_id,
        date: prod.sales_date,
        productId: prod.product_id,
        quantity: prod.quantity,
      }));
      expect(result).to.deep.equal({ status: 'NOT_FOUND', data: { message: SALE_NOT_FOUND } });
      return { status: 'SUCCESS', data: expectedResult };
    }
  });
  it('Testando a busca uma venda com retorno false', async function () {
    sinon.stub(salesModel, 'getSales').resolves([false]);
    const result = await saleService.getSales();
    if (result.length > 0) { 
      const expectedResult = result.map((prod) => ({
        saleId: prod.sales_id,
        date: prod.sales_date,
        productId: prod.product_id,
        quantity: prod.quantity,
      }));
      expect(result).to.deep.equal({ status: 'NOT_FOUND', data: { message: SALE_NOT_FOUND } });
      return { status: 'SUCCESS', data: expectedResult };
    }
  });
  it('Testando a busca uma venda com ID false', async function () {
    sinon.stub(salesModel, 'getSales').resolves([mockData]);
    const id = false;
    const result = await saleService.getSaleByID(id);
    expect(result).to.deep.equal({ status: 'NOT_FOUND', data: { message: SALE_NOT_FOUND } });
  });
  it('Testando adicionar uma venda', async function () {
    sinon.stub(salesModel, 'addSales').resolves([
      { saleId: 24, productId: 1, quantity: 1 },
      { saleId: 24, productId: 2, quantity: 5 }]);

    sinon.stub(validateSales, 'validSale').resolves({ status: 'SUCCESS' });
    const product = [
    
      {
        productId: 1,
        quantity: 1,
      },
      {
        productId: 2,
        quantity: 5,
      }];
    const results = await saleService.addSales(product);
 
    expect(results).to.deep.equal({ status: 'CREATED', 
      data: { id: 24, itemsSold: product } });
  });
  it('Testando adicionar uma venda com false', async function () {
    sinon.stub(salesModel, 'addSales').resolves([
      { saleId: 24, productId: 1, quantity: 1 },
      { saleId: 24, productId: 2, quantity: 5 }]);

    sinon.stub(validateSales, 'validSale').resolves(false);
    const product = [
    
      {
        productId: 1,
        quantity: 1,
      },
      {
        productId: 2,
        quantity: 5,
      }];
    const results = await saleService.addSales(product);
 
    expect(results).to.deep.equal(false);
  });
  it('Testando adicionar uma venda com id false', async function () {
    sinon.stub(salesModel, 'addSales').resolves([
      { saleId: 24, productId: 1, quantity: 1 },
      { saleId: 24, productId: 2, quantity: 5 }]);

    sinon.stub(validateSales, 'validSale').resolves(false);
    const product = [
    
      {
        productId: 1,
        quantity: 1,
      },
      {
        productId: 2,
        quantity: 5,
      }];
    const results = await saleService.addSales(product);
 
    expect(results).to.deep.equal(false);
  });
  
  it('Testando buscar uma venda pelo ID que não existe', async function () {
    const getID = await chai
      .request('http://localhost:3001')
      .get('/sales/99');
 
    expect(getID.status).to.deep.equal(404);
  });
  it('Testando buscar todas as vendas com MOCK', async function () {
    sinon.stub(salesModel, 'getSales').resolves(mockData);
    const getID = await chai
      .request('http://localhost:3001')
      .get('/sales');
 
    expect(getID.status).to.deep.equal(200);
  });
  it('Testando buscar todas as vendas com MOCK e app', async function () {
    sinon.stub(salesModel, 'getSales').resolves(mockData);
    const response = await chai
      .request(app)
      .get('/');
 
    expect(response.status).to.deep.equal(200);
  }); 
});
