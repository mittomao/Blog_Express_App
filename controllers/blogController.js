const blogModel = require('../models/blogModel');

module.exports = {
    // Get Post
    Func_Get_ALl_Post: async (p) => {
        let perPage = parseInt(process.env.PER_PAGE);
        let page = p;
        const count = await blogModel.find();
        const response = await blogModel.find()
            .limit(perPage)
            .skip((perPage * page) - perPage)
            .sort({ createdAt: -1 })

        let totalCount = 1;
        if (count.length > perPage) {
            totalCount = Math.ceil(count.length / perPage)
        }
        return {
            posts: response,
            current: page,
            allItems: count.length,
            totalPage: totalCount
        }
    },
    Func_Get_Post_By_Id: async (id) => {
        return await blogModel.findById(id);
    },
    Func_Get_Post_By_Search: async (p, name, value) => {
        let perPage = parseInt(process.env.PER_PAGE);
        let page = p;
        const count = await blogModel.find();
        const response = await blogModel.find({
                [name]: { "$regex": value, "$options": "i" }
             })
            .limit(perPage)
            .skip((perPage * page) - perPage)
            .sort({ createdAt: -1 })

        let totalCount = 1;
        if (response.length >= perPage) {
            totalCount = Math.ceil(count.length / perPage)
        } 
        return {
            posts: response,
            current: page,
            totalPage: totalCount
        }
    },
    Func_Random_Post: async (callback, id) => {
        await blogModel.findRandom({
            _id: { $ne: id }
        }, {}, { limit: 2 }, function (err, res) {
            if (!err) {
                callback(res, id)
            }
        });
    },
    // Action
    Func_Create_Post: async (obj) => {
        const { author, tag, title, summary, thumbnail, content, status } = obj;
        return await blogModel.create({
            author,
            tag,
            title,
            summary,
            thumbnail,
            content,
            status
        });
    },
    Func_Update_Post_By_Id: async (id, params) => {
        return await blogModel.findByIdAndUpdate({
            _id: id
        }, {
            ...params
        });
    },
    Func_Delete_Post_By_Id: async (id) => {
        return await blogModel.findByIdAndDelete(id);
    }
}