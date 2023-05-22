'use strict'
const _CONST = require('../config/constant')
const userModel = require('../models/usersModel')

var self = module.exports = {
    FUNC_REGISTER_USER: async (obj) => {
        //insert vao collection Users
        return userModel.create(obj);
    },
    FUNC_LOGIN: async (obj) => {
        console.log('obj query', obj);
        //insert vao collection Users
        return userModel.findOne({
            username: obj.username,
            password: obj.password
        })
    }
}