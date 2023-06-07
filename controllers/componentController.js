const newsletterModel = require('../models/newsletterModel');
const popularArticlesModel = require('../models/popularArticlesModel');

module.exports = {
    Func_Get_Data_Component_newsletter: async () => {
        return newsletterModel.find();
    },
    Func_Update_Data_Component_newsletter: async (params, callback) => {
        newsletterModel.findOneAndUpdate(
            {},
            {
                title: params.title,
                description: params.description
            },
            {upsert: true, new: true, runValidators: true},
            function (err, result) { // callback
                if (err) {
                    console.error('Func_Update_Data_Component_newsletter: ', err);
                } else {
                    callback(result)
                }
            }
        );
    }
}