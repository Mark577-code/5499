const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// 邮件传输配置
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD // 使用应用专用密码
    }
});

// 生成JWT token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '24h'
    });
};

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // 检查用户是否已存在
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });
        
        if (existingUser) {
            return res.status(400).json({
                message: '用户名或邮箱已被注册'
            });
        }

        // 生成验证token
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // 创建新用户
        const user = new User({
            username,
            email,
            password,
            verificationToken
        });

        await user.save();

        // 发送验证邮件
        const verificationUrl = `http://localhost:3000/verify/${verificationToken}`;
        await transporter.sendMail({
            to: email,
            subject: '验证您的邮箱',
            html: `请点击此链接验证您的邮箱：<a href="${verificationUrl}">${verificationUrl}</a>`
        });

        res.status(201).json({
            message: '注册成功，请查收验证邮件'
        });
    } catch (error) {
        res.status(500).json({
            message: '注册失败',
            error: error.message
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 查找用户
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: '邮箱或密码错误'
            });
        }

        // 验证密码
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                message: '邮箱或密码错误'
            });
        }

        // 检查邮箱是否已验证
        if (!user.isVerified) {
            return res.status(401).json({
                message: '请先验证您的邮箱'
            });
        }

        // 生成token
        const token = generateToken(user._id);

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({
            message: '登录失败',
            error: error.message
        });
    }
};

exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;

        const user = await User.findOne({ verificationToken: token });
        if (!user) {
            return res.status(400).json({
                message: '无效的验证链接'
            });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        res.json({
            message: '邮箱验证成功'
        });
    } catch (error) {
        res.status(500).json({
            message: '验证失败',
            error: error.message
        });
    }
};

// 发送验证码
exports.sendVerificationCode = async (req, res) => {
    try {
        const { email } = req.body;
        
        // 生成6位随机验证码
        const verificationCode = Math.random().toString().slice(-6);
        
        // 存储验证码(实际应用中应该使用Redis等缓存服务)
        // 这里暂时使用内存存储，实际生产环境不建议这样做
        if (!global.verificationCodes) {
            global.verificationCodes = {};
        }
        global.verificationCodes[email] = {
            code: verificationCode,
            timestamp: Date.now()
        };
        
        // 发送邮件
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: '密码重置验证码',
            html: `
                <h2>密码重置验证码</h2>
                <p>您的验证码是: <strong>${verificationCode}</strong></p>
                <p>验证码有效期为5分钟。</p>
                <p>如果这不是您的操作，请忽略此邮件。</p>
            `
        };
        
        await transporter.sendMail(mailOptions);
        
        res.json({ message: '验证码已发送到您的邮箱' });
    } catch (error) {
        console.error('发送验证码失败:', error);
        res.status(500).json({ message: '发送验证码失败，请稍后重试' });
    }
};

// 验证验证码
exports.verifyCode = async (req, res) => {
    try {
        const { email, code } = req.body;
        
        // 获取存储的验证码
        const storedData = global.verificationCodes?.[email];
        if (!storedData) {
            return res.status(400).json({ message: '验证码已过期，请重新获取' });
        }
        
        // 验证码5分钟有效
        if (Date.now() - storedData.timestamp > 300000) {
            delete global.verificationCodes[email];
            return res.status(400).json({ message: '验证码已过期，请重新获取' });
        }
        
        if (storedData.code !== code) {
            return res.status(400).json({ message: '验证码错误' });
        }
        
        // 验证成功后删除验证码
        delete global.verificationCodes[email];
        
        res.json({ message: '验证码验证成功' });
    } catch (error) {
        console.error('验证码验证失败:', error);
        res.status(500).json({ message: '验证失败，请稍后重试' });
    }
};