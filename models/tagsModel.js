'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tags = new Schema({
    name: [{
        type: String,
        required: true
    }],
    quantity: { type: Number, default: 0},
    prioritize: { type: Boolean, default: 0},
}, 
{ collection: 'tags', timestamps: true })

tags.index({ name: 1}) //Nơi đánh index
module.exports = mongoose.model('tags', tags)