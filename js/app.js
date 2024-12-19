// 全局变量
let currentTemplates = templates;

// DOM 元素
const templateContainer = document.getElementById('templateContainer');
const searchInput = document.getElementById('searchInput');
const categoryBtns = document.querySelectorAll('.category-btn');
const modal = document.getElementById('templateModal');
const modalTitle = document.getElementById('modalTitle');
const modalContent = document.getElementById('modalContent');
const closeBtn = document.querySelector('.close');
const copyBtn = document.getElementById('copyBtn');

// 渲染模板卡片
function renderTemplates(templatesArray) {
    templateContainer.innerHTML = '';
    
    templatesArray.forEach(template => {
        const card = document.createElement('div');
        card.className = 'template-card';
        card.dataset.category = template.category;
        card.innerHTML = `
            <h3>${template.title}</h3>
            <p class="template-content">${template.content}</p>
            <div class="template-actions">
                <button onclick="showTemplate(${template.id})">使用这个</button>
            </div>
        `;
        templateContainer.appendChild(card);
    });
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

categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        categoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const category = btn.dataset.category;
        if (category === 'all') {
            renderTemplates(templates);
        } else {
            const filtered = templates.filter(t => t.category === category);
            renderTemplates(filtered);
        }
    });
});

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(modalContent.textContent)
        .then(() => alert('文本已复��到剪贴板！'))
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
    document.getElementById(modalId).style.display = 'none';
}

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

// 显示���误信息
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

// 添加忘记密码相关函数
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
                this.textContent = '发送验证码';
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

// 修改刷新按钮功能
document.getElementById('refreshBtn').addEventListener('click', async () => {
    const activeCategory = document.querySelector('.category-btn.active').dataset.category;
    const category = activeCategory === 'all' ? 'romantic' : activeCategory; // 默认使用 romantic
    
    try {
        // 生成新的模板内容
        const newTemplate = generateTemplate(category);
        
        // 更新显示
        const templateCards = document.querySelectorAll('.template-card');
        templateCards.forEach(card => {
            if (card.dataset.category === category || activeCategory === 'all') {
                // 添加淡出效果
                card.style.opacity = '0';
                
                setTimeout(() => {
                    const content = card.querySelector('.template-content');
                    content.textContent = newTemplate.content;
                    card.style.opacity = '1';
                }, 300);
            }
        });
    } catch (error) {
        showToast('生成新内容失败', 'error');
    }
}); 