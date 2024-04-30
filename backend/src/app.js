const express = require('express');
const route = require('./routes/route.product');
const routeSales = require('./routes/route.sales');

const app = express();

app.use(express.json());

// não remova esse endpoint, é para o avaliador funcionar
app.get('/', (_request, response) => {
  response.json({ status: 'Store Manager UP!' });
});

app.use('/products', route);
app.use('/sales', routeSales);

module.exports = app;
