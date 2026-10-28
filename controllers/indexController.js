'use strict';

const { getAllResources } = require('../utils/cloudinary');
const _BLOG_CON = require('./blogController');
const _USER_CON = require('./usersController');
const _TAG_CON = require('./tagController');
const _COMP_CON = require('./componentController');
const dataApis = require('../api');

/**
 * Standard View Model for Admin Pages
 */
class ResonposeDataAdmin {
    constructor({
        layout,
        isAdmin,
        title,
        currentPage,
        totalPage,
        blogs,
        allItems,
        tags,
        account,
        action,
        dataComponent,
        componentName,
        useStyleClient,
        listImages
    } = {}) {
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

ResonposeDataAdmin.ResponseDataAdmin = ResonposeDataAdmin;

/**
 * Helper to perform redirect with standardized feedback toast parameters
 */
const redirectWithToast = (res, url, { toast, status = 'success', msg = '' }) => {
    const params = new URLSearchParams();
    if (toast) params.set('toast', toast);
    if (status) params.set('status', status);
    if (msg) params.set('msg', msg);
    const queryString = params.toString();
    const targetUrl = queryString ? `${url}${url.includes('?') ? '&' : '?'}${queryString}` : url;
    return res.redirect(targetUrl);
};

module.exports = {
    // Post Management
    home: async (req, res) => {
        try {
            const { page = 1 } = req.params;
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
            return res.redirect('/admin/login');
        } catch (error) {
            console.error("Error in admin home controller:", error);
            return res.redirect('/admin/login');
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
                console.error('Error loading tags in addPost:', error);
                return redirectWithToast(res, '/admin', {
                    toast: 'error',
                    status: 'error',
                    msg: 'Failed to load tags'
                });
            }
        }

        try {
            const { title, content, summary, status, topic, tag, thumbnail } = req.body;

            // Server-Side Independent Validation
            if (!title || typeof title !== 'string' || title.trim().length < 5 || title.trim().length > 200) {
                return redirectWithToast(res, '/admin/add-post', {
                    toast: 'error',
                    status: 'error',
                    msg: 'Title must be between 5 and 200 characters'
                });
            }

            const cleanContent = content ? content.replace(/<[^>]*>/g, '').trim() : '';
            if (!content || cleanContent.length < 10) {
                return redirectWithToast(res, '/admin/add-post', {
                    toast: 'error',
                    status: 'error',
                    msg: 'Content must be at least 10 characters'
                });
            }

            if (summary && summary.trim().length > 500) {
                return redirectWithToast(res, '/admin/add-post', {
                    toast: 'error',
                    status: 'error',
                    msg: 'Summary cannot exceed 500 characters'
                });
            }

            const normalizedTag = tag ? (Array.isArray(tag) ? tag.join(',') : tag.toString()) : '';
            const normalizedStatus = status === '0' || status === 0 ? '0' : '1';

            const add = await _BLOG_CON.Func_Create_Post({
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
                return redirectWithToast(res, '/admin', {
                    toast: 'post_created',
                    status: 'success'
                });
            } else {
                return redirectWithToast(res, '/admin/add-post', {
                    toast: 'error',
                    status: 'error',
                    msg: 'Failed to create post'
                });
            }
        } catch (error) {
            console.error('Error in addPost controller:', error);
            return redirectWithToast(res, '/admin/add-post', {
                toast: 'error',
                status: 'error',
                msg: 'Server error creating post'
            });
        }
    },

    pageEdit: async (req, res) => {
        const { id } = req.params;
        try {
            const [post, tags] = await Promise.all([
                _BLOG_CON.Func_Get_Post_By_Id(id),
                _TAG_CON.Func_Get_ALl_Tag()
            ]);

            if (post) {
                return res.render('edit-post.ejs',
                    new ResonposeDataAdmin({
                        blogs: post,
                        tags,
                        title: 'Edit Blog Page',
                        layout: 'admin-layout'
                    }));
            }
            return redirectWithToast(res, '/admin', {
                toast: 'error',
                status: 'error',
                msg: 'Post not found'
            });
        } catch (error) {
            console.error('Error in pageEdit controller:', error);
            return redirectWithToast(res, '/admin', {
                toast: 'error',
                status: 'error',
                msg: 'Invalid post id'
            });
        }
    },

    updatePost: async (req, res) => {
        const { id } = req.query;
        if (!id) {
            return redirectWithToast(res, '/admin', {
                toast: 'error',
                status: 'error',
                msg: 'Missing post id'
            });
        }

        try {
            const { title, content, summary, status, topic, tag, thumbnail } = req.body;

            // Server-Side Independent Validation
            if (!title || typeof title !== 'string' || title.trim().length < 5 || title.trim().length > 200) {
                return redirectWithToast(res, `/admin/edit-post/${id}`, {
                    toast: 'error',
                    status: 'error',
                    msg: 'Title must be between 5 and 200 characters'
                });
            }

            const cleanContent = content ? content.replace(/<[^>]*>/g, '').trim() : '';
            if (!content || cleanContent.length < 10) {
                return redirectWithToast(res, `/admin/edit-post/${id}`, {
                    toast: 'error',
                    status: 'error',
                    msg: 'Content must be at least 10 characters'
                });
            }

            if (summary && summary.trim().length > 500) {
                return redirectWithToast(res, `/admin/edit-post/${id}`, {
                    toast: 'error',
                    status: 'error',
                    msg: 'Summary cannot exceed 500 characters'
                });
            }

            const normalizedTag = tag ? (Array.isArray(tag) ? tag.join(',') : tag.toString()) : '';
            const normalizedStatus = status === '0' || status === 0 ? '0' : '1';

            const update = await _BLOG_CON.Func_Update_Post_By_Id(id, {
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
                return redirectWithToast(res, '/admin', {
                    toast: 'post_updated',
                    status: 'success'
                });
            } else {
                return redirectWithToast(res, `/admin/edit-post/${id}`, {
                    toast: 'error',
                    status: 'error',
                    msg: 'Failed to update post'
                });
            }
        } catch (error) {
            console.error('Error in updatePost controller:', error);
            return redirectWithToast(res, `/admin/edit-post/${id}`, {
                toast: 'error',
                status: 'error',
                msg: 'Server error updating post'
            });
        }
    },

    deletePost: async (req, res) => {
        const { id } = req.query;
        if (!id) {
            return redirectWithToast(res, '/admin', {
                toast: 'error',
                status: 'error',
                msg: 'Missing post id'
            });
        }

        try {
            const post = await _BLOG_CON.Func_Get_Post_By_Id(id);
            if (!post) {
                return redirectWithToast(res, '/admin', {
                    toast: 'error',
                    status: 'error',
                    msg: 'Post not found'
                });
            }

            const deletePost = await _BLOG_CON.Func_Delete_Post_By_Id(id);
            if (deletePost) {
                if (post.tag) {
                    const tagList = post.tag.split(',').map(t => t.trim()).filter(Boolean);
                    if (tagList.length > 0) {
                        await _TAG_CON.Func_Decrement_Quantity({ name: { "$in": tagList } });
                    }
                }
                return redirectWithToast(res, '/admin', {
                    toast: 'post_deleted',
                    status: 'success'
                });
            } else {
                return redirectWithToast(res, '/admin', {
                    toast: 'error',
                    status: 'error',
                    msg: 'Failed to delete post'
                });
            }
        } catch (error) {
            console.error('Error in deletePost controller:', error);
            return redirectWithToast(res, '/admin', {
                toast: 'error',
                status: 'error',
                msg: 'Server error deleting post'
            });
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
                return redirectWithToast(res, '/admin/login', {
                    toast: 'login_failed',
                    status: 'error'
                });
            }

            const login = await _USER_CON.FUNC_LOGIN({
                username: username.trim(),
                password
            });

            if (login) {
                req.session.account = {
                    loggedin: true,
                    username: username.trim(),
                    avatar: login.avatar
                };
                return res.redirect('/admin');
            } else {
                return redirectWithToast(res, '/admin/login', {
                    toast: 'login_failed',
                    status: 'error'
                });
            }
        } catch (error) {
            console.error("Error in login controller:", error);
            return redirectWithToast(res, '/admin/login', {
                toast: 'error',
                status: 'error',
                msg: 'Login error'
            });
        }
    },

    logout: async (req, res) => {
        req.session.account = {
            loggedin: false,
            username: null
        };
        return res.redirect('/admin/login');
    },

    // Tag Management
    pageTag: async (req, res) => {
        try {
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
        } catch (error) {
            console.error("Error in pageTag controller:", error);
            return res.redirect('/admin/login');
        }
    },

    addTag: async (req, res) => {
        if (req.method === "GET") {
            return res.render('add-tag.ejs', new ResonposeDataAdmin({ title: 'Add Tag Page', layout: 'admin-layout' }));
        }

        try {
            const { name, prioritize } = req.body;
            if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 50) {
                return redirectWithToast(res, '/admin/add-tag', {
                    toast: 'error',
                    status: 'error',
                    msg: 'Tag name must be between 2 and 50 characters'
                });
            }

            const tagName = name.trim();
            // Check if tag already exists in MongoDB
            const allTags = await _TAG_CON.Func_Get_ALl_Tag();
            const exists = allTags.some(t => t.name.toLowerCase() === tagName.toLowerCase());
            if (exists) {
                return redirectWithToast(res, '/admin/add-tag', {
                    toast: 'error',
                    status: 'error',
                    msg: 'Tag name already exists'
                });
            }

            const normalizedPriority = prioritize === '1' || prioritize === 1 ? 1 : 0;
            const add = await _TAG_CON.Func_Create_Tag({
                name: tagName,
                prioritize: normalizedPriority
            });

            if (add) {
                return redirectWithToast(res, '/admin/tag', {
                    toast: 'tag_created',
                    status: 'success'
                });
            } else {
                return redirectWithToast(res, '/admin/add-tag', {
                    toast: 'error',
                    status: 'error',
                    msg: 'Failed to create tag'
                });
            }
        } catch (error) {
            console.error('Error in addTag controller:', error);
            return redirectWithToast(res, '/admin/add-tag', {
                toast: 'error',
                status: 'error',
                msg: 'Server error creating tag'
            });
        }
    },

    pageEditTag: async (req, res) => {
        const { id } = req.params;
        try {
            const post = await _TAG_CON.Func_Get_Tag_By_Id(id);
            if (post) {
                return res.render('edit-tag.ejs', new ResonposeDataAdmin({ blogs: post, title: 'Edit Tag Page', layout: 'admin-layout' }));
            }
            return redirectWithToast(res, '/admin/tag', {
                toast: 'error',
                status: 'error',
                msg: 'Tag not found'
            });
        } catch (error) {
            console.error('Error in pageEditTag controller:', error);
            return redirectWithToast(res, '/admin/tag', {
                toast: 'error',
                status: 'error',
                msg: 'Invalid tag id'
            });
        }
    },

    updateTag: async (req, res) => {
        const { id } = req.query;
        if (!id) {
            return redirectWithToast(res, '/admin/tag', {
                toast: 'error',
                status: 'error',
                msg: 'Missing tag id'
            });
        }

        try {
            const { name, prioritize } = req.body;
            if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 50) {
                return redirectWithToast(res, `/admin/edit-tag/${id}`, {
                    toast: 'error',
                    status: 'error',
                    msg: 'Tag name must be between 2 and 50 characters'
                });
            }

            const tagName = name.trim();
            // Check duplicate tag excluding current id
            const allTags = await _TAG_CON.Func_Get_ALl_Tag();
            const exists = allTags.some(t => t._id.toString() !== id.toString() && t.name.toLowerCase() === tagName.toLowerCase());
            if (exists) {
                return redirectWithToast(res, `/admin/edit-tag/${id}`, {
                    toast: 'error',
                    status: 'error',
                    msg: 'Tag name already exists'
                });
            }

            const normalizedPriority = prioritize === '1' || prioritize === 1 ? 1 : 0;
            const update = await _TAG_CON.Func_Update_Tag_By_Query({ _id: id }, {
                name: tagName,
                prioritize: normalizedPriority
            });

            if (update) {
                return redirectWithToast(res, '/admin/tag', {
                    toast: 'tag_updated',
                    status: 'success'
                });
            } else {
                return redirectWithToast(res, `/admin/edit-tag/${id}`, {
                    toast: 'error',
                    status: 'error',
                    msg: 'Failed to update tag'
                });
            }
        } catch (error) {
            console.error('Error in updateTag controller:', error);
            return redirectWithToast(res, `/admin/edit-tag/${id}`, {
                toast: 'error',
                status: 'error',
                msg: 'Server error updating tag'
            });
        }
    },

