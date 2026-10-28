'use strict';

const tagModel = require('../models/tagsModel');

const tagController = {
    Func_Get_ALl_Tag: async () => {
        return tagModel.find();
    },

    Func_Create_Tag: async (obj) => {
        const { name, prioritize } = obj;
        return tagModel.create({
            name,
            prioritize
        });
    },

    Func_Get_Tag_By_Id: async (id) => {
        return tagModel.findById(id);
    },

    Func_Update_Tag_By_Query: async (query, params) => {
        return tagModel.findByIdAndUpdate(query, {
            ...params
        }, { new: true });
    },

    Func_Increment_Quantity: async (query) => {
        return tagModel.updateMany(query, { $inc: { quantity: 1 } }).exec();
    },

    /**
     * Decrement tag quantity while ensuring quantity does not drop below 0
     */
    Func_Decrement_Quantity: async (query) => {
        const safeQuery = { ...query, quantity: { $gt: 0 } };
        return tagModel.updateMany(safeQuery, { $inc: { quantity: -1 } }).exec();
    },

    /**
     * Delete tag by ID (named Func_Delete_Post_By_Id for backward compatibility)
     */
    Func_Delete_Post_By_Id: async (id) => {
        return tagModel.findByIdAndDelete(id);
    }
};

// Aliases for naming convention consistency
tagController.Func_Get_All_Tag = tagController.Func_Get_ALl_Tag;
tagController.Func_Delete_Tag_By_Id = tagController.Func_Delete_Post_By_Id;

module.exports = tagController;
