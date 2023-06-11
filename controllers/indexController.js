'use strict'
const _CONST = require('../config/constant')
const _UTIL = require('../utils')
const _BLOG_CON = require('./blogController')
const _USER_CON = require('./usersController')
const _TAG_CON = require('./tagController')
const _COMP_CON = require('./componentController')

class ResonposeDataAdmin {
    constructor({ layout, isAdmin, title, currentPage, totalPage, blogs, allItems, tags, account, action, dataComponent, componentName, useStyleClient }) {
        this.layout = layout;
        this.isAdmin = isAdmin;
        this.title = title;
        this.currentPage = currentPage;
        this.totalPage = totalPage;
        this.blogs = blogs;
        this.allItems = allItems;
        this.tags = tags;
        this.account = account;
        this.action = action;
        this.dataComponent = dataComponent;
        this.componentName = componentName;
        this.useStyleClient = useStyleClient;
    }
}

module.exports = {
    // Post
    home: async (req, res) => {
        try {
            let { page = 1 } = req.params;
            if (req.session?.account?.loggedin) {
                const data = await _BLOG_CON.Func_Get_ALl_Post(page);
                if (data) {
                    return res.render('index.ejs',
                        new ResonposeDataAdmin({
                            blogs: data.posts,
                            currentPage: data.current,
                            totalPage: data.totalPage,
                            allItems: data.allItems,
                            account: req.session.account,
                            title: 'Admin Page',
                            layout: 'admin-layout',
                            isAdmin: true,
                            action: 'add-post'
                        }));
                }
            }

            return res.redirect('/admin/login')

        } catch (error) {
            console.error(error);
        }
    },
    addPost: async (req, res) => {
        if (req.method === "GET") {
            try {
                const tags = await _TAG_CON.Func_Get_ALl_Tag();
                return res.render('add-post.ejs',
                    new ResonposeDataAdmin({
                        title: 'Add Post Page',
                        tags,
                        layout: 'admin-layout'
                    }));
            } catch (error) {
                console.error('error', error)
            }
        }

        try {
            let add = await _BLOG_CON.Func_Create_Post({ author: req.session?.account?.username, ...req.body, tag: req.body.tag.toString() });
            if (add) {
                let updateQuantity = _TAG_CON.Func_Increment_Quantity({name: { "$in" : req.body.tag}});
                if (updateQuantity) {
                    return res.redirect('/admin');
                }  
            }
        } catch (error) {
            console.error('error', error)
        }
    },
    pageEdit: async (req, res) => {
        const { id } = req.params;
        try {
            let post = await _BLOG_CON.Func_Get_Post_By_Id(id);
            const tags = await _TAG_CON.Func_Get_ALl_Tag();
            if (post) {
                return res.render('edit-post.ejs',
                    new ResonposeDataAdmin({
                        blogs: post,
                        tags,
                        title: 'Edit Blog Page',
                        layout: 'admin-layout'
                    }));
            }
        } catch (error) {
            console.error('error', error)
        }
    },
    updatePost: async (req, res) => {
        const { id } = req.query;
        try {
            let update = await _BLOG_CON.Func_Update_Post_By_Id(id, { author: req.session?.account?.username, ...req.body, tag: req.body.tag.toString() });
            if (update) {
                return res.redirect('/admin');
            }
        } catch (error) {
            console.error('error', error)
        }
    },
    deletePost: async (req, res) => {
        const { id } = req.query;
        const post = await _BLOG_CON.Func_Get_Post_By_Id(id);
        try {
            let deletePost = await _BLOG_CON.Func_Delete_Post_By_Id(id);
            if (deletePost) {
                let updateQuantity = _TAG_CON.Func_Decrement_Quantity({name: { "$in" : post.tag.split(',')}});
                return res.redirect('/admin');
            }
        } catch (error) {
            console.error('error', error)
        }
    },
    register: async (req, res) => {
        if (req.method === "GET") {
            return res.render('register.ejs', new ResonposeDataAdmin({ title: 'Register Page', layout: 'admin-layout' }))
        }
        try {
            const { username, password, email, phone, avatar } = req.body;
            const register = await _USER_CON.FUNC_REGISTER_USER({
                username,
                password,
                email,
                phone,
                avatar
            });

            if (register) {
                return res.redirect('/admin')
            }
        } catch (error) {
            console.error(error)
        }
    },
    login: async (req, res) => {
        if (req.method === 'GET') {
            return res.render('login.ejs', new ResonposeDataAdmin({ title: 'Login Page', layout: 'admin-layout' }))
        }

        req.session = req.session || {};

        try {
            const { username, password } = req.body;
            const login = await _USER_CON.FUNC_LOGIN({
                username,
                password
            });

            if (login) {
                req.session.account = {
                    loggedin: true,
                    username: username,
                    avatar: login.avatar
                };

                res.redirect('/admin')
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
        req.session.account = {
            loggedin: false,
            username: null
        };

        res.redirect('/admin/login')
    },
    // Tag
    pageTag: async (req, res) => {
        if (req.session?.account?.loggedin) {
            const data = await _TAG_CON.Func_Get_ALl_Tag();

            if (data) {
                return res.render('tag-page.ejs',
                    new ResonposeDataAdmin({
                        account: req.session.account,
                        tags: data,
                        title: 'Tag Page',
                        layout: 'admin-layout',
                        isAdmin: true,
                        action: 'add-tag'
                    }));
            }
        }

        return res.redirect('/admin/login')
    },
    addTag: async (req, res) => {
        if (req.method === "GET") {
            return res.render('add-tag.ejs', new ResonposeDataAdmin({ title: 'Add Tag Page', layout: 'admin-layout' }));
        }
        try {
            let add = await _TAG_CON.Func_Create_Tag({ ...req.body });
            if (add) {
                return res.redirect('/admin/tag');
            }
        } catch (error) {
            console.error('error', error)
        }
    },
    pageEditTag: async (req, res) => {
        const { id } = req.params;
        try {
            let post = await _TAG_CON.Func_Get_Tag_By_Id(id);
            if (post) {
                return res.render('edit-tag.ejs', new ResonposeDataAdmin({ blogs: post, title: 'Edit Tag Page', layout: 'admin-layout' }));
            }
        } catch (error) {
            console.error('error', error)
        }
    },
    updateTag: async (req, res) => {
        const { id } = req.query;
        try {
            let update = await _TAG_CON.Func_Update_Tag_By_Query({_id: id}, { ...req.body });
            if (update) {
                return res.redirect('/admin/tag');
            }
        } catch (error) {
            console.error('error', error)
        }
    },
    deleteTag: async (req, res) => {
        const { id } = req.query;
        try {
            let deleteTag = await _TAG_CON.Func_Delete_Post_By_Id(id);
            if (deleteTag) {
                return res.redirect('/admin/tag');
            }
        } catch (error) {
            console.error('error', error)
        }
    },
    // Components
    components: async (req, res) => {
        let { name } = req.params;
        if (req.method === "GET") {
            try {
                const data = await _COMP_CON['Func_Get_Data_Component_' + name]();
                return res.render('components.ejs',
                    new ResonposeDataAdmin({
                        account: req.session.account,
                        title: name + ' Page',
                        layout: 'admin-layout',
                        isAdmin: true,
                        componentName: name,
                        dataComponent: data[0],
                        useStyleClient: true
                    }));
            } catch (error) {
                console.error(error)
            }

        }

        try {
            await _COMP_CON['Func_Update_Data_Component_' + name](req.body, (result) => {
                return res.redirect('/admin/components/' + name);
            });
        } catch (error) {
            console.error(error)
        }
    }
}