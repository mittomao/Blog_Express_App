'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const aboutAuthorSchema = new Schema({
    name: { type: String, default: ''},
    description: { type: String, default: ''},
}, 
{ collection: 'about-author', timestamps: true })

module.exports = mongoose.model('about-author', aboutAuthorSchema)