// 分类页面模板管理器
class CategoryTemplate {
    constructor(categoryKey) {
        this.categoryKey = categoryKey;
        this.terms = [];
        this.filteredTerms = [];
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.currentFilter = 'all';
        this.searchQuery = '';
        this.hasUserGesture = false;
        this.initUserGestureDetection();
        this.init();
    }

    initUserGestureDetection() {
        // 检测用户首次交互，用于启用语音功能
        const events = ['click', 'touchstart', 'keydown'];
        const enableGesture = () => {
            this.hasUserGesture = true;
            events.forEach(event => {
                document.removeEventListener(event, enableGesture);
            });
        };
        
        events.forEach(event => {
            document.addEventListener(event, enableGesture, { once: true });
        });
    }

    async init() {
        try {
            await this.loadTerms();
            this.setupEventListeners();
            this.renderPage();
        } catch (error) {
            console.error('Failed to initialize category template:', error);
            this.showError('页面加载失败，请刷新页面重试。');
        }
    }

    async loadTerms() {
        try {
            // 动态加载对应分类的词汇数据
            const script = document.createElement('script');
            script.src = `../data/${this.categoryKey}_terms.js`;
            
            script.onload = () => {
                // 根据分类键获取对应的数据
                const dataMap = {
                    'computer-science': window.computerScienceTerms,
                    'artificial-intelligence': window.artificialIntelligenceTerms,
                    'programming': window.programmingTerms,
                    'internet': window.internetTerms
                };
                
                this.terms = dataMap[this.categoryKey] || [];
                
                if (this.terms.length === 0) {
                    console.error(`No data found for category: ${this.categoryKey}`);
                    console.log('Available data:', Object.keys(dataMap));
                    throw new Error(`No terms data found for ${this.categoryKey}`);
                }
                
                this.filteredTerms = [...this.terms];
                this.renderPage();
            };
            
            script.onerror = (error) => {
                console.error(`Failed to load script: ../data/${this.categoryKey}_terms.js`, error);
                throw new Error(`Failed to load terms for ${this.categoryKey}`);
            };
            
            document.head.appendChild(script);
        } catch (error) {
            console.error('Error loading terms:', error);
            this.showError('加载数据失败，请刷新页面重试。');
        }
    }

