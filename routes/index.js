'use strict';
const express = require('express')
const index_Controller = require('../controllers/')
const middleware = require('../utils/middleware')

const router = express.Router();
router.get('/', index_Controller.home)
router.get('/p/:page', index_Controller.home)

// Login
router.get('/login', index_Controller.login)
router.post('/login', index_Controller.login)

// Register
router.get('/register', index_Controller.register)
router.post('/register', index_Controller.register)
// router.post('/login', index_Controller.login)
// router.get('/profile', [middleware.checkLogin, index_Controller.profile])
// router.get('/profile', [middleware.checkLogin, index_Controller.profile])

//Create 
router.get('/add-post', index_Controller.pageCreate)
router.post('/add-post', index_Controller.addPost)

// Update
router.get('/edit-post/:id', index_Controller.pageEdit)
router.post('/update-post', index_Controller.updatePost)

// Delete
router.post('/delete-post', index_Controller.deletePost)

module.exports = router;