// 修改 API 配置
const API_URL = '/api'; // 使用相对路径

// 修改请求函数
async function request(endpoint, options = {}) {
    const loadingEl = document.getElementById('loading');
    try {
        loadingEl.style.display = 'flex';
        
        const response = await fetch(`${API_URL}/${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
        
        if (!response.ok) {
            throw new Error('请求失败');
        }
        
        return await response.json();
    } catch (error) {
        console.error('API请求错误:', error);
        throw error;
    } finally {
        loadingEl.style.display = 'none';
    }
}

// 添加提示框组件
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }, 100);
}

// 修改登录函数
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const data = await request('auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        localStorage.setItem('token', data.token);
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        
        closeAuthModal('loginModal');
        updateUIForLoggedInUser(data.user);
        showToast('登录成功！');
    } catch (error) {
        showError('loginEmail', error.message);
    }
});

// 修改注册函数
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        showError('confirmPassword', '两次输入的密码不一致');
        return;
    }
    
    try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message);
        }

        closeAuthModal('registerModal');
        alert(data.message);
    } catch (error) {
        showError('registerEmail', error.message);
    }
}); 

// 更新用户界面函数
function updateUIForLoggedInUser(user) {
    const navLinks = document.querySelector('.nav-links');
    const userInfo = navLinks.querySelector('.user-info');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');

    userInfo.style.display = 'flex';
    loginBtn.style.display = 'none';
    registerBtn.style.display = 'none';

    document.getElementById('username').textContent = user.username;
    document.getElementById('userAvatar').src = user.avatar || '/images/logo.png';
}

// 头像上传相关
document.getElementById('changeAvatarBtn').addEventListener('click', () => {
    showAuthModal('avatarModal');
});

// 头像预览
document.getElementById('avatarInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('avatarPreview').src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
});

// 头像上传表单提交
document.getElementById('avatarForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const fileInput = document.getElementById('avatarInput');
    
    if (fileInput.files.length === 0) {
        alert('请选择要上传的图片');
        return;
    }

    formData.append('avatar', fileInput.files[0]);

    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/users/avatar', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message);
        }

        // 更新头像显示
        document.getElementById('userAvatar').src = data.avatar;
        closeAuthModal('avatarModal');
        alert('头像更新成功！');
    } catch (error) {
        alert(error.message);
    }
}); 