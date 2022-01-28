// vitals
const express = require('express');

// routes
const accountRoutes = require('./src/routes/accountRoutes');
const transferDataRoutes = require('./src/routes/transferDataRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

require('dotenv').config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use(accountRoutes);
app.use(transferDataRoutes);
app.use(adminRoutes);

app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});
