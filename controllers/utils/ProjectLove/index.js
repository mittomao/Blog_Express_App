const _PROJECT_LOVE_CON = require('../../projectLoveController');
const ResonposeDataClient = require('../../ResonposeDataClient');

const ViewFormProjectLove = async (req, res, name) => {
    try {
        return res.render("projects/form-project-love.ejs",
            new ResonposeDataClient({
                fullLayout: false,
                title: name + " - Love Project",
                layout: "home-layout",
                isAdmin: false
            }));
    } catch (error) {
        res.redirect('/page-404');
    }
}

const CreateProjectLove = async (req, res, name) => {
    try {
        const { texts, color, music, time } = req.body;
        if (!texts || texts.length === 0) {
            return res.redirect('/projects/' + name);
        }

        var loveTexts = texts;

        const imageUrls = req.files && req.files.map(file => file.path).join(',');

        console.log("loveTexts: ", loveTexts);
        console.log("imageUrls: ", imageUrls);
        console.log("color: ", color);
        console.log("music: ", music);
        console.log("time: ", time);

        var id = await _PROJECT_LOVE_CON.Func_Create_Project_Love({ project: name, texts: loveTexts, images: imageUrls, color, music, time });

        return res.redirect(`/projects/form/?project=${name}&id=${id}`);
    } catch (error) {
        console.error("Error creating project love: ", error);
        res.redirect('/page-404');
    }
}

const PreviewProjectLove = async (req, res, title, filename) => {
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
        console.error("Error previewing project love: ", error);
        // Redirect to 404 page if there's an error
        res.redirect('/page-404');
    }
}

module.exports = {
    viewFormProjectLove: ViewFormProjectLove,
    createProjectLove: CreateProjectLove,
    previewProjectLove: PreviewProjectLove,
}
