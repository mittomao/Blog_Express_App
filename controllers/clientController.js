'use strict'
const _CONST = require('../config/constant')
const _UTIL = require('../utils')
const _BLOG_CON = require('./blogController')
const _USER_CON = require('./usersController')

module.exports = {
    home: async (req, res) => { 
        try {
            let { page = 1 } = req.params;
            const data = await _BLOG_CON.Func_Get_ALl_Post();
            console.log('data homepage', data);
            if (data) {
                return res.render("home.ejs", { 
                    posts: data.posts,
                    title: 'Home Page',
                    layout: "home-layout" 
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
}