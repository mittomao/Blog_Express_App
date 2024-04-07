'use strict';
const express = require('express')
const indexController = require('../controllers/indexController')

const apiRouter = express.Router();
apiRouter.get('/projects', indexController.getAllProjects)


module.exports = apiRouter;