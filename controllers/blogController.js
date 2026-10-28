'use strict';

const blogModel = require('../models/blogModel');

const blogController = {
    /**
     * Get paginated posts by query filter
     */
    Func_Get_ALl_Post: async (p, query = {}) => {
        const perPage = parseInt(process.env.PER_PAGE, 10) || 6;
        const page = Math.max(1, parseInt(p, 10) || 1);

        // Fetch total count and paginated posts in parallel using countDocuments
        const [totalItems, posts] = await Promise.all([
            blogModel.countDocuments(query),
            blogModel.find(query)
                .limit(perPage)
                .skip((perPage * page) - perPage)
                .sort({ createdAt: -1 })
        ]);

        const totalPage = totalItems > perPage ? Math.ceil(totalItems / perPage) : 1;

        return {
            posts,
            current: page,
            allItems: totalItems,
            totalPage
        };
    },

    /**
     * Retrieve single post by ID
     */
    Func_Get_Post_By_Id: async (id) => {
        return blogModel.findById(id);
    },

    /**
     * Find 2 random posts excluding current post ID
     */
    Func_Random_Post: async (callback, id) => {
        await blogModel.findRandom({
            _id: { $ne: id }
        }, {}, { limit: 2 }, function (err, res) {
            if (!err && typeof callback === 'function') {
                callback(res, id);
            }
        });
    },

    /**
     * Retrieve mixed random hints from titles and tags for search hints
     */
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

    /**
     * Create new blog post
     */
    Func_Create_Post: async (obj) => {
        const { author, tag, title, topic, summary, thumbnail, content, status } = obj;
        return blogModel.create({
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

    /**
     * Update post by ID
     */
    Func_Update_Post_By_Id: async (id, params) => {
        return blogModel.findByIdAndUpdate(id, { ...params }, { new: true });
    },

    /**
     * Delete post by ID
     */
    Func_Delete_Post_By_Id: async (id) => {
        return blogModel.findByIdAndDelete(id);
    },

    /**
     * Get distinct unique non-empty values for a given field
     */
    Func_Get_Unique_By_Field: async (fieldName) => {
        return blogModel.distinct(fieldName, {
            $and: [
                { [fieldName]: { $ne: null } },
                { [fieldName]: { $ne: "" } }
            ]
        });
    }
};

// Aliases for naming convention consistency
blogController.Func_Get_All_Post = blogController.Func_Get_ALl_Post;

module.exports = blogController;
