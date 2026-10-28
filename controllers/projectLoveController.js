'use strict';

const projectLoveModel = require('../models/projectLoveModel');
const qrLoveModel = require('../models/qrLoveModel');
const fireworkLoveModel = require('../models/fireworkLoveModel');

module.exports = {
    // Project Love
    Func_Create_Project_Love: async (obj) => {
        const { project, texts, images, color, music, time } = obj;
        const newProject = await projectLoveModel.create({ project, texts, images, color, music, time });
        return newProject._id;
    },
    Func_Get_Project_Love_By_Id: async (id) => {
        return projectLoveModel.findById(id);
    },

    // QR Code Love
    Func_Create_QR_LOVE: async (obj) => {
        const { texts, images, color, music } = obj;
        const newQR = await qrLoveModel.create({ texts, images, color, music });
        return newQR._id;
    },
    Func_Get_QR_By_Id: async (id) => {
        return qrLoveModel.findById(id);
    },

    // Firework Love
    Func_Create_Firework_LOVE: async (obj) => {
        const { texts, images, music } = obj;
        const newFirework = await fireworkLoveModel.create({ texts, images, music });
        return newFirework._id;
    },
    Func_Get_Firework_By_Id: async (id) => {
        return fireworkLoveModel.findById(id);
    }
};
