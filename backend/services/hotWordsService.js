const CrawlerService = require('./crawler');
const cache = require('memory-cache');

class HotWordsService {
    constructor() {
        this.CACHE_KEY = 'hot_words';
        this.CACHE_DURATION = 1800000; // 30分钟缓存
        this.updateInterval = 3600000; // 1小时更新一次
        this.startAutoUpdate();
    }

    // 获取热词
    async getHotWords() {
        let hotWords = cache.get(this.CACHE_KEY);
        
        if (!hotWords) {
            hotWords = await this.updateHotWords();
        }
        
        return this.processHotWords(hotWords);
    }

    // 更新热词
    async updateHotWords() {
        const hotWords = await CrawlerService.getAllHotWords();
        cache.put(this.CACHE_KEY, hotWords, this.CACHE_DURATION);
        return hotWords;
    }

    // 处理热词，按场景分类
    processHotWords(hotWords) {
        return {
            romantic: hotWords.filter(word => this.isRomantic(word.text)),
            trendy: hotWords.filter(word => this.isTrendy(word.text)),
            funny: hotWords.filter(word => this.isFunny(word.text))
        };
    }

    // 判断是否适合浪漫场景
    isRomantic(text) {
        const romanticKeywords = ['爱情', '浪漫', '温暖', '感动', '心动'];
        return romanticKeywords.some(keyword => text.includes(keyword));
    }

    // 判断是否是流行语
    isTrendy(text) {
        // 这里可以添加更复杂的判断逻辑
        return text.length < 10 && !this.isRomantic(text);
    }

    // 判断是否适合搞笑场景
    isFunny(text) {
        const funnyKeywords = ['笑', '搞笑', '梗', '沙雕'];
        return funnyKeywords.some(keyword => text.includes(keyword));
    }

    // 启动自动更新
    startAutoUpdate() {
        setInterval(() => {
            this.updateHotWords();
        }, this.updateInterval);
    }
}

module.exports = new HotWordsService();