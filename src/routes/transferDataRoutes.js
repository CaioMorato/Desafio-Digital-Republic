const express = require('express');
const transferDataRoutes = express.Router();

transferDataRoutes.get('/transfer');

module.exports = transferDataRoutes;
