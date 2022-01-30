// vitals
const express = require('express');

// routes
const accountRoutes = require('./src/routes/accountRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

require('dotenv').config();

const app = express();

app.use(express.json());

app.use(accountRoutes);
app.use(adminRoutes);

module.exports = app;
