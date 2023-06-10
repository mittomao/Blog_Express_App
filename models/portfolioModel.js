'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const portfolioSchema = new Schema({
    name: { type: String, default: ''},
    avatar: { type: String, default: ''},
    description: { type: String, default: ''},
    linkcv: { type: String, default: ''},
    project: { type: String, default: ''},
}, 
{ collection: 'portfolio', timestamps: true })

module.exports = mongoose.model('portfolio', portfolioSchema)