// 主题管理
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme();
        this.setupThemeToggle();
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        this.updateThemeIcon();
    }

    updateThemeIcon() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (this.theme === 'dark') {
                icon.className = 'fas fa-sun';
            } else {
                icon.className = 'fas fa-moon';
            }
        }
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggle();
            });
        }
    }

    toggle() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.theme);
        this.applyTheme();
    }
}

// 导航菜单管理
class NavigationManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupSmoothScroll();
        this.setupScrollHeader();
    }

    setupMobileMenu() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
            });

            // 点击菜单项时关闭移动端菜单
            const navLinks = navMenu.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });
        }
    }

    setupSmoothScroll() {
        const navLinks = document.querySelectorAll('a[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    setupScrollHeader() {
        const header = document.querySelector('.header');
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                header.style.backgroundColor = 'rgba(248, 250, 252, 0.95)';
            } else {
                header.style.backgroundColor = 'var(--bg-primary)';
            }

            lastScrollY = currentScrollY;
        });
    }
}

// 分类管理
class CategoryManager {
    constructor() {
        this.categories = [];
        this.init();
    }

    async init() {
        await this.loadCategories();
        this.renderCategories();
    }

    async loadCategories() {
        try {
            const response = await fetch('categories.json');
            const data = await response.json();
            this.categories = data.categories;
        } catch (error) {
            console.error('Failed to load categories:', error);
            // 使用默认分类数据作为备选
            this.categories = this.getDefaultCategories();
        }
    }

    getDefaultCategories() {
        return [
            {
                id: 'computer-science',
                title: '计算机科学',
                description: '计算机科学基础概念和核心术语，包括数据结构、算法、系统架构等fundamental知识点。',
                color: '#3B82F6',
                icon: 'fas fa-microchip',
                termCount: 120,
                difficulty: '中等',
                url: 'pages/computer-science.html'
            },
            {
                id: 'artificial-intelligence',
                title: '人工智能',
                description: '机器学习、深度学习、神经网络等AI核心概念，涵盖从传统ML到现代深度学习的专业词汇。',
                color: '#8B5CF6',
                icon: 'fas fa-robot',
                termCount: 150,
                difficulty: '困难',
                url: 'pages/artificial-intelligence.html'
            },
            {
                id: 'programming',
                title: '编程语言',
                description: '编程语言语法、开发工具、软件工程等编程实践中的关键术语和概念。',
                color: '#10B981',
                icon: 'fas fa-code',
                termCount: 130,
                difficulty: '简单',
                url: 'pages/programming.html'
            },
            {
                id: 'internet',
                title: '网络技术',
                description: '网络协议、Web技术、云计算、网络安全等互联网技术领域的专业词汇。',
                color: '#F59E0B',
                icon: 'fas fa-globe',
                termCount: 110,
                difficulty: '中等',
                url: 'pages/internet.html'
            }
        ];
    }

    renderCategories() {
        const categoriesGrid = document.getElementById('categories-grid');
        if (!categoriesGrid) return;

        categoriesGrid.innerHTML = '';

        this.categories.forEach((category, index) => {
            const categoryCard = this.createCategoryCard(category);
            categoryCard.style.animationDelay = `${index * 0.1}s`;
            categoryCard.classList.add('fadeIn');
            categoriesGrid.appendChild(categoryCard);
        });
    }

    createCategoryCard(category) {
        const card = document.createElement('div');
        card.className = 'category-card';
        card.style.setProperty('--category-color', category.color);
        
        card.innerHTML = `
            <div class="category-icon">
                <i class="${category.icon}"></i>
            </div>
            <h3 class="category-title">${category.title}</h3>
            <p class="category-description">${category.description}</p>
            <div class="category-meta">
                <span class="category-count">${category.termCount} 词汇</span>
                <span class="category-difficulty">${category.difficulty}</span>
            </div>
            <a href="${category.url}" class="btn btn-primary category-button">
                开始学习
                <i class="fas fa-arrow-right" style="margin-left: 8px;"></i>
            </a>
        `;

        // 添加点击事件
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.btn')) {
                window.location.href = category.url;
            }
        });

        return card;
    }
}

// 动画管理
class AnimationManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupCounterAnimations();
    }

    setupScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fadeIn');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // 观察需要动画的元素
        const animatedElements = document.querySelectorAll('.feature-card, .stat-item, .about-text');
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }

    setupCounterAnimations() {
        const counters = document.querySelectorAll('.stat-number');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });

        counters.forEach(counter => {
            observer.observe(counter);
        });
    }

    animateCounter(element) {
        const target = parseInt(element.textContent.replace(/\D/g, ''));
        const duration = 2000;
        const start = performance.now();
        const suffix = element.textContent.replace(/\d/g, '');

        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = Math.floor(progress * target);
            element.textContent = current + suffix;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }
}

// 性能优化
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.lazyLoadImages();
        this.preloadCriticalPages();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    preloadCriticalPages() {
        const criticalPages = [
            'pages/computer-science.html',
            'pages/artificial-intelligence.html',
            'pages/programming.html',
            'pages/internet.html'
        ];

        // 在空闲时间预加载关键页面
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                criticalPages.forEach(page => {
                    const link = document.createElement('link');
                    link.rel = 'prefetch';
                    link.href = page;
                    document.head.appendChild(link);
                });
            });
        }
    }
}

// 错误处理
class ErrorHandler {
    constructor() {
        this.init();
    }

    init() {
        window.addEventListener('error', this.handleError.bind(this));
        window.addEventListener('unhandledrejection', this.handlePromiseRejection.bind(this));
    }

    handleError(event) {
        console.error('Error occurred:', event.error);
        this.showErrorMessage('页面加载出现问题，请刷新页面重试。');
    }

    handlePromiseRejection(event) {
        console.error('Promise rejection:', event.reason);
        this.showErrorMessage('数据加载失败，请检查网络连接。');
    }

    showErrorMessage(message) {
        // 创建错误提示
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #EF4444;
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            animation: slideIn 0.3s ease-out;
        `;
        errorDiv.textContent = message;

        document.body.appendChild(errorDiv);

        // 3秒后自动移除
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }
}

// 应用初始化
class App {
    constructor() {
        this.init();
    }

    init() {
        // 等待DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeComponents();
            });
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        try {
            // 初始化各个组件
            this.themeManager = new ThemeManager();
            this.navigationManager = new NavigationManager();
            this.categoryManager = new CategoryManager();
            this.animationManager = new AnimationManager();
            this.performanceOptimizer = new PerformanceOptimizer();
            this.errorHandler = new ErrorHandler();

            console.log('VocabLearn CS initialized successfully');
        } catch (error) {
            console.error('Failed to initialize app:', error);
        }
    }
}

// 启动应用
new App(); 