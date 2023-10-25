const newsletterModel = require('../models/newsletterModel');
const popularArticlesModel = require('../models/popularArticlesModel');
const portfolioModel = require('../models/portfolioModel');
const aboutAuthorModel = require('../models/aboutAuthorModel');

module.exports = {
    // Component newsletter
    Func_Get_Data_Component_newsletter: async () => {
        return newsletterModel.find();
    },
    Func_Update_Data_Component_newsletter: async (params, callback) => {
        newsletterModel.findOneAndUpdate(
            {},
            {
                title: params.title,
                description: params.description,
                bgimage: params.bgimage
            },
            {upsert: true, new: true, runValidators: true},
            function (err, result) {
                if (err) {
                    console.error('Func_Update_Data_Component_newsletter: ', err);
                } else {
                    callback(result)
                }
            }
        );
    },
    // Component popular_articles
    Func_Get_Data_Component_popular_articles: async () => {
        return popularArticlesModel.find();
    },
    Func_Update_Data_Component_popular_articles: async (params, callback) => {
        popularArticlesModel.findOneAndUpdate(
            {},
            {
                title: params.title,
                description: params.description,
                image: params.image,
                author: params.author,
                link: params.link,
            },
            {upsert: true, new: true, runValidators: true},
            function (err, result) {
                if (err) {
                    console.error('Func_Update_Data_Component_popularArticlesModel: ', err);
                } else {
                    callback(result)
                }
            }
        );
    },
    // Component portfolio
    Func_Get_Data_Component_portfolio: async () => {
        return portfolioModel.find();
    },
    Func_Update_Data_Component_portfolio: async (params, callback) => {
        portfolioModel.findOneAndUpdate(
            {},
            {
                name: params.name,
                avatar: params.avatar,
                description: params.description,
                linkcv: params.linkcv,
            },
            {upsert: true, new: true, runValidators: true},
            function (err, result) {
                if (err) {
                    console.error('Func_Update_Data_Component_portfolio: ', err);
                } else {
                    callback(result)
                }
            }
        );
    },
    // Component About Author
    Func_Get_Data_Component_about_author: async () => {
        return aboutAuthorModel.find();
    },
    Func_Update_Data_Component_about_author: async (params, callback) => {
        aboutAuthorModel.findOneAndUpdate(
            {},
            {
                name: params.name,
                description: params.description,
            },
            {upsert: true, new: true, runValidators: true},
            function (err, result) {
                if (err) {
                    console.error('Func_Update_Data_Component_about_author: ', err);
                } else {
                    callback(result)
                }
            }
        );
    },
}