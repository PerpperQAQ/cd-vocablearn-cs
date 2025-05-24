// 学习模式管理器
class LearningModes {
    constructor(terms) {
        this.terms = terms || [];
        this.currentMode = null;
        this.currentIndex = 0;
        this.score = 0;
        this.totalQuestions = 0;
        this.currentTerm = null;
        this.isActive = false;
        this.audio = null;
        
        // 键盘音效设置
        this.keyboardSounds = {
            enabled: true,
            volume: 0.3
        };
        
        this.init();
    }

    init() {
        this.createLearningInterface();
        this.loadKeyboardSounds();
    }

    // 加载键盘音效
    loadKeyboardSounds() {
        // 创建键盘音效 - 使用Web Audio API生成
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    // 播放键盘音效
    playKeyboardSound() {
        if (!this.keyboardSounds.enabled || !this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // 设置音效参数 - 清脆的键盘声
        oscillator.frequency.value = 800;
        oscillator.type = 'square';
        
        gainNode.gain.setValueAtTime(this.keyboardSounds.volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }

    // 创建学习界面
    createLearningInterface() {
        const interfaceHTML = `
            <div id="learning-modes-overlay" class="learning-overlay" style="display: none;">
                <div class="learning-container">
                    <div class="learning-header">
                        <h2 id="learning-title">学习模式</h2>
                        <button id="close-learning" class="btn-close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <!-- 模式选择界面 -->
                    <div id="mode-selection" class="mode-selection">
                        <div class="mode-grid">
                            <div class="mode-card" data-mode="chinese-to-english">
                                <div class="mode-icon">
                                    <i class="fas fa-language"></i>
                                </div>
                                <h3>中译英模式</h3>
                                <p>看中文释义，输入对应的英文单词</p>
                                <div class="mode-features">
                                    <span><i class="fas fa-keyboard"></i> 键盘反馈</span>
                                    <span><i class="fas fa-brain"></i> 记忆训练</span>
                                </div>
                            </div>
                            
                            <div class="mode-card" data-mode="dictation">
                                <div class="mode-icon">
                                    <i class="fas fa-headphones"></i>
                                </div>
                                <h3>听写模式</h3>
                                <p>听发音拼写单词，提高听力和拼写能力</p>
                                <div class="mode-features">
                                    <span><i class="fas fa-volume-up"></i> 语音播放</span>
                                    <span><i class="fas fa-spell-check"></i> 拼写检查</span>
                                </div>
                            </div>
                            
                            <div class="mode-card" data-mode="listening">
                                <div class="mode-icon">
                                    <i class="fas fa-ear-listen"></i>
                                </div>
                                <h3>听力模式</h3>
                                <p>听单词发音，培养语感和发音能力</p>
                                <div class="mode-features">
                                    <span><i class="fas fa-list"></i> 单词列表</span>
                                    <span><i class="fas fa-play"></i> 连续播放</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 学习界面 -->
                    <div id="learning-interface" class="learning-interface" style="display: none;">
                        <div class="learning-progress">
                            <div class="progress-info">
                                <span id="current-question">1</span> / <span id="total-questions">20</span>
                                <span class="score">得分: <span id="current-score">0</span></span>
                            </div>
                            <div class="progress-bar">
                                <div id="progress-fill" class="progress-fill"></div>
                            </div>
                        </div>
                        
                        <div id="question-area" class="question-area">
                            <!-- 动态内容区域 -->
                        </div>
                        
                        <div class="learning-controls">
                            <button id="skip-btn" class="btn btn-secondary">
                                <i class="fas fa-forward"></i> 跳过
                            </button>
                            <button id="hint-btn" class="btn btn-info">
                                <i class="fas fa-lightbulb"></i> 提示
                            </button>
                            <button id="repeat-audio" class="btn btn-primary" style="display: none;">
                                <i class="fas fa-redo"></i> 重听
                            </button>
                        </div>
                    </div>
                    
                    <!-- 结果界面 -->
                    <div id="learning-results" class="learning-results" style="display: none;">
                        <div class="results-content">
                            <div class="results-header">
                                <i class="fas fa-trophy"></i>
                                <h3>学习完成！</h3>
                            </div>
                            <div class="results-stats">
                                <div class="stat-item">
                                    <span class="stat-value" id="final-score">0</span>
                                    <span class="stat-label">总得分</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-value" id="accuracy-rate">0%</span>
                                    <span class="stat-label">正确率</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-value" id="completed-questions">0</span>
                                    <span class="stat-label">完成题目</span>
                                </div>
                            </div>
                            <div class="results-actions">
                                <button id="restart-learning" class="btn btn-primary">
                                    <i class="fas fa-redo"></i> 重新开始
                                </button>
                                <button id="back-to-modes" class="btn btn-secondary">
                                    <i class="fas fa-arrow-left"></i> 返回模式选择
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', interfaceHTML);
        this.setupEventListeners();
    }

    setupEventListeners() {
        // 关闭学习模式
        document.getElementById('close-learning').addEventListener('click', () => {
            this.hideLearning();
        });

        // 模式选择
        document.querySelectorAll('.mode-card').forEach(card => {
            card.addEventListener('click', () => {
                const mode = card.dataset.mode;
                this.startMode(mode);
            });
        });

        // 学习控制按钮
        document.getElementById('skip-btn').addEventListener('click', () => {
            this.skipQuestion();
        });

        document.getElementById('hint-btn').addEventListener('click', () => {
            this.showHint();
        });

        document.getElementById('repeat-audio').addEventListener('click', () => {
            this.playCurrentAudio();
        });

        // 结果界面按钮
        document.getElementById('restart-learning').addEventListener('click', () => {
            this.restartLearning();
        });

        document.getElementById('back-to-modes').addEventListener('click', () => {
            this.backToModeSelection();
        });

        // 点击overlay关闭
        document.getElementById('learning-modes-overlay').addEventListener('click', (e) => {
            if (e.target.id === 'learning-modes-overlay') {
                this.hideLearning();
            }
        });
    }

    // 显示学习模式界面
    showLearning(terms) {
        this.terms = terms || this.terms;
        if (this.terms.length === 0) {
            this.showMessage('没有可用的词汇进行学习', 'warning');
            return;
        }
        
        document.getElementById('learning-modes-overlay').style.display = 'flex';
        document.body.style.overflow = 'hidden';
        this.showModeSelection();
    }

    // 隐藏学习模式界面
    hideLearning() {
        document.getElementById('learning-modes-overlay').style.display = 'none';
        document.body.style.overflow = 'auto';
        this.stopCurrentAudio();
        this.isActive = false;
    }

    // 显示模式选择
    showModeSelection() {
        document.getElementById('mode-selection').style.display = 'block';
        document.getElementById('learning-interface').style.display = 'none';
        document.getElementById('learning-results').style.display = 'none';
        document.getElementById('learning-title').textContent = '选择学习模式';
    }

    // 开始指定模式
    startMode(mode) {
        this.currentMode = mode;
        this.currentIndex = 0;
        this.score = 0;
        this.totalQuestions = Math.min(this.terms.length, 20);
        this.isActive = true;
        
        // 打乱题目顺序
        this.shuffledTerms = [...this.terms].sort(() => Math.random() - 0.5);
        
        document.getElementById('mode-selection').style.display = 'none';
        document.getElementById('learning-interface').style.display = 'block';
        document.getElementById('learning-results').style.display = 'none';
        
        this.updateProgress();
        this.loadQuestion();
        
        const modeNames = {
            'chinese-to-english': '中译英模式',
            'dictation': '听写模式',
            'listening': '听力模式'
        };
        document.getElementById('learning-title').textContent = modeNames[mode];
    }

    // 加载题目
    loadQuestion() {
        if (this.currentIndex >= this.totalQuestions) {
            this.showResults();
            return;
        }

        this.currentTerm = this.shuffledTerms[this.currentIndex];
        
        switch (this.currentMode) {
            case 'chinese-to-english':
                this.loadChineseToEnglishQuestion();
                break;
            case 'dictation':
                this.loadDictationQuestion();
                break;
            case 'listening':
                this.loadListeningQuestion();
                break;
        }
    }

    // 中译英模式
    loadChineseToEnglishQuestion() {
        const questionArea = document.getElementById('question-area');
        questionArea.innerHTML = `
            <div class="cte-question">
                <div class="question-text">
                    <h3>请输入对应的英文单词：</h3>
                    <div class="chinese-meaning">
                        <p class="translation">${this.currentTerm.translation}</p>
                        <p class="explanation">${this.currentTerm.explanation}</p>
                    </div>
                </div>
                <div class="answer-input">
                    <input type="text" id="english-input" placeholder="输入英文单词..." autocomplete="off">
                    <button id="submit-answer" class="btn btn-primary">
                        <i class="fas fa-check"></i> 提交答案
                    </button>
                </div>
                <div id="feedback" class="feedback"></div>
            </div>
        `;

        const input = document.getElementById('english-input');
        const submitBtn = document.getElementById('submit-answer');

        // 添加键盘音效
        input.addEventListener('input', () => {
            this.playKeyboardSound();
        });

        // 提交答案
        const submitAnswer = () => {
            const answer = input.value.trim().toLowerCase();
            const correct = this.currentTerm.term.toLowerCase();
            
            if (answer === correct) {
                this.showFeedback(true, `正确！${this.currentTerm.term} - ${this.currentTerm.translation}`);
                this.score++;
            } else {
                this.showFeedback(false, `正确答案是：${this.currentTerm.term}`);
            }
        };

        submitBtn.addEventListener('click', submitAnswer);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                submitAnswer();
            }
        });

        input.focus();
        
        // 隐藏/显示控制按钮
        document.getElementById('repeat-audio').style.display = 'none';
    }

    // 听写模式
    loadDictationQuestion() {
        const questionArea = document.getElementById('question-area');
        questionArea.innerHTML = `
            <div class="dictation-question">
                <div class="question-text">
                    <h3>听发音，拼写单词：</h3>
                    <div class="audio-controls">
                        <button id="play-word" class="btn btn-large btn-primary">
                            <i class="fas fa-play"></i> 播放发音
                        </button>
                    </div>
                </div>
                <div class="answer-input">
                    <input type="text" id="dictation-input" placeholder="输入你听到的单词..." autocomplete="off">
                    <button id="submit-dictation" class="btn btn-primary">
                        <i class="fas fa-check"></i> 提交答案
                    </button>
                </div>
                <div id="feedback" class="feedback"></div>
            </div>
        `;

        const input = document.getElementById('dictation-input');
        const submitBtn = document.getElementById('submit-dictation');
        const playBtn = document.getElementById('play-word');

        // 添加键盘音效
        input.addEventListener('input', () => {
            this.playKeyboardSound();
        });

        // 播放发音
        playBtn.addEventListener('click', () => {
            this.playPronunciation(this.currentTerm.term);
        });

        // 自动播放一次
        setTimeout(() => {
            this.playPronunciation(this.currentTerm.term);
        }, 500);

        // 提交答案
        const submitAnswer = () => {
            const answer = input.value.trim().toLowerCase();
            const correct = this.currentTerm.term.toLowerCase();
            
            if (answer === correct) {
                this.showFeedback(true, `正确！${this.currentTerm.term} - ${this.currentTerm.translation}`);
                this.score++;
            } else {
                this.showFeedback(false, `正确答案是：${this.currentTerm.term} - ${this.currentTerm.translation}`);
            }
        };

        submitBtn.addEventListener('click', submitAnswer);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                submitAnswer();
            }
        });

        input.focus();
        
        // 显示重听按钮
        document.getElementById('repeat-audio').style.display = 'inline-flex';
    }

    // 听力模式
    loadListeningQuestion() {
        const questionArea = document.getElementById('question-area');
        
        // 生成选项
        const options = this.generateOptions(this.currentTerm);
        
        questionArea.innerHTML = `
            <div class="listening-question">
                <div class="question-text">
                    <h3>听发音，选择正确的单词：</h3>
                    <div class="audio-controls">
                        <button id="play-word" class="btn btn-large btn-primary">
                            <i class="fas fa-play"></i> 播放发音
                        </button>
                    </div>
                </div>
                <div class="listening-options">
                    ${options.map((option, index) => `
                        <button class="option-btn" data-answer="${option.term}">
                            <span class="option-letter">${String.fromCharCode(65 + index)}</span>
                            <div class="option-content">
                                <span class="option-word">${option.term}</span>
                                <span class="option-translation">${option.translation}</span>
                            </div>
                        </button>
                    `).join('')}
                </div>
                <div id="feedback" class="feedback"></div>
            </div>
        `;

        const playBtn = document.getElementById('play-word');
        const optionBtns = document.querySelectorAll('.option-btn');

        // 播放发音
        playBtn.addEventListener('click', () => {
            this.playPronunciation(this.currentTerm.term);
        });

        // 自动播放一次
        setTimeout(() => {
            this.playPronunciation(this.currentTerm.term);
        }, 500);

        // 选项点击
        optionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const answer = btn.dataset.answer;
                const correct = this.currentTerm.term;
                
                // 禁用所有按钮
                optionBtns.forEach(b => b.disabled = true);
                
                if (answer === correct) {
                    btn.classList.add('correct');
                    this.showFeedback(true, `正确！${this.currentTerm.term} - ${this.currentTerm.translation}`);
                    this.score++;
                } else {
                    btn.classList.add('incorrect');
                    // 显示正确答案
                    optionBtns.forEach(b => {
                        if (b.dataset.answer === correct) {
                            b.classList.add('correct');
                        }
                    });
                    this.showFeedback(false, `正确答案是：${this.currentTerm.term} - ${this.currentTerm.translation}`);
                }
            });
        });
        
        // 显示重听按钮
        document.getElementById('repeat-audio').style.display = 'inline-flex';
    }

    // 生成选项（用于听力模式）
    generateOptions(correctTerm) {
        const options = [correctTerm];
        const otherTerms = this.terms.filter(term => term.id !== correctTerm.id);
        
        // 随机选择3个其他选项
        while (options.length < 4 && otherTerms.length > 0) {
            const randomIndex = Math.floor(Math.random() * otherTerms.length);
            const randomTerm = otherTerms.splice(randomIndex, 1)[0];
            options.push(randomTerm);
        }
        
        // 打乱选项顺序
        return options.sort(() => Math.random() - 0.5);
    }

    // 播放发音
    playPronunciation(word) {
        if ('speechSynthesis' in window) {
            // 停止当前播放
            speechSynthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(word);
            utterance.lang = 'en-US';
            utterance.rate = 0.8;
            utterance.volume = 0.8;
            speechSynthesis.speak(utterance);
        }
    }

    // 播放当前音频
    playCurrentAudio() {
        if (this.currentTerm) {
            this.playPronunciation(this.currentTerm.term);
        }
    }

    // 停止音频
    stopCurrentAudio() {
        if ('speechSynthesis' in window) {
            speechSynthesis.cancel();
        }
    }

    // 显示反馈
    showFeedback(isCorrect, message) {
        const feedback = document.getElementById('feedback');
        feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
        feedback.innerHTML = `
            <i class="fas fa-${isCorrect ? 'check' : 'times'}"></i>
            <span>${message}</span>
        `;
        feedback.style.display = 'block';

        // 2秒后进入下一题
        setTimeout(() => {
            this.nextQuestion();
        }, 2000);
    }

    // 下一题
    nextQuestion() {
        this.currentIndex++;
        this.updateProgress();
        this.loadQuestion();
    }

    // 跳过题目
    skipQuestion() {
        this.showFeedback(false, `正确答案是：${this.currentTerm.term} - ${this.currentTerm.translation}`);
    }

    // 显示提示
    showHint() {
        const hints = {
            'chinese-to-english': `提示：单词长度为 ${this.currentTerm.term.length} 个字母`,
            'dictation': `提示：单词的第一个字母是 "${this.currentTerm.term[0].toUpperCase()}"`,
            'listening': '提示：仔细听发音，注意重音位置'
        };
        
        this.showMessage(hints[this.currentMode], 'info');
    }

    // 更新进度
    updateProgress() {
        document.getElementById('current-question').textContent = this.currentIndex + 1;
        document.getElementById('total-questions').textContent = this.totalQuestions;
        document.getElementById('current-score').textContent = this.score;
        
        const progress = ((this.currentIndex + 1) / this.totalQuestions) * 100;
        document.getElementById('progress-fill').style.width = `${progress}%`;
    }

    // 显示结果
    showResults() {
        document.getElementById('learning-interface').style.display = 'none';
        document.getElementById('learning-results').style.display = 'block';
        
        const accuracy = Math.round((this.score / this.totalQuestions) * 100);
        
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('accuracy-rate').textContent = `${accuracy}%`;
        document.getElementById('completed-questions').textContent = this.totalQuestions;
        
        document.getElementById('learning-title').textContent = '学习完成';
    }

    // 重新开始学习
    restartLearning() {
        this.startMode(this.currentMode);
    }

    // 返回模式选择
    backToModeSelection() {
        this.showModeSelection();
    }

    // 显示消息
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
}

// 全局变量
let learningModes; 