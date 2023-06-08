'use strict'
const _BLOG_CON = require('./blogController')
const _TAG_CON = require('./tagController')
const _COMP_CON = require('./componentController')

class ResonposeDataClient {
    constructor({ layout, fullLayout, isAdmin, title, currentPage, totalPage, posts, tags, related, newsletter, popularArticle }) {
        this.layout = layout;
        this.fullLayout = fullLayout;
        this.isAdmin = isAdmin;
        this.title = title;
        this.currentPage = currentPage;
        this.totalPage = totalPage;
        this.posts = posts;
        this.tags = tags;
        this.related = related;
        this.newsletter = newsletter;
        this.popularArticle = popularArticle;
    }
}

module.exports = {
    home: async (req, res) => {
        try {
            let { page = 1 } = req.params;
            const data = await _BLOG_CON.Func_Get_ALl_Post(page);
            const tags = await _TAG_CON.Func_Get_ALl_Tag();
            const newsletters = await _COMP_CON.Func_Get_Data_Component_newsletter();
            const popularArticles = await _COMP_CON.Func_Get_Data_Component_popular_articles();

            if (data) {
                return res.render("home.ejs", 
                    new ResonposeDataClient({
                        fullLayout: true,
                        tags,
                        newsletter: newsletters[0],
                        popularArticle: popularArticles[0],
                        posts: data.posts,
                        currentPage: data.current,
                        totalPage: data.totalPage,
                        title: 'Home Page',
                        layout: "home-layout",
                        isAdmin: false,
                    }));
            }
        } catch (error) {
            console.error(error);
        }
    },
    portfolio: async (req, res) => {
        try {
            return res.render("portfolio.ejs",
                new ResonposeDataClient({ 
                    title: 'Portfolio Page',
                    layout: "home-layout",
                    fullLayout: false,
                }));
        } catch (error) {
            console.error(error);
        }
    },
    detailPost: async (req, res) => {
        try {
            const { id } = req.params;
            let data = await _BLOG_CON.Func_Get_Post_By_Id(id);
            const tags = await _TAG_CON.Func_Get_ALl_Tag();
            if (data) {
                await _BLOG_CON.Func_Random_Post((result, id) => {
                    return res.render("detail-post.ejs", 
                        new ResonposeDataClient({
                            posts: data,
                            tags,
                            related: result,
                            title: data.title,
                            layout: "home-layout",
                            fullLayout: true,
                        }));
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
                return res.render("tag.ejs",
                    new ResonposeDataClient({
                        fullLayout: true,
                        posts: data.posts,
                        tags,
                        currentPage: data.current,
                        totalPage: data.totalPage,
                        title: tag,
                        layout: "home-layout",
                        isAdmin: false
                    }));
            }

        } catch (error) {
            console.error(error);
        }
    },
    contact: async (req, res) => {
        try {
            return res.render("contact.ejs",
                new ResonposeDataClient({
                    fullLayout: false,
                    title: "Contact Page",
                    layout: "home-layout",
                    isAdmin: false
                }));
        } catch (error) {
            console.error(error);
        }
    },
    life: async (req, res) => {
        try {
            return res.render("life.ejs",
                new ResonposeDataClient({
                    fullLayout: false,
                    title: "Contact Page",
                    layout: "home-layout",
                    isAdmin: false
                }));
        } catch (error) {
            console.error(error);
        }
    },
    about: async (req, res) => {
        try {
            return res.render("about.ejs",
                new ResonposeDataClient({
                    fullLayout: false,
                    title: "Contact Page",
                    layout: "home-layout",
                    isAdmin: false
                }));
        } catch (error) {
            console.error(error);
        }
    }
}