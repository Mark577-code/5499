const helmet = require('helmet');

module.exports = function(app) {
    // 基本安全头部
    app.use(helmet());

    // 设置 X-Frame-Options
    app.use(helmet.frameguard({ action: 'deny' }));

    // 自定义 CSP
    app.use(helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", 'https://fonts.googleapis.com'],
            fontSrc: ["'self'", 'https://fonts.gstatic.com'],
            imgSrc: ["'self'", 'data:'],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            frameAncestors: ["'none'"]
        }
    }));

    // 缓存控制
    app.use((req, res, next) => {
        if (req.url.match(/\.(css|js|png|jpg|jpeg|gif|ico)$/)) {
            res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1年
            // 添加其他安全头部
            res.setHeader('X-Content-Type-Options', 'nosniff');
            res.setHeader('X-Frame-Options', 'DENY');
            res.setHeader('X-XSS-Protection', '1; mode=block');
        } else {
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        }
        next();
    });

    // 版本控制中间件
    app.use((req, res, next) => {
        res.locals.VERSION = process.env.npm_package_version || Date.now();
        next();
    });
}; 