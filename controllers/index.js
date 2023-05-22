'use strict'
const { Exception } = require('sass')
const _CONST = require('../config/constant')
const _UTIL = require('../utils/')
const _BLOG_CON = require('./blogController')
const _USER_CON = require('./usersController')

module.exports = {
    home: async (req, res) => {
        let { page = 1 } = req.params;

        try {
            const data = await _BLOG_CON.Func_Get_ALl_Post(page);
            if (data) {
                return res.render('home.ejs', {
                    blogs: data.posts,
                    currentPage: data.current,
                    totalPage: data.totalPage,
                    allItems: data.allItems
                });
            }
        } catch (error) {
            console.error(error);
        }
    },
    pageCreate: (req, res) => {
        return res.render('add-post.ejs');
    },
    addPost: async (req, res) => {
        try {
            let add = await _BLOG_CON.Func_Create_Post(req.body);
            if (add) {
                return res.redirect('http://localhost:9000/');
            }
        } catch (error) {
            console.error('error', error)
        }
    },
    pageEdit: async (req, res) => {
        const { id } = req.params;
        try {
            let post = await _BLOG_CON.Func_Get_Post_By_Id(id);
            if (post) {
                return res.render('edit-post.ejs', { data: post });
            }
        } catch (error) {
            console.error('error', error)
        }
    },
    updatePost: async (req, res) => {
        const { id } = req.query;
        try {
            let update = await _BLOG_CON.Func_Update_Post_By_Id(id, req.body);
            if (update) {
                return res.redirect('http://localhost:9000/');
            }
        } catch (error) {
            console.error('error', error)
        }
    },
    deletePost: async (req, res) => {
        const { id } = req.query;
        try {
            let deletePost = await _BLOG_CON.Func_Delete_Post_By_Id(id);
            if (deletePost) {
                return res.redirect('http://localhost:9000/');
            }
        } catch (error) {
            console.error('error', error)
        }
    },
    register: async (req, res) => {
        if (req.method === "GET") {
            return res.render('register')
        }
        try {
            const { username, password, email, phone } = req.body;
            const register = await _USER_CON.FUNC_REGISTER_USER({
                username,
                password,
                email,
                phone
            });

            if (register) {
                return res.redirect('http://localhost:9000/')
            }
        } catch (error) {
            console.error(error)
        }
    },
    login: async (req, res) => {
        if (req.method === 'GET') {
            return res.render('login')
        }

        try {
            const { username, password } = req.body;
            const login = await _USER_CON.FUNC_LOGIN({
                username,
                password
            });

            if (login) {
                return res.redirect('http://localhost:9000/')
            } else {
                res.status(500).json({
                    mess: "Username or Password is Correct"
                })
            }
        } catch (error) {
            console.error(error)
        }
    },
}