const tagModel = require('../models/tagsModel');

module.exports = {
    Func_Get_ALl_Tag: async () => {
        return tagModel.find();
    },
    // Action
    Func_Create_Tag: async (obj) => {
        const { name, quantity, prioritize } = obj;
        return await tagModel.create({
            name,
            quantity,
            prioritize
        });
    },
    Func_Get_Tag_By_Id: async (id) => {
        return await tagModel.findById(id);
    },
    Func_Update_Tag_By_Id: async (id, params) => {
        return await tagModel.findByIdAndUpdate({
            _id: id
        }, {
            ...params
        });
    },
    Func_Delete_Post_By_Id: async (id) => {
        return await tagModel.findByIdAndDelete(id);
    }
}