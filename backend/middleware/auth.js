const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
    try {
        // 获取token
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                message: '请先登录'
            });
        }

        // 验证token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 查找用户
        const user = await User.findById(decoded.id);
        if (!user) {
            throw new Error();
        }

        // 将用户信息添加到请求对象
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({
            message: '认证失败'
        });
    }
}; 