const DATE = '2024-04-03T01:38:36.000Z';

const mockData = [
  {
    salesId: 1,
    salesDate: DATE,
    productId: 1,
    quantity: 5,
  },
  {
    salesId: 1,
    salesDate: DATE,
    productId: 2,
    quantity: 10,
  },
  {
    salesId: 2,
    salesDate: DATE,
    productId: 3,
    quantity: 15,
  },
];

const mockSales = [
  {
    salesDate: DATE,
    productId: 1,
    quantity: 5,
  },
  {
    salesDate: DATE,
    productId: 2,
    quantity: 10,
  },
  {
    salesDate: DATE,
    productId: 3,
    quantity: 15,
  },
];

module.exports = {
  mockData,
  mockSales,
};
