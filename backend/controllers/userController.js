const User = require('../models/User');
const multer = require('multer');
const path = require('path');

// 配置文件上传
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'frontend/images/avatars/'); // 保存头像的目录
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 2 // 限制2MB
    },
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('只支持上传图片文件(jpeg, jpg, png)'));
    }
}).single('avatar');

// 更新头像
exports.updateAvatar = async (req, res) => {
    upload(req, res, async function (err) {
        if (err) {
            return res.status(400).json({
                message: err.message
            });
        }

        if (!req.file) {
            return res.status(400).json({
                message: '请选择要上传的图片'
            });
        }

        try {
            const avatarPath = `/images/avatars/${req.file.filename}`;
            const user = await User.findByIdAndUpdate(
                req.user._id,
                { avatar: avatarPath },
                { new: true }
            );

            res.json({
                message: '头像更新成功',
                avatar: user.avatar
            });
        } catch (error) {
            res.status(500).json({
                message: '头像更新失败',
                error: error.message
            });
        }
    });
}; 