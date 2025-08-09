'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectLove = new Schema({
    project: {
        type: String,
        required: true
    },
    texts: [{
        type: String,
        required: true
    }],
    images: [{
        type: String,
        required: false
    }],
    color: {
        type: String,
        required: false
    },
    music: {
        type: String,
        required: false
    },
    time: {
        type: Date,
        required: false
    },
}, {
    collection: 'project-love',
    timestamps: true
})

projectLove.index({ texts: 1 }) //Nơi đánh index
module.exports = mongoose.model('project-love', projectLove)