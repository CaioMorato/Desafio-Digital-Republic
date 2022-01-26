const express = require('express');
const accountRoutes = require('./src/routes');

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use(accountRoutes);

app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});
