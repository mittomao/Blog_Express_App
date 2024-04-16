'use strict';
const express = require('express')
const indexController = require('../controllers/indexController')

const apiRouter = express.Router();
apiRouter.get('/datas', indexController.getAllJsonData)


module.exports = apiRouter;