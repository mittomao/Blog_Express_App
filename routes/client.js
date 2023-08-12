'use strict';
const express = require('express')
const clientController = require('../controllers/clientController')

const clientRouter = express.Router();
clientRouter.get('/', clientController.home)
clientRouter.get('/p/:page', clientController.home)
clientRouter.get('/portfolio', clientController.portfolio)
clientRouter.get('/post/:id', clientController.detailPost)
clientRouter.get('/tag/:tag', clientController.tag)
clientRouter.get('/life', clientController.life)
clientRouter.get('/about', clientController.about)
clientRouter.get('/contact', clientController.contact)
clientRouter.post('/search/:title', clientController.search)
clientRouter.get('/topic/:title', clientController.filterTopic)
clientRouter.get('/page-404', clientController.pageNotFound)
clientRouter.get('*', (req, res) => res.redirect('/page-404'))

module.exports = clientRouter;