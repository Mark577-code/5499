// 全局变量
let currentTemplates = templates;
let currentLang = localStorage.getItem('preferred-language') || 'zh';

// 等待 DOM 和所有资源加载完成
window.addEventListener('load', () => {
    // 初始化
    initThemeSwitcher();
    initLanguageSwitcher();
    
    // 获取当前语言的模板并渲染
    const currentTemplates = getCurrentLanguageTemplates();
    if (currentTemplates) {
        renderTemplates('all');
    } else {
        console.error('Failed to load templates');
    }
});

// 获取当前语言的模板
function getCurrentLanguageTemplates() {
    if (!templateDatabase || !templateDatabase[currentLang]) {
        console.error('Template database not loaded or language not found:', currentLang);
        return null;
    }
    return templateDatabase[currentLang];
}

// DOM 元素
const templateContainer = document.getElementById('templateContainer');
const searchInput = document.getElementById('searchInput');
const categoryBtns = document.querySelectorAll('.category-btn');
const modal = document.getElementById('templateModal');
const modalTitle = document.getElementById('modalTitle');
const modalContent = document.getElementById('modalContent');
const closeBtn = document.querySelector('.close');
const copyBtn = document.getElementById('copyBtn');

// 更新当前语言
function setCurrentLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('preferred-language', lang);
}

// 渲染模板卡片
function renderTemplates(category = 'all') {
    const templates = getCurrentLanguageTemplates();
    if (!templates) {
        console.error('No templates found for language:', currentLang);
        return;
    }

    const fragment = document.createDocumentFragment();
    
    // 如果是"全部"类别，显示所有模板
    if (category === 'all') {
        Object.entries(templates).forEach(([type, templateList]) => {
            templateList.forEach(template => {
                const card = createTemplateCard(template, type);
                fragment.appendChild(card);
            });
        });
    } else {
        // 如果是特定类别，只显示该类别的模板
        const templateList = templates[category];
        if (templateList && templateList.length > 0) {
            templateList.forEach(template => {
                const card = createTemplateCard(template, category);
                fragment.appendChild(card);
            });
        } else {
            // 如果该类别没有模板，显示提示信息
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-message';
            emptyMessage.textContent = uiText[currentLang].emptyCategory || '该类别暂无内容';
            fragment.appendChild(emptyMessage);
        }
    }
    
    const container = document.getElementById('templateContainer');
    if (container) {
        container.innerHTML = '';
        container.appendChild(fragment);
    }
}

// 创建模板卡片
function createTemplateCard(template, category) {
    const card = document.createElement('div');
    card.className = `template-card lang-${currentLang}`;
    card.dataset.category = category;
    
    // 根据语言设置文本方向
    const textDirection = currentLang === 'ar' ? 'rtl' : 'ltr';
    
    card.innerHTML = `
        <div class="card-content" dir="${textDirection}">
            <h3>${template.title}</h3>
            <p class="template-content">${template.content}</p>
            <div class="template-actions">
                <button class="use-btn" onclick="useTemplate('${template.id}')">
                    <span class="btn-icon">💝</span>
                    <span class="btn-text">${uiText[currentLang].useThis || '使用这个'}</span>
                </button>
            </div>
        </div>
    `;
    return card;
}

// 类别切换事件处理
categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // 移除所有按钮的活跃状态
        categoryBtns.forEach(b => b.classList.remove('active'));
        // 添加当前按钮的活跃状态
        btn.classList.add('active');
        // 获取类别并渲染
        const category = btn.dataset.category;
        renderTemplates(category);
    });
});

