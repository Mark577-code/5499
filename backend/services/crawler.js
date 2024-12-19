const axios = require('axios');
const cheerio = require('cheerio');

class CrawlerService {
    // 获取微博热搜
    async getWeiboHot() {
        try {
            const response = await axios.get('https://s.weibo.com/top/summary', {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });
            const $ = cheerio.load(response.data);
            const hotWords = [];
            
            $('.td-02').each((i, elem) => {
                const text = $(elem).find('a').text().trim();
                if (text) {
                    hotWords.push({
                        text,
                        type: 'weibo',
                        source: '微博热搜'
                    });
                }
            });
            
            return hotWords;
        } catch (error) {
            console.error('获取微博热搜失败:', error);
            return [];
        }
    }

    // 获取B站热门话题
    async getBilibiliHot() {
        try {
            const response = await axios.get('https://api.bilibili.com/x/web-interface/popular');
            const hotWords = response.data.data.list.map(item => ({
                text: item.title,
                type: 'bilibili',
                source: 'B站热门'
            }));
            return hotWords;
        } catch (error) {
            console.error('获取B站热门失败:', error);
            return [];
        }
    }

    // 获取知乎热榜
    async getZhihuHot() {
        try {
            const response = await axios.get('https://www.zhihu.com/api/v3/feed/topstory/hot-lists/total');
            const hotWords = response.data.data.map(item => ({
                text: item.target.title,
                type: 'zhihu',
                source: '知乎热榜'
            }));
            return hotWords;
        } catch (error) {
            console.error('获取知乎热榜失败:', error);
            return [];
        }
    }

    // 整合所有热词
    async getAllHotWords() {
        const [weiboHot, bilibiliHot, zhihuHot] = await Promise.all([
            this.getWeiboHot(),
            this.getBilibiliHot(),
            this.getZhihuHot()
        ]);

        return [...weiboHot, ...bilibiliHot, ...zhihuHot];
    }
}

module.exports = new CrawlerService();