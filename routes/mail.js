'use strict';
const express = require('express')
const mailController = require('../controllers/mailController')

const mailRouter = express.Router();
mailRouter.post('/', mailController.sendEmail);


module.exports = mailRouter;