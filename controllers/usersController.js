'use strict';

const userModel = require('../models/usersModel');

module.exports = {
    FUNC_REGISTER_USER: async (obj) => {
        return userModel.create(obj);
    },
    FUNC_LOGIN: async (obj) => {
        return userModel.findOne({
            username: obj.username,
            password: obj.password
        });
    }
};
