const connection = require('./connection');

const getAllProducts = async () => {
  const products = await connection.execute('SELECT * FROM products');
  return products;
};

const getProductsByID = async (id) => {
  const produts = await connection
    .execute('SELECT * FROM products where id = ? ORDER BY id', [id]);
  return produts;
};

const addProduct = async (product) => {
  const newProduct = await connection
    .execute('INSERT INTO products (name) VALUES (?)', [product.name]);
  return newProduct;
};
const updateProduct = async (id, product) => {
  const updated = await connection
    .execute('UPDATE products SET name = ? WHERE id = ?', [product.name, id]);
  return updated;
};

const deleteProduct = async (id) => {
  const deleted = await connection
    .execute('DELETE FROM products WHERE id = ?', [id]);
  return deleted;
};

module.exports = {
  getAllProducts,
  getProductsByID,
  addProduct,
  updateProduct,
  deleteProduct,
};