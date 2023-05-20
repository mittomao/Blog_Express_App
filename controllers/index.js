'use strict'
const _CONST = require('../config/constant')
const _UTIL = require('../utils/')
const _LOGIN_CON = require('./loginController')
const _USERS_CON = require('./usersController')
const _BLOG_CON = require('./blogController')

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
            // const data = await _BLOG_CON.Func_Get_ALl_Post();
            // return res.render('home.ejs', {
            //     blogs: data
            // });
        } catch (error) {
            console.error('error', error)
        }
    }

    // profile: async (req, res) => {
    //     return res.render('profile')
    // },
    // login: async (req, res) => {
    //     if(req.session.user){
    //         return res.redirect('http://localhost:9000/profile?step=session')
    //     }
    //     if(req.method === 'GET'){
    //         return res.render('login')
    //     }

    //     if(req.method === 'POST'){
    //         //su dung Util check missing key neu can
    //         let q = req.body;
    //         let check = _UTIL.checkMissingKey(q, ['email', 'password'])
    //         console.log('check>>>>', check)
    //         if(q.TYPE === 'RE'){
    //             console.log('user >>> register');
    //             let rsLogin = await _LOGIN_CON.function_register(q)
    //             if(rsLogin){
    //                 let rsUser = await _USERS_CON.function_register_users(q);
    //                 if(rsUser){
    //                     return res.redirect('http://localhost:9000/login?step=login')
    //                 }
    //             }

    //             return res.redirect('http://localhost:9000/login?step=error_login')
    //         }

    //         //xu ly cho login

    //         if(q.TYPE === 'LO'){
    //             let objLogin = await _LOGIN_CON.function_login(q)
    //             if(objLogin){
    //                 //storage session here
    //                 req.session.user = objLogin;
    //                 return res.redirect('http://localhost:9000/profile?step=login_success')
    //             }
    //             return res.redirect('http://localhost:9000/login?step=error')
    //         }
    //     }

    // },
}