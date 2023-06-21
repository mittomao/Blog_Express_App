'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const images = new Schema({
    filename: {
        type: String,
        required: true
    },
}, 
{ collection: 'images', timestamps: true })

images.index({ filename: 1}) //Nơi đánh index
module.exports = mongoose.model('images', images)