'use strict';
const express = require('express')
const clientController = require('../controllers/clientController')

const clientRouter = express.Router();

clientRouter.get('/', clientController.home)
clientRouter.get('/p/:page', clientController.home)
clientRouter.get('/portfolio', clientController.portfolio)
clientRouter.get('/post/:id', clientController.detailPost)
clientRouter.get('/tag/:tag', clientController.tag)

module.exports = clientRouter;