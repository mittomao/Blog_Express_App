'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newsletterSchema = new Schema({
    title: { type: String, default: ''},
    description: { type: String, default: ''},
}, 
{ collection: 'newsletter', timestamps: true })

module.exports = mongoose.model('newsletter', newsletterSchema)