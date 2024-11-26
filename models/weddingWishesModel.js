'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const weddingWishes = new Schema({
    name: [{
        type: String,
        required: true
    }],
    message: { type: String, required: true},
}, 
{ collection: 'wedding-wishes', timestamps: true })

weddingWishes.index({ name: 1}) //Nơi đánh index
module.exports = mongoose.model('wedding-wishes', weddingWishes)