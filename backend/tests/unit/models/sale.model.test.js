const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const connection = require('../../../src/models/connection');
const saleModel = require('../../../src/models/sales.model');

const { expect } = chai;
chai.use(chaiHttp);

describe('Testes da camada Sale model', function () {
  afterEach(function () {
    sinon.restore();
  });
  it('Teste da camada model adicionando uma venda válida', async function () {
    const returned = [
      { saleId: 24, productId: 1, quantity: 1 },
      { saleId: 24, productId: 2, quantity: 5 }];
    
    sinon.stub(connection, 'execute').resolves([{ insertId: 24 }]);
    
    const product = [
      {
        productId: 1,
        quantity: 1,
      },
      {
        productId: 2,
        quantity: 5,
      }];
    const result = await saleModel.addSales(product);
    expect(result).to.be.deep.equal(returned);
  });
  it('Teste da camada model pesquisa por ID', async function () {
    sinon.stub(connection, 'execute').resolves([{ insertId: 12 }]);
    const id = 12;
    const result = await saleModel.getSaleByID(id);
    expect(result).to.be.deep.equal([{ insertId: 12 }]);
  });
  it('Teste da camada model pesquisa por todas as vendas', async function () {
    sinon.stub(connection, 'execute').resolves([
      {
        salesId: 12,
        date: '2021-09-09T04:54:29.000Z',
        productId: 1,
        quantity: 2,
      },
    ]);
    const sales = {
      salesId: 12,
      date: '2021-09-09T04:54:29.000Z',
      productId: 1,
      quantity: 2,
    };
    const result = await saleModel.getSales();
    expect(result).to.be.deep.equal([sales]);
  });
});