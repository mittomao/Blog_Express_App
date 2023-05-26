'use strict';
const express = require('express')
const clientController = require('../controllers/clientController')

const clientRouter = express.Router();

clientRouter.get('/', clientController.home)
clientRouter.get('/portfolio', clientController.portfolio)

module.exports = clientRouter;