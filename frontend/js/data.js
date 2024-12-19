// 删除 module.exports，改用全局变量
const templates = []; // 初始化空数组，将由生成的内容填充

// 基础模板结构
const templateStructures = {
    romantic: [
        '就像{keyword}一样，{emotion}。这世界这么大，{action}。{ending}',
        '在这个{keyword}的世界里，{emotion}。每当{scene}的时候，{action}。{ending}',
        '遇见你就像{keyword}，{emotion}。无论{scene}，{action}。{ending}'
    ],
    humor: [
        '如果你是{keyword}，那我就要做{action}。{emotion}，要不要考虑一下接受我呢？',
        '别人都在关注{keyword}，而我只关注你。{emotion}，{action}。做我的{role}好吗？',
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