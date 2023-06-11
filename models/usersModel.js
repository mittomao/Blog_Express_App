'use strict';
/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const users = new Schema({
    username: { type: String, default: ''},
    password: { type: String, default: ''},
    email: { type: String, default: ''},
    phone: { type: String, default: ''},
    avatar: { type: String, default: ''},
    // status: { type: String, default: 'noactive'},
    // type_regis: { type: String, default: 'WE'},
}, 
{ collection: 'users', timestamps: true })

users.index({ email: 1}) //Nơi đánh index
module.exports = mongoose.model('users', users)