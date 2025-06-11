const blogModel = require('../models/blogModel');
const tagsModel = require('../models/tagsModel');
const qrLoveModel = require('../models/qrLoveModel');
const fireworkLoveModel = require('../models/fireworkLoveModel');

module.exports = {
    // Get Post
    Func_Get_ALl_Post: async (p, query = {}) => {
        let perPage = parseInt(process.env.PER_PAGE);
        let page = p;
        const count = await blogModel.find(query);
        const response = await blogModel.find(query)
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
        const { author, tag, title, topic, summary, thumbnail, content, status } = obj;
        return await blogModel.create({
            author,
            tag,
            title,
            topic,
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
    },
    Func_Get_Unique_By_Field: async (fieldName) => {
        return await blogModel.distinct(fieldName, {
            $and: [
                { [fieldName]: { $ne: null } },
                { [fieldName]: { $ne: "" } }
            ]
        });
    },
    // QR Code Love
    Func_Create_QR_LOVE: async (obj) => {
        const { texts, images } = obj;
        const newQR = await qrLoveModel.create({ texts, images });
        return newQR._id;
    },
    Func_Get_QR_By_Id: async (id) => {
        return await qrLoveModel.findById(id);
    },
    // Firework Love
    Func_Create_Firework_LOVE: async (obj) => {
        const { texts, images, music } = obj;
        const newFirework = await fireworkLoveModel.create({ texts, images, music });
        return newFirework._id;
    },
    Func_Get_Firework_By_Id: async (id) => {
        return await fireworkLoveModel.findById(id);
    },
}