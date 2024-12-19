const express = require('express');
const path = require('path');
const securityMiddleware = require('./middleware/security');

const app = express();

// 应用安全中间件
securityMiddleware(app);

// 静态文件服务
app.use(express.static(path.join(__dirname, '../frontend'), {
    setHeaders: (res, path) => {
        if (path.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache');
        }
    }
}));

// 模板引擎设置
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../frontend'));

// 路由处理
app.get('/', (req, res) => {
    res.render('index', {
        VERSION: process.env.npm_package_version || Date.now()
    });
});