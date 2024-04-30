const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const productModel = require('../../../src/models/product.model');
const connection = require('../../../src/models/connection');
const mockProducts = require('../../mocks/products.mock');

const { expect } = chai;

chai.use(chaiHttp);

describe('ProductModel', function () {
  afterEach(function () {
    sinon.restore();
  });
  
  it('Deve retornar todos os produtos pesquisados', async function () {
    sinon.stub(connection, 'execute').resolves(mockProducts);

    const AllResult = await productModel.getAllProducts();
    expect(AllResult).to.be.deep.equal(mockProducts);
  });
  it('Deve retornar o produto com o id correspondente', async function () {
    sinon.stub(connection, 'execute').resolves({ id: 1, name: 'Martelo de Thor' });
    const AllResult = await productModel.getProductsByID(1);
    expect(AllResult).to.be.deep.equal({ id: 1, name: 'Martelo de Thor' });
  });
  it('Deve adicionar um novo produto corretamente', async function () {
    const insertionResult = { insertId: 5 };
    sinon.stub(connection, 'execute').resolves(insertionResult);
    const result = await productModel.addProduct({ name: 'Capa do dr Estranho' });
    expect(result.insertId).to.be.deep.equal(5);
  });
  it('Deve editar um produto corretamente', async function () {
    const product = { name: 'Iron man armadura' };
    const updateResult = [{ affectedRows: 1 }];
    sinon.stub(connection, 'execute').resolves(updateResult);
    const [result] = await productModel.updateProduct(1, product);
    expect(result.affectedRows).to.be.equal(1);
  });
  it('Deve deletar um produto corretamente', async function () {
    const id = 2;
    sinon.stub(connection, 'execute');

    await productModel.deleteProduct(id);
    expect(connection.execute.firstCall.args[0]).to.equal('DELETE FROM products WHERE id = ?');
    expect(connection.execute.firstCall.args[1]).to.deep.equal([id]);
  });
});