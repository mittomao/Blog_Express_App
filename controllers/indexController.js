'use strict'
const _CONST = require('../config/constant')
const { getAllResources } = require('../utils/cloudinary')
const _BLOG_CON = require('./blogController')
const _USER_CON = require('./usersController')
const _TAG_CON = require('./tagController')
const _COMP_CON = require('./componentController')
const imagesModel = require('../models/imagesModel');
const dataApis = require('../api');

class ResonposeDataAdmin {
    constructor({ layout, isAdmin, title, currentPage, totalPage, blogs, allItems, tags, account, action, dataComponent, componentName, useStyleClient, listImages }) {
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
        this.listImages = listImages;
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
                console.error('error', error);
                return res.redirect('/admin?toast=error&status=error&msg=Failed+to+load+tags');
            }
        }

        try {
            const { title, content, summary, status, topic, tag, thumbnail } = req.body;

            // Server-Side Independent Validation
            if (!title || typeof title !== 'string' || title.trim().length < 5 || title.trim().length > 200) {
                return res.redirect('/admin/add-post?toast=error&status=error&msg=Title+must+be+between+5+and+200+characters');
            }

            const cleanContent = content ? content.replace(/<[^>]*>/g, '').trim() : '';
            if (!content || cleanContent.length < 10) {
                return res.redirect('/admin/add-post?toast=error&status=error&msg=Content+must+be+at+least+10+characters');
            }

            if (summary && summary.trim().length > 500) {
                return res.redirect('/admin/add-post?toast=error&status=error&msg=Summary+cannot+exceed+500+characters');
            }

            const normalizedTag = tag ? (Array.isArray(tag) ? tag.join(',') : tag.toString()) : '';
            const normalizedStatus = status === '0' || status === 0 ? '0' : '1';

            let add = await _BLOG_CON.Func_Create_Post({
                author: req.session?.account?.username,
                title: title.trim(),
                content,
                summary: summary ? summary.trim() : '',
                status: normalizedStatus,
                topic: topic ? topic.trim() : '',
                thumbnail: thumbnail ? thumbnail.trim() : '',
                tag: normalizedTag
            });

            if (add) {
                if (tag) {
                    const tagList = Array.isArray(tag) ? tag : tag.toString().split(',').map(t => t.trim()).filter(Boolean);
                    if (tagList.length > 0) {
                        await _TAG_CON.Func_Increment_Quantity({ name: { "$in": tagList } });
                    }
                }
                return res.redirect('/admin?toast=post_created&status=success');
            } else {
                return res.redirect('/admin/add-post?toast=error&status=error&msg=Failed+to+create+post');
            }
        } catch (error) {
            console.error('error', error);
            return res.redirect('/admin/add-post?toast=error&status=error&msg=Server+error+creating+post');
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
            return res.redirect('/admin?toast=error&status=error&msg=Post+not+found');
        } catch (error) {
            console.error('error', error);
            return res.redirect('/admin?toast=error&status=error&msg=Invalid+post+id');
        }
    },
    updatePost: async (req, res) => {
        const { id } = req.query;
        if (!id) {
            return res.redirect('/admin?toast=error&status=error&msg=Missing+post+id');
        }

        try {
            const { title, content, summary, status, topic, tag, thumbnail } = req.body;

            // Server-Side Independent Validation
            if (!title || typeof title !== 'string' || title.trim().length < 5 || title.trim().length > 200) {
                return res.redirect(`/admin/edit-post/${id}?toast=error&status=error&msg=Title+must+be+between+5+and+200+characters`);
            }

            const cleanContent = content ? content.replace(/<[^>]*>/g, '').trim() : '';
            if (!content || cleanContent.length < 10) {
                return res.redirect(`/admin/edit-post/${id}?toast=error&status=error&msg=Content+must+be+at+least+10+characters`);
            }

            if (summary && summary.trim().length > 500) {
                return res.redirect(`/admin/edit-post/${id}?toast=error&status=error&msg=Summary+cannot+exceed+500+characters`);
            }

            const normalizedTag = tag ? (Array.isArray(tag) ? tag.join(',') : tag.toString()) : '';
            const normalizedStatus = status === '0' || status === 0 ? '0' : '1';

            let update = await _BLOG_CON.Func_Update_Post_By_Id(id, {
                author: req.session?.account?.username,
                title: title.trim(),
                content,
                summary: summary ? summary.trim() : '',
                status: normalizedStatus,
                topic: topic ? topic.trim() : '',
                thumbnail: thumbnail ? thumbnail.trim() : '',
                tag: normalizedTag
            });

            if (update) {
                return res.redirect('/admin?toast=post_updated&status=success');
            } else {
                return res.redirect(`/admin/edit-post/${id}?toast=error&status=error&msg=Failed+to+update+post`);
            }
        } catch (error) {
            console.error('error', error);
            return res.redirect(`/admin/edit-post/${id}?toast=error&status=error&msg=Server+error+updating+post`);
        }
    },
    deletePost: async (req, res) => {
        const { id } = req.query;
        if (!id) {
            return res.redirect('/admin?toast=error&status=error&msg=Missing+post+id');
        }

        try {
            const post = await _BLOG_CON.Func_Get_Post_By_Id(id);
            if (!post) {
                return res.redirect('/admin?toast=error&status=error&msg=Post+not+found');
            }

            let deletePost = await _BLOG_CON.Func_Delete_Post_By_Id(id);
            if (deletePost) {
                if (post.tag) {
                    const tagList = post.tag.split(',').map(t => t.trim()).filter(Boolean);
                    if (tagList.length > 0) {
                        await _TAG_CON.Func_Decrement_Quantity({ name: { "$in": tagList } });
                    }
                }
                return res.redirect('/admin?toast=post_deleted&status=success');
            } else {
                return res.redirect('/admin?toast=error&status=error&msg=Failed+to+delete+post');
            }
        } catch (error) {
            console.error('error', error);
            return res.redirect('/admin?toast=error&status=error&msg=Server+error+deleting+post');
        }
    },
    register: async (req, res) => {
        return res.redirect('/admin/login');
    },
    login: async (req, res) => {
        if (req.method === 'GET') {
            return res.render('login.ejs', new ResonposeDataAdmin({ title: 'Login Page', layout: 'admin-layout' }));
        }

        req.session = req.session || {};

        try {
            const { username, password } = req.body;
            if (!username || !password || username.trim().length < 3 || password.length < 6) {
                return res.redirect('/admin/login?toast=login_failed&status=error');
            }

            const login = await _USER_CON.FUNC_LOGIN({
                username: username.trim(),
                password: password
            });

            if (login) {
                req.session.account = {
                    loggedin: true,
                    username: username.trim(),
                    avatar: login.avatar
                };

                return res.redirect('/admin');
            } else {
                return res.redirect('/admin/login?toast=login_failed&status=error');
            }
        } catch (error) {
            console.error(error);
            return res.redirect('/admin/login?toast=error&status=error&msg=Login+error');
        }
    },
    logout: async (req, res) => {
        req.session.account = {
            loggedin: false,
            username: null
        };

        res.redirect('/admin/login');
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

        return res.redirect('/admin/login');
    },
    addTag: async (req, res) => {
        if (req.method === "GET") {
            return res.render('add-tag.ejs', new ResonposeDataAdmin({ title: 'Add Tag Page', layout: 'admin-layout' }));
        }

        try {
            const { name, prioritize } = req.body;
            if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 50) {
                return res.redirect('/admin/add-tag?toast=error&status=error&msg=Tag+name+must+be+between+2+and+50+characters');
            }

            const tagName = name.trim();
            // Check if tag already exists in MongoDB
            const allTags = await _TAG_CON.Func_Get_ALl_Tag();
            const exists = allTags.some(t => t.name.toLowerCase() === tagName.toLowerCase());
            if (exists) {
                return res.redirect('/admin/add-tag?toast=error&status=error&msg=Tag+name+already+exists');
            }

            const normalizedPriority = prioritize === '1' || prioritize === 1 ? 1 : 0;
            let add = await _TAG_CON.Func_Create_Tag({
                name: tagName,
                prioritize: normalizedPriority
            });

            if (add) {
                return res.redirect('/admin/tag?toast=tag_created&status=success');
            } else {
                return res.redirect('/admin/add-tag?toast=error&status=error&msg=Failed+to+create+tag');
            }
        } catch (error) {
            console.error('error', error);
            return res.redirect('/admin/add-tag?toast=error&status=error&msg=Server+error+creating+tag');
        }
    },
    pageEditTag: async (req, res) => {
        const { id } = req.params;
        try {
            let post = await _TAG_CON.Func_Get_Tag_By_Id(id);
            if (post) {
                return res.render('edit-tag.ejs', new ResonposeDataAdmin({ blogs: post, title: 'Edit Tag Page', layout: 'admin-layout' }));
            }
            return res.redirect('/admin/tag?toast=error&status=error&msg=Tag+not+found');
        } catch (error) {
            console.error('error', error);
            return res.redirect('/admin/tag?toast=error&status=error&msg=Invalid+tag+id');
        }
    },
    updateTag: async (req, res) => {
        const { id } = req.query;
        if (!id) {
            return res.redirect('/admin/tag?toast=error&status=error&msg=Missing+tag+id');
        }

        try {
            const { name, prioritize } = req.body;
            if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 50) {
                return res.redirect(`/admin/edit-tag/${id}?toast=error&status=error&msg=Tag+name+must+be+between+2+and+50+characters`);
            }

            const tagName = name.trim();
            // Check duplicate tag excluding current id
            const allTags = await _TAG_CON.Func_Get_ALl_Tag();
            const exists = allTags.some(t => t._id.toString() !== id.toString() && t.name.toLowerCase() === tagName.toLowerCase());
            if (exists) {
                return res.redirect(`/admin/edit-tag/${id}?toast=error&status=error&msg=Tag+name+already+exists`);
            }

            const normalizedPriority = prioritize === '1' || prioritize === 1 ? 1 : 0;
            let update = await _TAG_CON.Func_Update_Tag_By_Query({ _id: id }, {
                name: tagName,
                prioritize: normalizedPriority
            });

            if (update) {
                return res.redirect('/admin/tag?toast=tag_updated&status=success');
            } else {
                return res.redirect(`/admin/edit-tag/${id}?toast=error&status=error&msg=Failed+to+update+tag`);
            }
        } catch (error) {
            console.error('error', error);
            return res.redirect(`/admin/edit-tag/${id}?toast=error&status=error&msg=Server+error+updating+tag`);
        }
    },
    deleteTag: async (req, res) => {
        const { id } = req.query;
        if (!id) {
            return res.redirect('/admin/tag?toast=error&status=error&msg=Missing+tag+id');
        }

        try {
            let deleteTag = await _TAG_CON.Func_Delete_Post_By_Id(id);
            if (deleteTag) {
                return res.redirect('/admin/tag?toast=tag_deleted&status=success');
            } else {
                return res.redirect('/admin/tag?toast=error&status=error&msg=Failed+to+delete+tag');
            }
        } catch (error) {
            console.error('error', error);
            return res.redirect('/admin/tag?toast=error&status=error&msg=Server+error+deleting+tag');
        }
    },
    // Components
    components: async (req, res) => {
        let { name } = req.params;
        if (req.method === "GET") {
            try {
                const getFn = _COMP_CON['Func_Get_Data_Component_' + name];
                if (!getFn) {
                    return res.redirect('/admin?toast=error&status=error&msg=Component+not+found');
                }
                const data = await getFn();
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
                console.error(error);
                return res.redirect('/admin?toast=error&status=error&msg=Failed+to+load+component');
            }
        }

        try {
            const updateFn = _COMP_CON['Func_Update_Data_Component_' + name];
            if (!updateFn) {
                return res.redirect('/admin?toast=error&status=error&msg=Component+update+handler+not+found');
            }
            await updateFn(req.body, (result) => {
                return res.redirect('/admin/components/' + name + '?toast=widget_updated&status=success');
            });
        } catch (error) {
            console.error(error);
            return res.redirect('/admin/components/' + name + '?toast=error&status=error&msg=Failed+to+update+widget');
        }
    },
    //Upload Image
    viewUpload: async (req, res) => {
        try {
            if (req.session?.account?.loggedin) {
                const listImages = await getAllResources();
                return res.render('upload.ejs',
                    new ResonposeDataAdmin({
                        account: req.session.account,
                        title: 'Upload Image Page',
                        layout: 'admin-layout',
                        isAdmin: true,
                        listImages: listImages || []
                    }));
            }
            return res.redirect('/admin/login');
        } catch (error) {
            console.error(error);
        }
    },
    getAllJsonData: async (req, res) => {
        try {
            return res.status(200).json({
                data: dataApis,
                succes: true
            });
        } catch (error) {
            console.error(error);
        }
    },
    // uploadImage: async (req, res) => {
    //     try {
    //         const { file } = req.body;
    //         console.log('file upload', req.file);

    //         res.status(200).send({
    //             message: 'Image uploaded successfully',
    //         });
    //     } catch (error) {
    //         res.status(400).json({
    //             message: "Upload Fail"
    //         })
    //     }
    // },
    // deleteImage: async (req, res) => {
    //     const { id } = req.body;
    //     try {
    //         let deleteTag = await imagesModel.findByIdAndDelete(id);
    //         if (deleteTag) {
    //             return res.status(200).json({
    //                 message: 'Delete Success'
    //             })
    //         }
    //     } catch (error) {
    //         return res.status(500).json({
    //             message: 'Delete Fail' + error
    //         })
    //     }
    // }
}