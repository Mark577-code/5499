// 确保在文件开头声明所有全局变量
window.templateDatabase = {
    // ... 你的模板数据 ...
};

window.uiText = {
    // ... 你的UI文本数据 ...
};

window.languages = {
    // ... 你的语言配置 ...
};

window.themes = {
    // ... 你的主题配置 ...
};

// 删除 module.exports，改用全局变量
const templates = [
    // 浪漫文艺类
    {
        id: 1,
        category: 'romantic',
        title: '星空告白',
        content: '在这个星星的世界里，对你的感觉越来越深。每当月亮的时候，守候。愿意成为我的唯一吗？'
    },
    {
        id: 2,
        category: 'romantic',
        title: '温柔时光',
        content: '你是我荒芜心田里的一抹芬芳，是我漫长黑夜里的熠熠星辰，是我灵魂深处最温柔的羁绊。我愿用一生的时光，谱写与你有关的情诗。'
    },
    // 幽默风趣类
    {
        id: 3,
        category: 'humor',
        title: '俏皮告白',
        content: '宝，我今天去种地了，种的什么地，对你的死心塌地。我觉得你接近我就是为了害我，害得我好喜欢你。'
    },
    // 简单直接类
    {
        id: 4,
        category: 'simple',
        title: '真诚告白',
        content: '我喜欢你，没有什么特别的理由，就是看到你就开心，想和你在一起，做我的另一半吧。'
    }
];

// 语言配置
const languages = {
    zh: {
        romantic: {
            name: '浪漫文艺',
            description: '用优美的文字表达真挚的爱'
        },
        humor: {
            name: '幽默风趣',
            description: '用俏皮的话语传达甜蜜'
        },
        simple: {
            name: '简单直接',
            description: '用真诚的话语表达心意'
        }
    },
    en: {
        romantic: {
            name: 'Romantic',
            description: 'Express love with beautiful words'
        },
        humor: {
            name: 'Humorous',
            description: 'Share sweetness with witty words'
        },
        simple: {
            name: 'Simple',
            description: 'Express feelings directly'
        }
    },
    ar: {
        romantic: {
            name: 'رومانسي',
            description: 'التعبير عن الحب بكلمات جميلة'
        },
        humor: {
            name: 'فكاهي',
            description: 'مشاركة الحلاوة بكلمات ذكية'
        },
        simple: {
            name: 'بسيط',
            description: 'التعبير عن المشاعر مباشرة'
        }
    }
};

// 更新主题配置
const themes = {
    romantic: {
        name: '浪漫文艺',
        colors: {
            primary: '#ff69b4',
            secondary: '#ff1493',
            background: '#fff0f5'
        },
        icon: '🌹'
    },
    humor: {
        name: '幽默风趣',
        colors: {
            primary: '#ff9933',
            secondary: '#ff6600',
            background: '#fff5e6'
        },
        icon: '😊'
    },
    simple: {
        name: '简单直接',
        colors: {
            primary: '#66ccff',
            secondary: '#3399ff',
            background: '#f0f8ff'
        },
        icon: '💝'
    }
};

// 基础模板结构
const templateStructures = {
    romantic: [
        '就像{keyword}一样，{emotion}。这世界这么大，{action}。{ending}',
        '在这个{keyword}的世界里，{emotion}。每当{scene}的时候，{action}。{ending}',
        '遇见你就像{keyword}，{emotion}。无论{scene}，{action}。{ending}'
    ],
    humor: [
        '如果你是{keyword}，那我就要做{action}。{emotion}，要不要考虑一下接受我呢？',
        '别人都在关注{keyword}，而��只关注你。{emotion}，{action}。做我的{role}好吗？',
        '听说{keyword}很火，但在我眼里，{emotion}。{action}，要不要跟我一起{scene}？'
    ],
    simple: [
        '不需要像{keyword}那样复杂，{emotion}。{action}，这就是我想对你说的。',
        '简单点说，{emotion}。就像{keyword}一样，{action}。{ending}',
        '{emotion}，就是这么简单。不像{keyword}那样复杂，{action}。{ending}'
    ]
};

