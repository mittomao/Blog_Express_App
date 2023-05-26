'use strict'
const { Exception } = require('sass')
const _CONST = require('../config/constant')
const _UTIL = require('../utils')
const _BLOG_CON = require('./blogController')
const _USER_CON = require('./usersController')

module.exports = {
    home: async (req, res) => { 
        try {
            let { page = 1 } = req.params;
            if (req.session?.loggedin) {
                const data = await _BLOG_CON.Func_Get_ALl_Post(page);
                if (data) {
                    return res.render('index.ejs', {
                        blogs: data.posts,
                        currentPage: data.current,
                        totalPage: data.totalPage,
                        allItems: data.allItems,
                        username: req.session.username,
                        title: 'Admin Page', 
                        layout: 'admin-layout',
                    });
                }
            }
            
            return res.redirect('http://localhost:9000/admin/login')
            
        } catch (error) {
            console.error(error);
        }
    },
    addPost: async (req, res) => {
        if (req.method === "GET") {
            return res.render('add-post.ejs', { title: 'Add Post Page', layout: 'admin-layout' });
        }
        try {
            let add = await _BLOG_CON.Func_Create_Post(req.body);
            if (add) {
                return res.redirect('http://localhost:9000/admin');
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
                return res.render('edit-post.ejs', { data: post, title: 'Register Page', layout: 'admin-layout' });
            }
        } catch (error) {
            console.error('error', error)
        }
    },
    updatePost: async (req, res) => {
        const { id } = req.query;
        try {
            console.log("req.body", req.body);
            let update = await _BLOG_CON.Func_Update_Post_By_Id(id, req.body);
            if (update) {
                return res.redirect('http://localhost:9000/admin');
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
                return res.redirect('http://localhost:9000/admin');
            }
        } catch (error) {
            console.error('error', error)
        }
    },
    register: async (req, res) => {
        if (req.method === "GET") {
            return res.render('register.ejs', { title: 'Register Page', layout: 'admin-layout' })
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
                return res.redirect('http://localhost:9000/admin')
            }
        } catch (error) {
            console.error(error)
        }
    },
    login: async (req, res) => {
        if (req.method === 'GET') {
            return res.render('login.ejs', { title: 'Login Page', layout: 'admin-layout' })
        }

        req.session = req.session || {};

        try {
            const { username, password } = req.body;
            const login = await _USER_CON.FUNC_LOGIN({
                username,
                password
            });

            if (login) {
                req.session.loggedin = true;
				req.session.username = username;
				req.body.test = username;

                res.redirect('http://localhost:9000/admin')
            } else {
                res.send("Username Or Password Is Correct!!!")
                // res.status(404).json({
                //     mess: "Username or Password is Correct"
                // })
            }
        } catch (error) {
            console.error(error)
        }
    },
    logout: async (req, res) => {
        req.session.loggedin = false;
        req.session.username = null;

        res.redirect('http://localhost:9000/admin/login')
    }
}