    setupEventListeners() {
        // 搜索功能
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase();
                this.filterTerms();
            });
        }

        // 难度筛选
        const difficultyFilter = document.getElementById('difficulty-filter');
        if (difficultyFilter) {
            difficultyFilter.addEventListener('change', (e) => {
                this.currentFilter = e.target.value;
                this.filterTerms();
            });
        }

        // 分类筛选
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.currentFilter = e.target.value;
                this.filterTerms();
            });
        }

        // 测验按钮
        const quizBtn = document.getElementById('start-quiz-btn');
        if (quizBtn) {
            quizBtn.addEventListener('click', () => {
                this.startQuiz();
            });
        }

        // 学习模式按钮
        const learningBtn = document.getElementById('learning-modes-btn');
        if (learningBtn) {
            learningBtn.addEventListener('click', () => {
                this.startLearningModes();
            });
        }

        // 返回顶部
        const backToTopBtn = document.getElementById('back-to-top');
        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });

            // 滚动时显示/隐藏返回顶部按钮
            window.addEventListener('scroll', () => {
                if (window.scrollY > 300) {
                    backToTopBtn.style.display = 'block';
                } else {
                    backToTopBtn.style.display = 'none';
                }
            });
        }
    }

    filterTerms() {
        this.filteredTerms = this.terms.filter(term => {
            const matchesSearch = this.searchQuery === '' || 
                term.term.toLowerCase().includes(this.searchQuery) ||
                term.translation.toLowerCase().includes(this.searchQuery) ||
                term.definition.toLowerCase().includes(this.searchQuery);

            const matchesFilter = this.currentFilter === 'all' || 
                term.difficulty === this.currentFilter ||
                term.category === this.currentFilter;

            return matchesSearch && matchesFilter;
        });

        this.currentPage = 1;
        this.renderTermsList();
        this.renderPagination();
        this.updateStats();
    }

    renderPage() {
        this.updatePageTitle();
        this.renderFilters();
        this.renderTermsList();
        this.renderPagination();
        this.updateStats();
    }

    updatePageTitle() {
        const titleMap = {
            'computer-science': '计算机科学',
            'artificial-intelligence': '人工智能',
            'programming': '编程语言',
            'internet': '网络技术'
        };

        const pageTitle = document.getElementById('page-title');
        if (pageTitle) {
            pageTitle.textContent = titleMap[this.categoryKey] || '词汇学习';
        }

        // 更新页面标题
        document.title = `${titleMap[this.categoryKey]} - VocabLearn CS`;
    }

    renderFilters() {
        // 渲染难度筛选选项
        const difficultyFilter = document.getElementById('difficulty-filter');
        if (difficultyFilter && this.terms.length > 0) {
            const difficulties = [...new Set(this.terms.map(term => term.difficulty))];
            difficultyFilter.innerHTML = '<option value="all">全部难度</option>';
            difficulties.forEach(difficulty => {
                const option = document.createElement('option');
                option.value = difficulty;
                option.textContent = difficulty;
                difficultyFilter.appendChild(option);
            });
        }

        // 渲染分类筛选选项
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter && this.terms.length > 0) {
            const categories = [...new Set(this.terms.map(term => term.category))];
            categoryFilter.innerHTML = '<option value="all">全部分类</option>';
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categoryFilter.appendChild(option);
            });
        }
    }

    renderTermsList() {
        const termsContainer = document.getElementById('terms-list');
        if (!termsContainer) return;

        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const currentTerms = this.filteredTerms.slice(startIndex, endIndex);

        if (currentTerms.length === 0) {
            termsContainer.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>没有找到匹配的词汇</h3>
                    <p>尝试调整搜索条件或筛选选项</p>
                </div>
            `;
            return;
        }

        termsContainer.innerHTML = currentTerms.map(term => this.createTermCard(term)).join('');
        
        // 添加动画效果
        const termCards = termsContainer.querySelectorAll('.term-card');
        termCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('fadeIn');
        });
    }

    createTermCard(term) {
        return `
            <div class="term-card" data-term-id="${term.id}">
                <div class="term-header">
                    <div class="term-main">
                        <h3 class="term-word">${term.term}</h3>
                        <span class="term-pronunciation">${term.pronunciation}</span>
                        <span class="term-translation">${term.translation}</span>
                    </div>
                    <div class="term-meta">
                        <span class="term-difficulty difficulty-${term.difficulty}">${term.difficulty}</span>
                        <span class="term-category">${term.category}</span>
                    </div>
                </div>
                
                <div class="term-content">
                    <div class="term-definition">
                        <h4>定义</h4>
                        <p>${term.definition}</p>
                        <p class="term-explanation">${term.explanation}</p>
                    </div>
                    
                    <div class="term-example">
                        <h4>例句</h4>
                        <p class="example-en">${term.example}</p>
                        <p class="example-cn">${term.exampleTranslation}</p>
                    </div>
                    
                    ${term.tags ? `
                        <div class="term-tags">
                            ${term.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
                
                <div class="term-actions">
                    <button class="btn-action" onclick="this.parentElement.parentElement.classList.toggle('expanded')">
                        <i class="fas fa-chevron-down"></i>
                        <span>详细信息</span>
                    </button>
                    <button class="btn-action" onclick="categoryTemplate.playPronunciation('${term.term}')">
                        <i class="fas fa-volume-up"></i>
                        <span>发音</span>
                    </button>
                    <button class="btn-action" onclick="categoryTemplate.addToFavorites(${term.id})">
                        <i class="fas fa-heart"></i>
                        <span>收藏</span>
                    </button>
                </div>
            </div>
        `;
    }

    renderPagination() {
        const paginationContainer = document.getElementById('pagination');
        if (!paginationContainer) return;

        const totalPages = Math.ceil(this.filteredTerms.length / this.itemsPerPage);
        
        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }

        let paginationHTML = '';
        
        // 上一页按钮
        if (this.currentPage > 1) {
            paginationHTML += `
                <button class="pagination-btn" onclick="categoryTemplate.changePage(${this.currentPage - 1})">
                    <i class="fas fa-chevron-left"></i>
                </button>
            `;
        }

        // 页码按钮
        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(totalPages, this.currentPage + 2);

        if (startPage > 1) {
            paginationHTML += `<button class="pagination-btn" onclick="categoryTemplate.changePage(1)">1</button>`;
            if (startPage > 2) {
                paginationHTML += `<span class="pagination-ellipsis">...</span>`;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <button class="pagination-btn ${i === this.currentPage ? 'active' : ''}" 
                        onclick="categoryTemplate.changePage(${i})">
                    ${i}
                </button>
            `;
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHTML += `<span class="pagination-ellipsis">...</span>`;
            }
            paginationHTML += `<button class="pagination-btn" onclick="categoryTemplate.changePage(${totalPages})">${totalPages}</button>`;
        }

        // 下一页按钮
        if (this.currentPage < totalPages) {
            paginationHTML += `
                <button class="pagination-btn" onclick="categoryTemplate.changePage(${this.currentPage + 1})">
                    <i class="fas fa-chevron-right"></i>
                </button>
            `;
        }

        paginationContainer.innerHTML = paginationHTML;
    }

    changePage(page) {
        this.currentPage = page;
        this.renderTermsList();
        this.renderPagination();
        
        // 滚动到列表顶部
        const termsSection = document.getElementById('terms-section');
        if (termsSection) {
            termsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    updateStats() {
        const statsContainer = document.getElementById('stats-info');
        if (statsContainer) {
            const total = this.terms.length;
            const filtered = this.filteredTerms.length;
            const difficulties = this.getStatsByDifficulty();
            
            statsContainer.innerHTML = `
                <div class="stat-item">
                    <span class="stat-number">${filtered}</span>
                    <span class="stat-label">当前显示</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">${total}</span>
                    <span class="stat-label">总词汇数</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">${difficulties.basic || 0}</span>
                    <span class="stat-label">基础词汇</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">${difficulties.intermediate || 0}</span>
                    <span class="stat-label">中等词汇</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">${difficulties.advanced || 0}</span>
                    <span class="stat-label">高级词汇</span>
                </div>
            `;
        }
    }

    getStatsByDifficulty() {
        const stats = {};
        this.terms.forEach(term => {
            const difficulty = term.difficulty;
            const key = difficulty === '基础' ? 'basic' : 
                       difficulty === '中等' ? 'intermediate' : 'advanced';
            stats[key] = (stats[key] || 0) + 1;
        });
        return stats;
    }

    startQuiz() {
        if (this.filteredTerms.length < 5) {
            this.showMessage('需要至少5个词汇才能开始测验', 'warning');
            return;
        }

        // 初始化测验
        if (window.InteractiveQuiz) {
            const quiz = new InteractiveQuiz(this.filteredTerms);
            quiz.start();
        } else {
            this.showMessage('测验功能暂不可用', 'error');
        }
    }

    startLearningModes() {
        if (this.filteredTerms.length < 3) {
            this.showMessage('需要至少3个词汇才能开始学习', 'warning');
            return;
        }

        // 初始化学习模式
        if (!window.learningModes) {
            window.learningModes = new LearningModes(this.filteredTerms);
        } else {
            window.learningModes.terms = this.filteredTerms;
        }
        
        window.learningModes.showLearning(this.filteredTerms);
    }

    playPronunciation(term) {
        // 使用通用语音解决方案
        if (window.universalSpeech && window.universalSpeech.isInitialized) {
            window.universalSpeech.speak(term)
                .then(() => {
                    console.log('语音播放成功:', term);
                })
                .catch((error) => {
                    console.error('语音播放失败:', error);
                    // 不显示错误消息，让用户重试
                    console.log('语音播放遇到问题，用户可以重试');
                });
        } else {
            console.warn('UniversalSpeech 尚未准备就绪');
            // 延迟重试
            setTimeout(() => {
                if (window.universalSpeech) {
                    this.playPronunciation(term);
                } else {
                    this.showMessage('语音功能正在加载，请稍后重试', 'info');
                }
            }, 1000);
        }
    }

    fallbackSpeech(term) {
        if (!('speechSynthesis' in window)) {
            this.showMessage('您的浏览器不支持语音合成功能', 'warning');
            return;
        }

        try {
            speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(term);
            utterance.lang = 'en-US';
            utterance.rate = 0.8;
            utterance.volume = 0.9;

            utterance.onerror = () => {
                this.showMessage('语音播放失败，请重试', 'warning');
            };

            speechSynthesis.speak(utterance);
        } catch (error) {
            this.showMessage('语音播放功能出现错误', 'error');
        }
    }

    // 检查语音合成支持
    checkSpeechSynthesisSupport() {
        if (!('speechSynthesis' in window)) {
            return false;
        }

        // 检查是否有可用的语音
        if (speechSynthesis.getVoices().length === 0) {
            // 延迟检查，某些浏览器需要时间加载语音
            return new Promise((resolve) => {
                speechSynthesis.addEventListener('voiceschanged', () => {
                    resolve(speechSynthesis.getVoices().length > 0);
                }, { once: true });
                
                // 超时保护
                setTimeout(() => resolve(false), 3000);
            });
        }

        return true;
    }

    // 检测移动设备
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // 检测移动Safari
    isMobileSafari() {
        return /iPhone|iPad|iPod/i.test(navigator.userAgent) && /Safari/i.test(navigator.userAgent);
    }

    // 确保在用户手势中执行
    ensureUserGesture(callback) {
        // 检查是否已经在用户手势中
        if (this.hasUserGesture) {
            callback();
            return;
        }

        // 创建提示，要求用户点击
        const gesturePrompt = document.createElement('div');
        gesturePrompt.className = 'gesture-prompt';
        gesturePrompt.innerHTML = `
            <div class="gesture-prompt-content">
                <i class="fas fa-hand-pointer"></i>
                <p>点击此处启用语音播放</p>
                <button class="btn btn-primary">启用语音</button>
            </div>
        `;

        document.body.appendChild(gesturePrompt);

        const enableButton = gesturePrompt.querySelector('button');
        enableButton.addEventListener('click', () => {
            this.hasUserGesture = true;
            gesturePrompt.remove();
            callback();
        });

        // 5秒后自动移除
        setTimeout(() => {
            if (gesturePrompt.parentNode) {
                gesturePrompt.remove();
            }
        }, 5000);
    }

    addToFavorites(termId) {
        const favorites = JSON.parse(localStorage.getItem('vocablearn_favorites') || '[]');
        const term = this.terms.find(t => t.id === termId);
        
        if (!term) return;

        const existingIndex = favorites.findIndex(f => f.id === termId && f.category === this.categoryKey);
        
        if (existingIndex === -1) {
            favorites.push({
                ...term,
                category: this.categoryKey,
                addedAt: new Date().toISOString()
            });
            localStorage.setItem('vocablearn_favorites', JSON.stringify(favorites));
            this.showMessage(`"${term.term}" 已添加到收藏`, 'success');
        } else {
            this.showMessage(`"${term.term}" 已经在收藏中`, 'info');
        }
    }

    showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : type === 'warning' ? 'exclamation-triangle' : type === 'error' ? 'times' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(messageDiv);

        // 3秒后自动移除
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }

    showError(message) {
        this.showMessage(message, 'error');
    }
}

// 获取当前页面的分类键
function getCategoryKey() {
    const path = window.location.pathname;
    const filename = path.split('/').pop().split('.')[0];
    return filename;
}

// 初始化分类页面
let categoryTemplate;
document.addEventListener('DOMContentLoaded', () => {
    const categoryKey = getCategoryKey();
    categoryTemplate = new CategoryTemplate(categoryKey);
}); 