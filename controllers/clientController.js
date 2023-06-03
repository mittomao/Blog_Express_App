'use strict'
const _CONST = require('../config/constant')
const _UTIL = require('../utils')
const _BLOG_CON = require('./blogController')
const _USER_CON = require('./usersController')

module.exports = {
    home: async (req, res) => {
        try {
            let { page = 1 } = req.params;
            const data = await _BLOG_CON.Func_Get_ALl_Post(page);

            if (data) {
                return res.render("home.ejs", {
                    posts: data.posts,
                    currentPage: data.current,
                    totalPage: data.totalPage,
                    title: 'Home Page',
                    layout: "home-layout",
                    isAdmin: false
                });
            }
        } catch (error) {
            console.error(error);
        }
    },
    portfolio: async (req, res) => {
        try {
            return res.render("portfolio.ejs", { title: 'Portfolio Page', layout: "home-layout" });
        } catch (error) {
            console.error(error);
        }
    },
    detailPost: async (req, res) => {
        try {
            const { id } = req.params;
            let post = await _BLOG_CON.Func_Get_Post_By_Id(id);
            if (post) {
                await _BLOG_CON.Func_Random_Post((result) => {
                    return res.render("detail-post.ejs", {
                        data: post,
                        related: result,
                        title: post.title,
                        layout: "home-layout" 
                    });
                });
            }

        } catch (error) {
            console.error(error);
        }
    },
    tag: async (req, res) => {
        try {
            const { page = 1, tag } = req.params;
            let data = await _BLOG_CON.Func_Get_Post_By_Search(page, 'tag', tag);

            if (data) {
                return res.render("tag.ejs", { 
                    posts: data.posts,
                    currentPage: data.current,
                    totalPage: data.totalPage,
                    title: tag, 
                    layout: "home-layout",
                    isAdmin: false
                });
            }

        } catch (error) {
            console.error(error);
        }
    }
}