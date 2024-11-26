'use strict';
const express = require('express')
const indexController = require('../controllers/indexController')
const mailController = require('../controllers/mailController')

const apiRouter = express.Router();
apiRouter.get('/datas', indexController.getAllJsonData);
apiRouter.post('/sendemail', mailController.sendEmail);


module.exports = apiRouter;