// 刷新按钮功能
document.getElementById('refreshBtn').addEventListener('click', () => {
    const activeCategory = document.querySelector('.category-btn.active').dataset.category;
    const templates = getCurrentLanguageTemplates();
    
    if (!templates) {
        console.error('No templates found');
        return;
    }

    // 获取当前显示的所有卡片
    const cards = document.querySelectorAll('.template-card');
    if (cards.length === 0) return;

    // 为每个类别准备新的模板集合
    const newTemplates = {};
    Object.keys(templates).forEach(category => {
        if (templates[category] && templates[category].length > 0) {
            newTemplates[category] = [...templates[category]];
            shuffleArray(newTemplates[category]);
        }
    });
    
    // 添加淡出效果
    cards.forEach(card => {
        card.style.opacity = '0';
    });
    
    // 延迟更新内容
    setTimeout(() => {
        cards.forEach(card => {
            const category = card.dataset.category;
            // 如果是当前选中的类别或者是"全部"模式
            if (activeCategory === 'all' || activeCategory === category) {
                // 从对应类别中取出一个模板
                const templateList = newTemplates[category];
                if (templateList && templateList.length > 0) {
                    const template = templateList.pop() || templates[category][0];
                    
                    // 更新卡片内容
                    card.querySelector('h3').textContent = template.title;
                    card.querySelector('.template-content').textContent = template.content;
                    card.querySelector('.use-btn').setAttribute('onclick', `useTemplate('${template.id}')`);
                }
                
                // 恢复透明度
                card.style.opacity = '1';
                
                // 添加动画效果
                card.classList.add('refresh-animation');
                setTimeout(() => {
                    card.classList.remove('refresh-animation');
                }, 500);
            }
        });
    }, 300);
});

// 使用模板
function useTemplate(templateId) {
    const templates = getCurrentLanguageTemplates();
    let selectedTemplate;
    
    // 查找选中的模板
    Object.values(templates).forEach(templateList => {
        const found = templateList.find(t => t.id === templateId);
        if (found) selectedTemplate = found;
    });
    
    if (selectedTemplate) {
        modalTitle.textContent = selectedTemplate.title;
        modalContent.textContent = selectedTemplate.content;
        modal.style.display = 'block';
        
        // 添加复制成功动画
        const useBtn = document.querySelector(`[onclick="useTemplate('${templateId}')"]`);
        useBtn.classList.add('used');
        setTimeout(() => useBtn.classList.remove('used'), 1000);
    }
}

// 数组随机打乱函数
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 显示模板详情
function showTemplate(id) {
    const template = templates.find(t => t.id === id);
    if (template) {
        modalTitle.textContent = template.title;
        modalContent.textContent = template.content;
        modal.style.display = 'block';
    }
}

// 事件监听器
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = templates.filter(template => 
        template.title.toLowerCase().includes(searchTerm) || 
        template.content.toLowerCase().includes(searchTerm)
    );
    renderTemplates(filtered);
});

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(modalContent.textContent)
        .then(() => alert('文本已复制到剪贴板！'))
        .catch(err => console.error('复制失败：', err));
});

// 初始化渲染
renderTemplates(templates); 

// 认证相关函数
function showAuthModal(modalId) {
    // 隐藏所有认证模态框
    document.querySelectorAll('.auth-modal').forEach(modal => {
        modal.style.display = 'none';
    });
    // 显示指定的模态框
    document.getElementById(modalId).style.display = 'block';
}

function closeAuthModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        // 清空表单
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
        }
        // 清除错误提示
        modal.querySelectorAll('.error-message').forEach(error => {
            error.textContent = '';
        });
    }
}

// 添加点击模态框外部关闭功能
document.querySelectorAll('.auth-modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeAuthModal(modal.id);
        }
    });
});

// 更新关闭按钮事件监听
document.querySelectorAll('.auth-modal .close').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
        const modal = closeBtn.closest('.auth-modal');
        if (modal) {
            closeAuthModal(modal.id);
        }
    });
});

// 绑定登录按钮点击事件
document.getElementById('loginBtn').addEventListener('click', () => {
    showAuthModal('loginModal');
});

// 绑定注册按钮点击事件
document.getElementById('registerBtn').addEventListener('click', () => {
    showAuthModal('registerModal');
});

