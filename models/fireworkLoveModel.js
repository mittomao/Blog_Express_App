'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fireworkLove = new Schema({
    texts: [{
        type: String,
        required: true
    }],
    images: [{
        type: String,
        required: false
    }],
}, {
    collection: 'firework-love',
    timestamps: true
})

fireworkLove.index({ texts: 1}) //Nơi đánh index
module.exports = mongoose.model('firework-love', fireworkLove)