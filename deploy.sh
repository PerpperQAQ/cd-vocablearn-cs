#!/bin/bash

# VocabLearn CS 快速部署脚本
echo "🚀 开始部署 VocabLearn CS 到 GitHub Pages..."

# 检查是否已经初始化Git
if [ ! -d ".git" ]; then
    echo "📦 初始化Git仓库..."
    git init
    git branch -M main
fi

# 添加所有文件
echo "📁 添加项目文件..."
git add .

# 获取当前时间作为提交消息
current_time=$(date "+%Y-%m-%d %H:%M:%S")
commit_message="部署更新: $current_time"

# 提交更改
echo "💾 提交更改..."
git commit -m "$commit_message"

# 检查是否已经添加远程仓库
if ! git remote | grep -q origin; then
    echo "⚠️  请先设置GitHub仓库地址："
    echo "   git remote add origin https://github.com/你的用户名/vocablearn-cs.git"
    echo "   然后重新运行此脚本"
    exit 1
fi

# 推送到GitHub
echo "🌐 推送到GitHub..."
git push -u origin main

echo "✅ 部署完成！"
echo "🔗 访问地址："
echo "   GitHub仓库: $(git remote get-url origin)"
echo "   GitHub Pages: https://你的用户名.github.io/vocablearn-cs"
echo ""
echo "📋 后续步骤："
echo "1. 访问GitHub仓库设置"
echo "2. 启用GitHub Pages（选择main分支）"
echo "3. 等待几分钟后访问在线网站" 