'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const qrLove = new Schema({
    texts: [{
        type: String,
        required: true
    }],
}, 
{ collection: 'qr-love', timestamps: true })

qrLove.index({ texts: 1}) //Nơi đánh index
module.exports = mongoose.model('qr-love', qrLove)