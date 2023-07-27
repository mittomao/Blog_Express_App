'use strict'
const _BLOG_CON = require('./blogController')
const _TAG_CON = require('./tagController')
const _COMP_CON = require('./componentController');

class ResonposeDataClient {
    constructor({ layout, fullLayout, isAdmin, title, currentPage, totalPage, posts, tags, related, newsletter, popularArticle, portfolio, categories, allPost, aboutAuthor }) {
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
        this.portfolio = portfolio;
        this.categories = categories;
        this.allPost = allPost;
        this.aboutAuthor = aboutAuthor;
    }
}


const GetDataInHomePage = async () => {
    const tags = await _TAG_CON.Func_Get_ALl_Tag();
    const newsletters = await _COMP_CON.Func_Get_Data_Component_newsletter();
    const popularArticles = await _COMP_CON.Func_Get_Data_Component_popular_articles();
    //Get Categories
    const dataCategories = await _TAG_CON.Func_Get_ALl_Tag();
    const categories = dataCategories && dataCategories.filter(x => x.prioritize);

    return {
        tags,
        newsletters,
        popularArticles,
        categories
    }
}

module.exports = {
    home: async (req, res) => {
        try {
            let { page = 1 } = req.params;
            const listPosts = await _BLOG_CON.Func_Get_ALl_Post(page, {status: true});
            const dataHome = await GetDataInHomePage();
            // End 

            if (listPosts || dataHome) {
                return res.render("home.ejs",
                    new ResonposeDataClient({
                        fullLayout: true,
                        tags: dataHome.tags,
                        newsletter: dataHome.newsletters[0],
                        popularArticle: dataHome.popularArticles[0],
                        categories: dataHome.categories,
                        posts: listPosts.posts,
                        currentPage: listPosts.current,
                        totalPage: listPosts.totalPage,
                        title: 'Home Page',
                        layout: "home-layout",
                        isAdmin: false,
                        allPost: listPosts.allItems
                    }));
            }
        } catch (error) {
            console.error(error);
            res.redirect('/page-404');
        }
    },
    pageNotFound: async (req, res) => {
        return res.render("page-404.ejs",
            new ResonposeDataClient({
                title: '404 Page Not Found',
                layout: "default-layout",
            }));
    },
    portfolio: async (req, res) => {
        try {
            const portfolios = await _COMP_CON.Func_Get_Data_Component_portfolio();
            return res.render("portfolio.ejs",
                new ResonposeDataClient({
                    portfolio: portfolios[0],
                    title: 'Portfolio Page',
                    layout: "home-layout",
                    fullLayout: false,
                }));
        } catch (error) {
            res.redirect('/page-404');
        }
    },
    detailPost: async (req, res) => {
        try {
            const { id } = req.params;
            let dataPost = await _BLOG_CON.Func_Get_Post_By_Id(id);
            let aboutAuthor = await _COMP_CON.Func_Get_Data_Component_about_author();
            const dataHome = await GetDataInHomePage();
            if (dataPost || dataHome) {
                await _BLOG_CON.Func_Random_Post((result, id) => {
                    return res.render("detail-post.ejs",
                        new ResonposeDataClient({
                            posts: dataPost,
                            tags: dataHome.tags,
                            newsletter: dataHome.newsletters[0],
                            popularArticle: dataHome.popularArticles[0],
                            categories: dataHome.categories,
                            related: result,
                            title: dataPost.title,
                            layout: "home-layout",
                            fullLayout: true,
                            aboutAuthor
                        }));
                });
            }

        } catch (error) {
            res.redirect('/page-404');
        }
    },
    tag: async (req, res) => {
        try {
            const { page = 1, tag } = req.params;
            let dataPost = await _BLOG_CON.Func_Get_ALl_Post(page, {
                tag: { "$regex": tag, "$options": "i" },
                status: true
             });
            const dataHome = await GetDataInHomePage();
            // End 

            if (dataPost) {
                return res.render("tag.ejs",
                    new ResonposeDataClient({
                        fullLayout: true,
                        posts: dataPost.posts,
                        tags: dataHome.tags,
                        newsletter: dataHome.newsletters[0],
                        popularArticle: dataHome.popularArticles[0],
                        categories: dataHome.categories,
                        currentPage: dataPost.current,
                        totalPage: dataPost.totalPage,
                        title: tag,
                        layout: "home-layout",
                        isAdmin: false
                    }));
            }

        } catch (error) {
            res.redirect('/page-404');
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
            res.redirect('/page-404');
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
            res.redirect('/page-404');
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
            res.redirect('/page-404');
        }
    },
    search: async (req, res) => {
        try {
            let { page = 1 } = req.params;
            let { title } = req.body;
            const listPosts = await _BLOG_CON.Func_Get_ALl_Post(page, {
                status: true,
                title: { "$regex": title, "$options": "i" },
            });
            const dataHome = await GetDataInHomePage();
            // End 

            if (listPosts || dataHome) {
                return res.render("home.ejs",
                    new ResonposeDataClient({
                        fullLayout: true,
                        tags: dataHome.tags,
                        newsletter: dataHome.newsletters[0],
                        popularArticle: dataHome.popularArticles[0],
                        categories: dataHome.categories,
                        posts: listPosts.posts,
                        currentPage: listPosts.current,
                        totalPage: listPosts.totalPage,
                        title: 'Home Page',
                        layout: "home-layout",
                        isAdmin: false,
                    }));
            }
        } catch (error) {
            console.error(error);
            res.redirect('/page-404');
        }
    }
}