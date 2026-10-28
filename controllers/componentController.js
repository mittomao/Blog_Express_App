'use strict';

const newsletterModel = require('../models/newsletterModel');
const popularArticlesModel = require('../models/popularArticlesModel');
const portfolioModel = require('../models/portfolioModel');
const aboutAuthorModel = require('../models/aboutAuthorModel');

/**
 * Helper to update a singleton component with upsert
 */
const updateSingletonComponent = async (model, updateData, componentName, callback) => {
    try {
        const result = await model.findOneAndUpdate(
            {},
            updateData,
            { upsert: true, new: true, runValidators: true }
        );
        if (typeof callback === 'function') {
            callback(result);
        }
        return result;
    } catch (err) {
        console.error(`Func_Update_Data_Component_${componentName}: `, err);
        if (typeof callback === 'function') {
            callback(null);
        }
        throw err;
    }
};

module.exports = {
    // Component newsletter
    Func_Get_Data_Component_newsletter: async () => {
        return newsletterModel.find();
    },
    Func_Update_Data_Component_newsletter: async (params, callback) => {
        return updateSingletonComponent(
            newsletterModel,
            {
                title: params.title,
                description: params.description,
                bgimage: params.bgimage
            },
            'newsletter',
            callback
        );
    },

    // Component popular_articles
    Func_Get_Data_Component_popular_articles: async () => {
        return popularArticlesModel.find();
    },
    Func_Update_Data_Component_popular_articles: async (params, callback) => {
        return updateSingletonComponent(
            popularArticlesModel,
            {
                title: params.title,
                description: params.description,
                image: params.image,
                author: params.author,
                link: params.link
            },
            'popularArticlesModel',
            callback
        );
    },

    // Component portfolio
    Func_Get_Data_Component_portfolio: async () => {
        return portfolioModel.find();
    },
    Func_Update_Data_Component_portfolio: async (params, callback) => {
        return updateSingletonComponent(
            portfolioModel,
            {
                name: params.name,
                avatar: params.avatar,
                description: params.description,
                linkcv: params.linkcv
            },
            'portfolio',
            callback
        );
    },

    // Component About Author
    Func_Get_Data_Component_about_author: async () => {
        return aboutAuthorModel.find();
    },
    Func_Update_Data_Component_about_author: async (params, callback) => {
        return updateSingletonComponent(
            aboutAuthorModel,
            {
                name: params.name,
                description: params.description
            },
            'about_author',
            callback
        );
    }
};
