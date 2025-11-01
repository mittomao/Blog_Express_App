const blogModel = require('../models/blogModel');

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
    Func_Get_Random_Hint_Title: async () => {
        // Lấy 3 bài viết random có title
        const titleDocs = await blogModel.aggregate([
            { $match: { title: { $exists: true, $ne: "" } } },
            { $sample: { size: 3 } },
            { $project: { _id: 0, value: "$title", type: { $literal: "title" } } }
        ]);

        // Lấy ngẫu nhiên tag
        const tagDocs = await blogModel.aggregate([
            {
                $match: {
                    $or: [
                        { tag: { $type: "array", $ne: [] } },
                        { tag: { $type: "string", $ne: "" } }
                    ]
                }
            },
            { $sample: { size: 2 } },
            {
                $project: {
                    _id: 0,
                    value: {
                        $cond: [
                            { $isArray: "$tag" },
                            {
                                $arrayElemAt: [
                                    "$tag",
                                    { $floor: { $multiply: [{ $rand: {} }, { $size: "$tag" }] } }
                                ]
                            },
                            "$tag"
                        ]
                    },
                    type: { $literal: "tag" }
                }
            }
        ]);

        // Gộp 2 mảng lại và shuffle thêm 1 lần cho ngẫu nhiên hoàn toàn
        const mixed = [...titleDocs, ...tagDocs]
            .sort(() => Math.random() - 0.5)
            .map(x => x.value);
        return mixed;
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
    }
};