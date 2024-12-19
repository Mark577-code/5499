#!/bin/bash

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}开始部署...${NC}"

# 检查 Node.js 环境
echo -e "${GREEN}检查 Node.js 环境...${NC}"
if ! command -v node &> /dev/null; then
    echo "请先安装 Node.js"
    exit 1
fi

# 安装依赖
echo -e "${GREEN}安装依赖...${NC}"
npm install --production

# 构建项目
echo -e "${GREEN}构建项目...${NC}"
npm run build

# 检查环境变量
echo -e "${GREEN}检查环境变量...${NC}"
if [ ! -f .env ]; then
    echo "请创建 .env 文件并配置环境变量"
    exit 1
fi

# 启动服务
echo -e "${GREEN}启动服务...${NC}"
pm2 delete love-template-generator || true
pm2 start backend/server.js --name love-template-generator

echo -e "${GREEN}部署完成！${NC}" 