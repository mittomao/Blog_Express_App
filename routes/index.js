'use strict';
const express = require('express')
const index_Controller = require('../controllers/indexController')
const middleware = require('../utils/middleware')

const router = express.Router();
router.get('/', index_Controller.home)
router.get('/p/:page', index_Controller.home)

// Login
router.get('/login', index_Controller.login)
router.post('/login', index_Controller.login)

// Logout
router.get('/logout', index_Controller.logout)
// Register
router.get('/register', index_Controller.register)
router.post('/register', index_Controller.register)
// router.post('/login', index_Controller.login)
// router.get('/profile', [middleware.checkLogin, index_Controller.profile])
// router.get('/profile', [middleware.checkLogin, index_Controller.profile])

//Create Post
router.get('/add-post', index_Controller.addPost)
router.post('/add-post', index_Controller.addPost)

// Update Post
router.get('/edit-post/:id', index_Controller.pageEdit)
router.post('/update-post', index_Controller.updatePost)

// Delete Post
router.post('/delete-post', index_Controller.deletePost)

// View Page Tag
router.get('/tag', index_Controller.pageTag)
// Create Tag
router.get('/add-tag', index_Controller.addTag)
router.post('/add-tag', index_Controller.addTag)

router.get('/edit-tag/:id', index_Controller.pageEditTag)
router.post('/update-tag', index_Controller.updateTag)
router.post('/delete-tag', index_Controller.deleteTag)

// Component
router.get('/components/:name', index_Controller.components)
router.post('/components/:name', index_Controller.components)

//Upload Image
router.get('/upload', index_Controller.viewUpload)
router.post('/upload', index_Controller.uploadImage)


module.exports = router;