const connection = require('./connection');

const addSales = async (products) => {
  const [newProduct] = await connection
    .execute('INSERT INTO sales (date) VALUES (CURRENT_TIMESTAMP)');
  const saleId = newProduct.insertId;

  const sales = await Promise.all(products.map(async (product) => {
    const { productId, quantity } = product;
    await connection.execute(
      'INSERT INTO sales_products (sale_id, product_id, quantity) VALUES (?, ?, ?)',
      [saleId, productId, quantity],
    );
    return {
      saleId,
      productId,
      quantity,
    };
  }));
  const salesCreated = Promise.all(sales);
  return salesCreated;
};

const getSales = async () => {
  const sales = await connection
    .execute(`SELECT 
      sales.id, 
      sales.date,
      sp.product_id,
      sp.quantity
  FROM sales
  JOIN sales_products sp ON sales.id = sp.sale_id`);
  return sales;
};

const getSaleByID = async (id) => {
  const sales = await connection.execute(`
  SELECT sales.date AS sd, sp.product_id, sp.quantity, sp.sale_id
  FROM sales
  JOIN sales_products sp ON sales.id = sp.sale_id
  WHERE sales.id = ?
`, [id]);
  return sales;
};

module.exports = {
  addSales,
  getSales,
  getSaleByID,
};