// 表单验证和提交
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // 从 localStorage 获取用户数据
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // 登录成功
        localStorage.setItem('currentUser', JSON.stringify(user));
        closeAuthModal('loginModal');
        updateUIForLoggedInUser(user);
        alert('登录成功！');
    } else {
        // 登录失败
        showError('loginEmail', '邮箱或密码错误');
    }
});

document.getElementById('registerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // 验证密码
    if (password !== confirmPassword) {
        showError('confirmPassword', '两次输入的密码不一致');
        return;
    }
    
    // 从 localStorage 获取现有用户
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // 检查邮箱是否已注册
    if (users.some(u => u.email === email)) {
        showError('registerEmail', '该邮箱已被注册');
        return;
    }
    
    // 创建新用户
    const newUser = { username, email, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // 注册成功后自动登录
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    closeAuthModal('registerModal');
    updateUIForLoggedInUser(newUser);
    alert('注册成功！');
});

// 显示错误信息
function showError(inputId, message) {
    const input = document.getElementById(inputId);
    const errorSpan = input.nextElementSibling.nextElementSibling;
    errorSpan.textContent = message;
    input.classList.add('error');
}

// 更新已登录用户的 UI
function updateUIForLoggedInUser(user) {
    const navLinks = document.querySelector('.nav-links');
    navLinks.innerHTML = `
        <span>欢迎，${user.username}</span>
        <button onclick="logout()">退出登录</button>
    `;
}

// 退出登录
function logout() {
    localStorage.removeItem('currentUser');
    location.reload();
}

// 检查是否已登录
function checkLoginStatus() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        updateUIForLoggedInUser(currentUser);
    }
}

// 页面加载时检查登录状态
checkLoginStatus(); 

// 添加记密码相关函数
let verificationCode = null;
let countdown = 60;
let timer = null;

// 绑定忘记密码链接点击事件
document.querySelector('.forgot-password').addEventListener('click', (e) => {
    e.preventDefault();
    showAuthModal('forgotPasswordModal');
});

// 发送验证码
document.getElementById('sendCodeBtn').addEventListener('click', async function() {
    const email = document.getElementById('resetEmail').value;
    if (!email) {
        showError('resetEmail', '请输入邮箱');
        return;
    }

    try {
        // 发送验证码请求
        await request('auth/send-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });
        
        // 禁用按钮并开始倒计时
        this.disabled = true;
        this.classList.add('disabled');
        countdown = 60;
        this.textContent = `${countdown}秒后重试`;
        
        timer = setInterval(() => {
            countdown--;
            this.textContent = `${countdown}秒后重试`;
            if (countdown <= 0) {
                clearInterval(timer);
                this.disabled = false;
                this.classList.remove('disabled');
                this.textContent = '发送验码';
            }
        }, 1000);

        showToast('验证码已发送到您的邮箱', 'success');
    } catch (error) {
        showError('resetEmail', error.message);
    }
});

// 修改重置密码表单提交
document.getElementById('forgotPasswordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('resetEmail').value;
    const code = document.getElementById('verificationCode').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;

    // 验证密码
    if (newPassword !== confirmNewPassword) {
        showError('confirmNewPassword', '两次输入的密码不一致');
        return;
    }

    try {
        // 验证验证码
        await request('auth/verify-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, code })
        });

        // 更新密码
        await request('auth/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password: newPassword })
        });
        
        closeAuthModal('forgotPasswordModal');
        showToast('密码重置成功，请登录', 'success');
        showAuthModal('loginModal');
    } catch (error) {
        showError('verificationCode', error.message);
    }
});

// 添加图片懒加载
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// 添加加载状态指示
function showLoading() {
    const loadingEl = document.createElement('div');
    loadingEl.className = 'loading-overlay';
    loadingEl.innerHTML = '<div class="loading-spinner"></div>';
    document.body.appendChild(loadingEl);
}

function hideLoading() {
    const loadingEl = document.querySelector('.loading-overlay');
    if (loadingEl) {
        loadingEl.remove();
    }
}

