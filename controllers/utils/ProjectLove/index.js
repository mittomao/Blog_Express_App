'use strict';

const _PROJECT_LOVE_CON = require('../../projectLoveController');
const ResonposeDataClient = require('../../ResonposeDataClient');

const viewFormProjectLove = async (req, res, name) => {
    try {
        return res.render("projects/form-project-love.ejs",
            new ResonposeDataClient({
                fullLayout: false,
                title: `${name} - Love Project`,
                layout: "home-layout",
                isAdmin: false,
                errorMessage: res.errorMessage || null,
            }));
    } catch (error) {
        console.error("Error viewing project love form:", error);
        return res.redirect('/page-404');
    }
};

const createProjectLove = async (req, res, name) => {
    try {
        const { texts, color, music, time } = req.body;
        if (!texts || texts.length === 0) {
            return res.redirect(`/projects/${name}`);
        }

        const loveTexts = texts;
        const imageUrls = req.files ? req.files.map(file => file.path).join(',') : '';

        const id = await _PROJECT_LOVE_CON.Func_Create_Project_Love({
            project: name,
            texts: loveTexts,
            images: imageUrls,
            color,
            music,
            time
        });

        return res.redirect(`/projects/form/?project=${name}&id=${id}`);
    } catch (error) {
        console.error("Error creating project love:", error);
        return res.redirect('/page-404');
    }
};

const previewProjectLove = async (req, res, title, filename) => {
    try {
        const { id } = req.query;

        if (!id) {
            return res.status(400).send('Thiếu tham số id');
        }

        const doc = await _PROJECT_LOVE_CON.Func_Get_Project_Love_By_Id(id);

        if (!doc) {
            return res.status(404).send('Không tìm thấy dữ liệu');
        }

        return res.render(filename,
            new ResonposeDataClient({
                fullLayout: false,
                title: title,
                layout: "default-layout",
                isAdmin: false,
                qrTexts: doc.texts,
                projectImages: doc.images,
                textColor: doc.color,
                music: doc.music,
                time: doc.time,
            }));
    } catch (error) {
        console.error("Error previewing project love:", error);
        return res.redirect('/page-404');
    }
};

module.exports = {
    viewFormProjectLove,
    createProjectLove,
    previewProjectLove,
};