// 情感词库
const emotions = {
    romantic: [
        '我的心里满满都是你',
        '你就是我的整个世界',
        '对你的感觉越来越深'
    ],
    humor: [
        '你就是我的小确幸',
        '你是我最想要的甜甜圈',
        '你是我的独家记忆'
    ],
    simple: [
        '我真的很喜欢你',
        '你对我来说很特别',
        '我想要好好照顾你'
    ]
};

// 结束语
const endings = {
    romantic: [
        '愿意成为我的唯一吗？',
        '让我们一起书写未来好吗？',
        '给我一个机会好吗？'
    ],
    humor: [
        '要不要试试看呢？',
        '考虑一下我吧！',
        '来做我的小可爱吧！'
    ],
    simple: [
        '这就是我的心意',
        '希望你能接受我',
        '让我们在一起吧'
    ]
};

// 修改生成函数，直接返回完整的模板对象
function generateTemplate(category, hotWords) {
    const structure = templateStructures[category][Math.floor(Math.random() * templateStructures[category].length)];
    const emotion = emotions[category][Math.floor(Math.random() * emotions[category].length)];
    const ending = endings[category][Math.floor(Math.random() * endings[category].length)];
    
    // 从热词中随机选择
    const keyword = hotWords ? hotWords[Math.floor(Math.random() * hotWords.length)].text : '星星';
    const scene = hotWords ? hotWords[Math.floor(Math.random() * hotWords.length)].text : '月亮';
    const action = hotWords ? hotWords[Math.floor(Math.random() * hotWords.length)].text : '守候';
    const role = hotWords ? hotWords[Math.floor(Math.random() * hotWords.length)].text : '唯一';

    return {
        id: Date.now(), // 使用时间戳作为临时ID
        category: category,
        title: category === 'romantic' ? '浪漫表白' : 
               category === 'humor' ? '俏皮可爱' : '简单直接',
        content: structure
            .replace('{keyword}', keyword)
            .replace('{emotion}', emotion)
            .replace('{scene}', scene)
            .replace('{action}', action)
            .replace('{role}', role)
            .replace('{ending}', ending)
    };
}

// 初始化模板数据
function initializeTemplates() {
    const categories = ['romantic', 'humor', 'simple'];
    categories.forEach(category => {
        // 为每个类别生成一个初始模板
        templates.push(generateTemplate(category));
    });
}

// 页面加载时初始化模板
initializeTemplates(); 

// 界面文本配置
const uiText = {
    zh: {
        title: '表白模板生成器',
        login: '登录',
        register: '注册',
        search: '搜索模板...',
        categories: {
            all: '全部',
            romantic: '浪漫文艺',
            humor: '幽默风趣',
            simple: '简单直接'
        },
        refresh: '换一个',
        copy: '复制文本',
        auth: {
            loginTitle: '登录',
            loginSubtitle: '使用您的账号',
            email: '电子邮箱',
            password: '密码',
            rememberMe: '记住我',
            forgotPassword: '忘记密码？',
            createAccount: '创建账号',
            registerTitle: '创建账号',
            registerSubtitle: '开始您的表白之旅',
            username: '用户名',
            confirmPassword: '确认密码',
            backToLogin: '返回登录',
            resetPassword: '重置密码',
            resetSubtitle: '我们将向您的邮箱发送验证码',
            verificationCode: '验证码',
            sendCode: '发送验证码',
            newPassword: '新密码',
            confirmNewPassword: '确认新密码'
        },
        emptyCategory: '该类别暂无内容',
    },
    en: {
        title: 'Love Confession Generator',
        login: 'Login',
        register: 'Register',
        search: 'Search templates...',
        categories: {
            all: 'All',
            romantic: 'Romantic',
            humor: 'Humorous',
            simple: 'Simple'
        },
        refresh: 'Next One',
        copy: 'Copy Text',
        auth: {
            loginTitle: 'Login',
            loginSubtitle: 'Use your account',
            email: 'Email',
            password: 'Password',
            rememberMe: 'Remember me',
            forgotPassword: 'Forgot Password?',
            createAccount: 'Create Account',
            registerTitle: 'Create Account',
            registerSubtitle: 'Start your love journey',
            username: 'Username',
            confirmPassword: 'Confirm Password',
            backToLogin: 'Back to Login',
            resetPassword: 'Reset Password',
            resetSubtitle: 'We will send a verification code to your email',
            verificationCode: 'Verification Code',
            sendCode: 'Send Code',
            newPassword: 'New Password',
            confirmNewPassword: 'Confirm New Password'
        },
        emptyCategory: 'No content in this category',
    },
    ar: {
        title: 'مولد رسائل الحب',
        login: 'تسجيل الدخول',
        register: 'التسجيل',
        search: 'البحث عن القالب...',
        categories: {
            all: 'الكل',
            romantic: 'رومانسي',
            humor: 'فكاهي',
            simple: 'بسيط'
        },
        refresh: 'التالي',
        copy: 'نسخ النص',
        auth: {
            loginTitle: 'تسجيل الدخول',
            loginSubtitle: 'استخدم حسابك',
            email: 'البريد الإلكتروني',
            password: 'كلمة المرور',
            rememberMe: 'تذكرني',
            forgotPassword: 'نسيت كلمة المرور؟',
            createAccount: 'إنشاء حساب',
            registerTitle: 'إنشاء حساب',
            registerSubtitle: 'ابدأ رحلة الحب',
            username: 'اسم المستخدم',
            confirmPassword: 'تأكيد كلمة المرور',
            backToLogin: 'العودة لتسجيل الدخول',
            resetPassword: 'إعادة تعيين كلمة المرور',
            resetSubtitle: 'سنرسل رمز التحقق إلى بريدك الإلكتروني',
            verificationCode: 'رمز التحقق',
            sendCode: 'إرسال الرمز',
            newPassword: 'كلمة المرور الجديدة',
            confirmNewPassword: 'تأكيد كلمة المرور الجديدة'
        },
        emptyCategory: 'لا يوجد محتوى في هذه الفئة',
    }
}; 

