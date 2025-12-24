'use strict';
const express = require('express')
const multer = require('multer')
const clientController = require('../controllers/clientController')
const { upload } = require('../utils/cloudinary')

const clientRouter = express.Router();
clientRouter.get('/', clientController.home)
clientRouter.get('/p/:page', clientController.home)
clientRouter.get('/portfolio', clientController.portfolio)
clientRouter.get('/post/:id', clientController.detailPost)
clientRouter.get('/tag/:tag', clientController.tag)
clientRouter.get('/life', clientController.life)
clientRouter.get('/about', clientController.about)
clientRouter.get('/contact', clientController.contact)
clientRouter.post('/search/:title', clientController.search)
clientRouter.get('/topic/:title', clientController.filterTopic)
// Router Project
clientRouter.get('/projects/form', clientController.viewFormProjectLove)

// Tree Story Love Project
clientRouter.post('/projects/tree-story', upload.array('images', 10), clientController.createProjectTreeStory)
clientRouter.get('/projects/tree-story/preview', clientController.projectTreeStoryPreview)

// Tree Story Love Project
//clientRouter.post('/projects/merry-christmas', upload.array('images', 10), clientController.createProjectMerryChristmas)//
clientRouter.post('/projects/merry-christmas', (req, res) => {
  upload.array('images', 10)(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // Lỗi từ Multer
      if (err.code === 'LIMIT_FILE_SIZE') {
        // return res.status(400).render('projects/form/?project=merry-christmas', {
        //     errorMessage: 'File quá lớn (tối đa 1MB). Vui lòng tải lại trang và Chọn ảnh có size nhỏ hơn',
        //     oldData: req.body
        // });
        return res.status(400).json({
          message: 'File quá lớn (tối đa 1MB). Vui lòng quay lại trang trước và chọn ảnh có size nhỏ hơn'
        });
      }

      if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({
          message: 'Bạn Chỉ Có Thể Upload Tối đa 10 ảnh. Vui lòng quay lại trang trước và chọn lại số lượng ảnh'
        });
      }

      return res.status(400).json({
        message: err.message
      });
    }

    if (err) {
      // Lỗi khác (fileFilter, Cloudinary, ...)
      return res.status(400).json({
        message: err.message
      });
    }

    // Không lỗi → tiếp tục controller
    clientController.createProjectMerryChristmas(req, res);
  });
});

clientRouter.get('/projects/merry-christmas/preview', clientController.projectMerryChristmasPreview)

clientRouter.get('/projects/qr-love', clientController.qrLove)
clientRouter.post('/projects/qr-love', upload.array('images', 10), clientController.createQRLove)
clientRouter.get('/projects/qr-love/preview', clientController.qrPreview)

clientRouter.get('/projects/firework-love', clientController.fireworkLove)
clientRouter.post('/projects/firework-love', upload.array('images', 10),clientController.createFireworkLove)
clientRouter.get('/projects/firework-love/preview', clientController.fireworkPreview)
// End Router Project
clientRouter.get('/page-404', clientController.pageNotFound)
clientRouter.get('*', (req, res) => res.redirect('/page-404'))

module.exports = clientRouter;