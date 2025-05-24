# VocabLearn CS - 计算机科学英语词汇学习平台

🎓 专业的计算机科学英语词汇学习网站，包含500+专业术语和多种学习模式。

## ✨ 功能特色

- 📚 **四大学习分类**：计算机科学、人工智能、编程语言、网络技术
- 🎯 **三种学习模式**：中译英模式、听写模式、听力模式
- 🔊 **语音功能**：单词发音播放和键盘音效反馈
- 📱 **响应式设计**：支持PC、平板、手机多端访问
- 🌙 **主题切换**：明暗主题自由切换
- 🔍 **智能搜索**：词汇搜索和多维度筛选
- 📊 **互动测验**：词汇掌握程度测试
- 💾 **本地存储**：学习进度和偏好设置保存

## 🚀 在线访问

- **GitHub Pages**: [部署后的链接]
- **本地运行**: `http://localhost:8000`

## 📖 使用指南

### 本地运行
```bash
# 克隆项目
git clone [你的仓库地址]
cd vocablearn-cs

# 启动服务器
python3 -m http.server 8000

# 访问网站
open http://localhost:8000
```

### 学习模式使用
1. **中译英模式**：看中文释义，输入英文单词，享受键盘音效反馈
2. **听写模式**：听发音拼写单词，提高听力和拼写能力  
3. **听力模式**：听发音选择正确答案，培养语感

## 🛠️ 技术栈

- **前端**: HTML5, CSS3, JavaScript ES6+
- **音频**: Web Audio API, Speech Synthesis API
- **样式**: CSS Grid, Flexbox, 响应式设计
- **存储**: LocalStorage
- **图标**: Font Awesome

## 📁 项目结构

```
vocablearn-cs/
├── index.html              # 主页
├── pages/                  # 分类页面
│   ├── computer-science.html
│   ├── artificial-intelligence.html
│   ├── programming.html
│   └── internet.html
├── css/                    # 样式文件
│   ├── style.css          # 主样式
│   ├── category.css       # 分类页样式
│   └── learningModes.css  # 学习模式样式
├── js/                     # JavaScript文件
│   ├── categoryTemplate.js
│   ├── interactiveQuiz.js
│   └── learningModes.js
├── data/                   # 词汇数据
│   ├── computer-science_terms.js
│   ├── artificial-intelligence_terms.js
│   ├── programming_terms.js
│   └── internet_terms.js
├── images/                 # 图片资源
└── app.js                 # 主应用逻辑
```

## 🌐 部署指南

### GitHub Pages 部署（推荐）

1. **创建GitHub仓库**
   ```bash
   # 初始化Git仓库
   git init
   git add .
   git commit -m "Initial commit: VocabLearn CS项目"
   
   # 连接到GitHub仓库（替换为你的仓库地址）
   git remote add origin https://github.com/你的用户名/vocablearn-cs.git
   git push -u origin main
   ```

2. **启用GitHub Pages**
   - 进入GitHub仓库设置
   - 找到"Pages"选项
   - 选择"Deploy from a branch"
   - 选择"main"分支和"/ (root)"文件夹
   - 保存设置

3. **访问网站**
   - 部署完成后，访问：`https://你的用户名.github.io/vocablearn-cs`

### Netlify 部署

1. 访问 [netlify.com](https://netlify.com)
2. 拖拽项目文件夹到部署区域
3. 获得免费域名：`https://你的网站名.netlify.app`

### 自定义域名

1. **购买域名**（推荐域名）：
   - `vocablearn.com`
   - `cswords.com` 
   - `techwords.net`

2. **DNS配置**：
   - 将域名CNAME记录指向GitHub Pages或Netlify提供的地址

## 📊 数据统计

- 🎯 **词汇总数**: 500+ 专业术语
- 📚 **学习分类**: 4大核心领域
- 🎮 **学习模式**: 3种互动方式
- 🔊 **音频支持**: 全词汇语音播放
- 📱 **设备兼容**: 支持所有现代浏览器

## 🤝 贡献指南

欢迎提交Issue和Pull Request来完善项目：

1. Fork本项目
2. 创建feature分支
3. 提交更改
4. 创建Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 👨‍💻 作者

开发者：[你的名字]
联系方式：[你的邮箱]

---

⭐ 如果这个项目对你有帮助，请给它一个星标！ 