// 模板数据库
const templateDatabase = {
    zh: {
        romantic: [
            {
                id: 'r1',
                title: '星空告白',
                content: '在这个星星的世界里，对你的感觉越来越深。每当月亮的时候，守候。愿意成为我的唯一吗？'
            },
            {
                id: 'r2',
                title: '温柔时光',
                content: '你是我荒芜心田里的一抹芬芳，是我漫长黑夜里的熠熠星辰，是我灵魂深处最温柔的羁绊。我愿用一生的时光，谱写与你有关的情诗。'
            }
            // ... 添加更多浪漫文案
        ],
        humor: [
            {
                id: 'h1',
                title: '俏皮告白',
                content: '宝，我今天去种地了，种的什么地，对你的死心塌地。我觉得你接近我就是为了害我，害得我好喜欢你。'
            }
            // ... 添加更多幽默文案
        ],
        simple: [
            {
                id: 's1',
                title: '真诚告白',
                content: '我喜欢你，没有什么特别的理由，就是看到你就开心，想和你在一起，做我的另一半吧。'
            }
            // ... 添加更多简单文案
        ]
    },
    en: {
        romantic: [
            {
                id: 'r1_en',
                title: 'Starry Confession',
                content: 'In this world of stars, my feelings for you grow deeper. When the moon rises, I wait. Would you be my only one?'
            }
            // ... 添加更多英文浪漫文案
        ],
        humor: [
            {
                id: 'h1_en',
                title: 'Playful Confession',
                content: 'I went farming today, and you know what I planted? My heart in your garden. You must be a thief because you\'ve stolen my heart!'
            }
        ],
        simple: [
            {
                id: 's1_en',
                title: 'Sincere Confession',
                content: 'I like you, no special reason, just seeing you makes me happy. Would you be mine?'
            }
        ]
    },
    ar: {
        romantic: [
            {
                id: 'r1_ar',
                title: 'اعتراف رومانسي',
                content: 'في عالم النجوم هذا، تزداد مشاعري نحوك عمقاً. عندما يشرق القمر، أنتظر. هل تقبلين أن تكوني وحيدتي؟'
            }
        ],
        humor: [
            {
                id: 'h1_ar',
                title: 'اعتراف مرح',
                content: 'ذهبت للزراعة اليوم، وتعرفين ماذا زرعت؟ قلبي في حديقتك. لا بد أنك سارقة لأنك سرقتِ قلبي!'
            }
        ],
        simple: [
            {
                id: 's1_ar',
                title: 'اعتراف صادق',
                content: 'أحبك، لا سبب خاص، مجرد رؤيتك تجعلني سعيداً. هل تقبلين أن تكوني حبيبتي؟'
            }
        ]
    }
}; 