    deleteTag: async (req, res) => {
        const { id } = req.query;
        if (!id) {
            return redirectWithToast(res, '/admin/tag', {
                toast: 'error',
                status: 'error',
                msg: 'Missing tag id'
            });
        }

        try {
            const deleteTag = await _TAG_CON.Func_Delete_Post_By_Id(id);
            if (deleteTag) {
                return redirectWithToast(res, '/admin/tag', {
                    toast: 'tag_deleted',
                    status: 'success'
                });
            } else {
                return redirectWithToast(res, '/admin/tag', {
                    toast: 'error',
                    status: 'error',
                    msg: 'Failed to delete tag'
                });
            }
        } catch (error) {
            console.error('Error in deleteTag controller:', error);
            return redirectWithToast(res, '/admin/tag', {
                toast: 'error',
                status: 'error',
                msg: 'Server error deleting tag'
            });
        }
    },

    // CMS Components Management
    components: async (req, res) => {
        const { name } = req.params;
        if (req.method === "GET") {
            try {
                const getFn = _COMP_CON['Func_Get_Data_Component_' + name];
                if (!getFn) {
                    return redirectWithToast(res, '/admin', {
                        toast: 'error',
                        status: 'error',
                        msg: 'Component not found'
                    });
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
                console.error('Error loading component:', error);
                return redirectWithToast(res, '/admin', {
                    toast: 'error',
                    status: 'error',
                    msg: 'Failed to load component'
                });
            }
        }

        try {
            const updateFn = _COMP_CON['Func_Update_Data_Component_' + name];
            if (!updateFn) {
                return redirectWithToast(res, '/admin', {
                    toast: 'error',
                    status: 'error',
                    msg: 'Component update handler not found'
                });
            }
            await updateFn(req.body, () => {
                return redirectWithToast(res, '/admin/components/' + name, {
                    toast: 'widget_updated',
                    status: 'success'
                });
            });
        } catch (error) {
            console.error('Error updating component:', error);
            return redirectWithToast(res, '/admin/components/' + name, {
                toast: 'error',
                status: 'error',
                msg: 'Failed to update widget'
            });
        }
    },

    // Media Upload
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
            console.error("Error in viewUpload controller:", error);
            return res.redirect('/admin');
        }
    },

    // JSON API
    getAllJsonData: async (req, res) => {
        try {
            return res.status(200).json({
                data: dataApis,
                succes: true,
                success: true
            });
        } catch (error) {
            console.error("Error in getAllJsonData controller:", error);
            return res.status(500).json({
                succes: false,
                success: false,
                message: "Failed to retrieve API data"
            });
        }
    }
};
