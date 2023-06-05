'use strict'
const _BLOG_CON = require('./blogController')
const _TAG_CON = require('./tagController')

module.exports = {
    home: async (req, res) => {
        try {
            let { page = 1 } = req.params;
            const data = await _BLOG_CON.Func_Get_ALl_Post(page);
            const tags = await _TAG_CON.Func_Get_ALl_Tag();

            if (data) {
                return res.render("home.ejs", {
                    fullLayout: true,
                    tags,
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
            return res.render("portfolio.ejs", { 
                title: 'Portfolio Page',
                layout: "home-layout",
                fullLayout: false,
            });
        } catch (error) {
            console.error(error);
        }
    },
    detailPost: async (req, res) => {
        try {
            const { id } = req.params;
            let post = await _BLOG_CON.Func_Get_Post_By_Id(id);
            if (post) {
                await _BLOG_CON.Func_Random_Post((result, id) => {
                    return res.render("detail-post.ejs", {
                        data: post,
                        related: result,
                        title: post.title,
                        layout: "home-layout",
                        fullLayout: true,
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
            const tags = await _TAG_CON.Func_Get_ALl_Tag();

            if (data) {
                return res.render("tag.ejs", {
                    fullLayout: true,
                    posts: data.posts,
                    tags,
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
    },
    contact: async (req, res) => {
        try {
            return res.render("contact.ejs", {
                fullLayout: false,
                title: "Contact Page",
                layout: "home-layout",
                isAdmin: false
            });
        } catch (error) {
            console.error(error);
        }
    },
    life: async (req, res) => {
        try {
            return res.render("life.ejs", {
                fullLayout: false,
                title: "Contact Page",
                layout: "home-layout",
                isAdmin: false
            });
        } catch (error) {
            console.error(error);
        }
    },
    about: async (req, res) => {
        try {
            return res.render("about.ejs", {
                fullLayout: false,
                title: "Contact Page",
                layout: "home-layout",
                isAdmin: false
            });
        } catch (error) {
            console.error(error);
        }
    }
}