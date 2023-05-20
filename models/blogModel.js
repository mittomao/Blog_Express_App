'use strict';
/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    author: { type: String, default: '' },
    title: { type: String, default: '', require },
    content: { type: String, default: '' },
    status: { type: Boolean, default: true }
}, 
{ collection: 'blog', timestamps: true })

module.exports = mongoose.model('blog', blogSchema)