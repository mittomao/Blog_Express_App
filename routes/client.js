'use strict';
const express = require('express')
const clientController = require('../controllers/clientController')
const { upload } = require('../utils/cloudinary')

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
// Router Project
clientRouter.get('/projects/qr-love', clientController.qrLove)
clientRouter.post('/projects/qr-love', upload.array('images', 10),clientController.createQRLove)
clientRouter.get('/projects/qr-love/preview', clientController.qrPreview)

clientRouter.get('/projects/firework-love', clientController.fireworkLove)
clientRouter.post('/projects/firework-love', upload.array('images', 10),clientController.createFireworkLove)
clientRouter.get('/projects/firework-love/preview', clientController.fireworkPreview)
// End Router Project
clientRouter.get('/page-404', clientController.pageNotFound)
clientRouter.get('*', (req, res) => res.redirect('/page-404'))

module.exports = clientRouter;