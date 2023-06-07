'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const popularArticles = new Schema({
    title: [{
        type: String,
        default: ''
    }],
    description: { type: String, default: ''},
}, 
{ collection: 'popular-articles', timestamps: true })

module.exports = mongoose.model('popular-articles', popularArticles)