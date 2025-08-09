'use strict'
const _BLOG_CON = require('./blogController');
const _PROJECT_LOVE_CON = require('./projectLoveController');
const _TAG_CON = require('./tagController');
const _COMP_CON = require('./componentController');
const { viewFormProjectLove, createProjectLove, previewProjectLove } = require('./utils/ProjectLove/index');

const ResonposeDataClient = require('./ResonposeDataClient');

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
    // StartProject QR Love
    qrLove: async (req, res) => {
        try {
            return res.render("form-qr-love.ejs",
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
            const { texts, color, music } = req.body;
            console.log("texts: ", texts);
            if (!texts || texts.length === 0) {
                return res.redirect('/projects/qr-love');
            }

            var loveTexts = texts;

            const imageUrls = req.files && req.files.map(file => file.path).join(',');

            console.log("loveTexts: ", loveTexts);
            console.log("imageUrls: ", imageUrls);
            console.log("color: ", color);
            console.log("music: ", music);

            var id = await _PROJECT_LOVE_CON.Func_Create_QR_LOVE({ texts: loveTexts, images: imageUrls, color, music });
            return res.redirect(`/projects/qr-love/?id=${id}`);
        } catch (error) {
            res.redirect('/page-404');
        }
    },
    qrPreview: async (req, res) => {
        try {
            const { id } = req.query;
            console.log("id: ", id);

            if (!id) {
                return res.status(400).send('Thiếu tham số id');
            }

            const doc = await _PROJECT_LOVE_CON.Func_Get_QR_By_Id(id);
            console.log("QR Item: ", doc);

            if (!doc) {
                return res.status(404).send('Không tìm thấy dữ liệu');
            }
            return res.render("preview-qr-love-page.ejs",
                new ResonposeDataClient({
                    fullLayout: false,
                    title: "Preview QR Love Page",
                    layout: "default-layout",
                    isAdmin: false,
                    qrTexts: doc.texts,
                    projectImages: doc.images,
                    textColor: doc.color,
                    music: doc.music
                }));
        } catch (error) {
            res.redirect('/page-404');
        }
    },
    // End Project QR Love

    // Start Project Firework Love
    fireworkLove: async (req, res) => {
        try {
            return res.render("form-firework-love.ejs",
                new ResonposeDataClient({
                    fullLayout: false,
                    title: "Firework Love Page",
                    layout: "home-layout",
                    isAdmin: false
                }));
        } catch (error) {
            res.redirect('/page-404');
        }
    },

    createFireworkLove: async (req, res) => {
        try {
            const { texts, music } = req.body;
            if (!texts || texts.length === 0) {
                return res.redirect('/projects/firework-love');
            }

            const imageUrls = req.files.map(file => file.path).join(',');

            var id = await _PROJECT_LOVE_CON.Func_Create_Firework_LOVE({ texts, images: imageUrls, music });
            return res.redirect(`/projects/firework-love/?id=${id}`);
        } catch (error) {
            res.redirect('/page-404');
        }
    },

    fireworkPreview: async (req, res) => {
        try {
            const { id } = req.query;
            console.log("id: ", id);

            if (!id) {
                return res.status(400).send('Thiếu tham số id');
            }

            const doc = await _PROJECT_LOVE_CON.Func_Get_Firework_By_Id(id);
            console.log("Firework Item: ", doc);

            if (!doc) {
                return res.status(404).send('Không tìm thấy dữ liệu');
            }
            return res.render("preview-firework-love-page.ejs",
                new ResonposeDataClient({
                    fullLayout: false,
                    title: "Preview Firework Love Page",
                    layout: "default-layout",
                    isAdmin: false,
                    fireworkTexts: doc.texts,
                    projectImages: doc.images,
                    music: doc.music
                }));
        } catch (error) {
            res.redirect('/page-404');
        }
    },
    // End Project Firework Love

    // Start Project Love
    viewFormProjectLove: async (req, res) => {
        try {
            const { project } = req.query || "";
            return await viewFormProjectLove(req, res, project);
        } catch (error) {
            res.redirect('/page-404');
        }
    },
    createProjectTreeStory: async (req, res) => {
        try {            
            return await createProjectLove(req, res, "tree-story");
        } catch (error) {
            res.redirect('/page-404');
        }
    },
    projectTreeStoryPreview: async (req, res) => {
        try {
            return await previewProjectLove(req, res, "Tree Story", "projects/preview-tree-story-page.ejs");
        } catch (error) {
            res.redirect('/page-404');
        }
    },
    // End Project Love
}