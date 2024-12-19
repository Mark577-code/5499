const HotWordsService = require('../services/hotWordsService');

exports.generateTemplate = async (req, res) => {
    try {
        const { style } = req.query;
        const hotWords = await HotWordsService.getHotWords();
        
        let template;
        switch (style) {
            case 'romantic':
                template = this.generateRomanticTemplate(hotWords.romantic);
                break;
            case 'funny':
                template = this.generateFunnyTemplate(hotWords.funny);
                break;
            default:
                template = this.generateTrendyTemplate(hotWords.trendy);
        }
        
        res.json({ template });
    } catch (error) {
        console.error('生成模板失败:', error);
        res.status(500).json({ message: '生成模板失败' });
    }
};

// 生成浪漫模板
exports.generateRomanticTemplate = (hotWords) => {
    const word = hotWords[Math.floor(Math.random() * hotWords.length)];
    return {
        title: '浪漫热词版',
        content: `就像${word.text}一样，我对你的心意从未改变。在这个充满${hotWords[0].text}的世界里，我只想和你一起分享每一刻的美好。`
    };
};

// 生成搞笑模板
exports.generateFunnyTemplate = (hotWords) => {
    const word = hotWords[Math.floor(Math.random() * hotWords.length)];
    return {
        title: '趣味热词版',
        content: `别人都在关注${word.text}，而我只关注你。做我的人生CP吧，保证比${hotWords[0].text}还精彩！`
    };
};

// 生成流行语模板
exports.generateTrendyTemplate = (hotWords) => {
    const word = hotWords[Math.floor(Math.random() * hotWords.length)];
    return {
        title: '潮流热词版',
        content: `${word.text}已经刷屏了，但我刷屏的只有你。愿意做我的${hotWords[0].text}吗？`
    };
};