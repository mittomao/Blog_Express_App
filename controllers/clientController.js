'use strict'
const _BLOG_CON = require('./blogController')
const _TAG_CON = require('./tagController')
const _COMP_CON = require('./componentController');

class ResonposeDataClient {
    constructor({ layout, fullLayout, isAdmin, title, currentPage, totalPage, posts, tags, related, newsletter, popularArticle, portfolio, categories, allPost, aboutAuthor, isHideSidebar = false, isSearch = false, qrLink = "", qrTexts = "", isPreview = false }) {
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
        this.isHideSidebar = isHideSidebar;
        this.isSearch = isSearch;
        this.qrLink = qrLink;
        this.qrTexts = qrTexts;
        this.isPreview = isPreview;
    }
}


const GetDataInHomePage = async () => {
    const tags = await _TAG_CON.Func_Get_ALl_Tag();
    const newsletters = await _COMP_CON.Func_Get_Data_Component_newsletter();
    const popularArticles = await _COMP_CON.Func_Get_Data_Component_popular_articles();
    //Get Categories
    const categories = await _BLOG_CON.Func_Get_Unique_By_Field("topic");
    console.log("dataCategories", categories);

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
            const listPosts = await _BLOG_CON.Func_Get_ALl_Post(page, { status: true });
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
            const dataPost = await _BLOG_CON.Func_Get_Post_By_Id(id);
            const aboutAuthor = await _COMP_CON.Func_Get_Data_Component_about_author();

            const dataHome = await GetDataInHomePage();
            if (dataPost || dataHome) {
                await _BLOG_CON.Func_Random_Post((result, id) => {
                    const response = new ResonposeDataClient({
                        posts: dataPost,
                        related: result,
                        title: dataPost.title,
                        layout: "home-layout",
                        fullLayout: true,
                        isHideSidebar: true
                    })
                    return res.render("detail-post.ejs", { ...response, aboutAuthor: aboutAuthor[0] });
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
            let { page = 1, title } = req.params;
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
                        allPost: listPosts.allItems,
                        title: 'Home Page',
                        layout: "home-layout",
                        isAdmin: false,
                        isSearch: true
                    }));
            }
        } catch (error) {
            console.error(error);
            res.redirect('/page-404');
        }
    },
    filterTopic: async (req, res) => {
        try {
            let { page = 1, title } = req.params;
            const listPosts = await _BLOG_CON.Func_Get_ALl_Post(page, {
                status: true,
                topic: title,
            });
            console.log("title-listPosts: ", title, listPosts);
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
                        allPost: listPosts.allItems,
                        title: 'Home Page',
                        layout: "home-layout",
                        isAdmin: false,
                        isSearch: true
                    }));
            }
        } catch (error) {
            console.error(error);
            res.redirect('/page-404');
        }
    },
    qrLove: async (req, res) => {
        try {
            return res.render("qr-love.ejs",
                new ResonposeDataClient({
                    fullLayout: false,
                    title: "QR Love Page",
                    layout: "home-layout",
                    isAdmin: false
                }));
        } catch (error) {
            res.redirect('/page-404');
        }
    },
    createQRLove: async (req, res) => {
        try {
            const { texts, isPreview } = req.body;
            if (!texts || texts.length === 0) {
                return res.redirect('/qr-love');
            }

            var loveText = texts.split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 0)
                .join(",");

            console.log("loveText: ", loveText);

            var id = await _BLOG_CON.Func_Create_QR_LOVE({ texts: loveText });
            return res.redirect(`/qr-love/preview?id=${id}&isPreview=${isPreview}`);
        } catch (error) {
            res.redirect('/page-404');
        }
    },
    preview: async (req, res) => {
        try {
            const { id, isPreview } = req.query;
            console.log("id: ", id);

            if (!id) {
                return res.status(400).send('Thiếu tham số id');
            }

            const doc = await _BLOG_CON.Func_Get_QR_By_Id(id);
            console.log("doc: ", doc);
            
            if (!doc) {
                return res.status(404).send('Không tìm thấy dữ liệu');
            }
            return res.render("preview-love-page.ejs",
                new ResonposeDataClient({
                    fullLayout: false,
                    title: "Preview Love Page",
                    layout: isPreview ? "home-layout" :"default-layout",
                    isAdmin: false,
                    qrTexts: doc.texts,
                    isPreview: isPreview,
                }));
        } catch (error) {
            res.redirect('/page-404');
        }
    }
}