// 主题切换功能
function initThemeSwitcher() {
    const themeBtns = document.querySelectorAll('.theme-btn');
    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.dataset.theme;
            document.body.className = `theme-${theme}`;
            localStorage.setItem('preferred-theme', theme);
        });
    });

    // 加载保存的主题
    const savedTheme = localStorage.getItem('preferred-theme');
    if (savedTheme) {
        document.body.className = `theme-${savedTheme}`;
    }
}

// 语言切换功能
function initLanguageSwitcher() {
    const langBtns = document.querySelectorAll('.language-btn');
    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            setCurrentLanguage(lang);
            updateUILanguage(lang);
        });
    });

    // 加载保存的语言设置
    const savedLang = localStorage.getItem('preferred-language') || 'zh';
    setCurrentLanguage(savedLang);
    updateUILanguage(savedLang);
}

// 更新界面语言
function updateUILanguage(lang) {
    // 更新 HTML 标签的语言
    document.documentElement.lang = lang;
    
    // 更新文档方向
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.body.dir = lang === 'ar' ? 'rtl' : 'ltr';
    
    // 更新所有卡片的文本方向
    document.querySelectorAll('.card-content').forEach(content => {
        content.dir = lang === 'ar' ? 'rtl' : 'ltr';
    });
    
    // 添加语言特定的类
    document.body.className = document.body.className
        .replace(/\blang-\w+\b/g, '')
        .trim() + ` lang-${lang}`;
    
    // 更新标题和其他文本
    document.title = uiText[lang].title;
    document.querySelector('h1').textContent = uiText[lang].title;
    
    // 更新按钮文本
    document.getElementById('loginBtn').textContent = uiText[lang].login;
    document.getElementById('registerBtn').textContent = uiText[lang].register;
    
    // 更新搜索框
    document.getElementById('searchInput').placeholder = uiText[lang].search;
    
    // 更新分类按钮
    document.querySelectorAll('.category-btn').forEach(btn => {
        const category = btn.dataset.category;
        btn.textContent = uiText[lang].categories[category];
    });
    
    // 更新刷新按钮
    document.querySelector('.refresh-btn span:last-child').textContent = uiText[lang].refresh;
    
    // 更新复制按钮
    document.getElementById('copyBtn').textContent = uiText[lang].copy;
    
    // 更新认证模态框
    updateAuthModals(lang);
    
    // 更新主题切换按钮
    updateThemeButtons(lang);
    
    // 如果是阿拉伯语，添加 RTL 支持
    document.body.dir = lang === 'ar' ? 'rtl' : 'ltr';
    
    // 重新渲染模板以应用新的方向
    const activeCategory = document.querySelector('.category-btn.active').dataset.category;
    renderTemplates(activeCategory);
    
    // 更新模态框方向
    document.querySelectorAll('.modal-content, .auth-content').forEach(modal => {
        modal.style.textAlign = lang === 'ar' ? 'right' : 'left';
    });
    
    // 更新按钮文本
    document.querySelectorAll('.use-btn .btn-text').forEach(btn => {
        btn.textContent = uiText[lang].useThis;
    });
}

// 更新认证模态框的文本
function updateAuthModals(lang) {
    const auth = uiText[lang].auth;
    
    // 登录模态框
    document.querySelector('#loginModal h2').textContent = auth.loginTitle;
    document.querySelector('#loginModal .auth-header p').textContent = auth.loginSubtitle;
    document.querySelector('label[for="loginEmail"]').textContent = auth.email;
    // ... 更新其他认证相关文本
}

// 更新主题按钮的文本
function updateThemeButtons(lang) {
    const themeButtons = document.querySelectorAll('.theme-btn');
    themeButtons.forEach(btn => {
        const theme = btn.dataset.theme;
        const langData = languages[lang][theme];
        btn.querySelector('.name').textContent = langData.name;
        btn.querySelector('.description').textContent = langData.description;
    });
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    initThemeSwitcher();
    initLanguageSwitcher();
    renderTemplates(templates);
}); 