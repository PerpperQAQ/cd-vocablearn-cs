// 互动测验类
class InteractiveQuiz {
    constructor(terms) {
        this.terms = terms;
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.totalQuestions = 10;
        this.timeLimit = 30; // 每题30秒
        this.timer = null;
        this.timeLeft = this.timeLimit;
        this.quizStartTime = null;
        this.init();
    }

    init() {
        this.generateQuestions();
        this.setupQuizInterface();
    }

    generateQuestions() {
        // 随机选择词汇
        const shuffledTerms = this.shuffleArray([...this.terms]);
        const selectedTerms = shuffledTerms.slice(0, this.totalQuestions);

        this.questions = selectedTerms.map((term, index) => {
            const questionTypes = ['definition', 'translation', 'example'];
            const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
            
            return this.createQuestion(term, questionType, index + 1);
        });
    }

    createQuestion(term, type, questionNumber) {
        const question = {
            id: questionNumber,
            term: term,
            type: type,
            question: '',
            options: [],
            correctAnswer: '',
            explanation: ''
        };

        switch (type) {
            case 'definition':
                question.question = `"${term.term}" 的含义是？`;
                question.correctAnswer = term.definition;
                question.options = this.generateDefinitionOptions(term);
                question.explanation = `${term.term}: ${term.translation} - ${term.explanation}`;
                break;

            case 'translation':
                question.question = `"${term.term}" 的中文翻译是？`;
                question.correctAnswer = term.translation;
                question.options = this.generateTranslationOptions(term);
                question.explanation = `${term.term} 的正确翻译是 "${term.translation}"`;
                break;

            case 'example':
                question.question = `以下哪个例句正确使用了 "${term.term}"？`;
                question.correctAnswer = term.example;
                question.options = this.generateExampleOptions(term);
                question.explanation = `${term.term} 的例句：${term.example}`;
                break;
        }

        return question;
    }

    generateDefinitionOptions(correctTerm) {
        const options = [correctTerm.definition];
        const otherTerms = this.terms.filter(t => t.id !== correctTerm.id);
        
        while (options.length < 4 && otherTerms.length > 0) {
            const randomTerm = otherTerms.splice(Math.floor(Math.random() * otherTerms.length), 1)[0];
            if (!options.includes(randomTerm.definition)) {
                options.push(randomTerm.definition);
            }
        }

        return this.shuffleArray(options);
    }

    generateTranslationOptions(correctTerm) {
        const options = [correctTerm.translation];
        const otherTerms = this.terms.filter(t => t.id !== correctTerm.id);
        
        while (options.length < 4 && otherTerms.length > 0) {
            const randomTerm = otherTerms.splice(Math.floor(Math.random() * otherTerms.length), 1)[0];
            if (!options.includes(randomTerm.translation)) {
                options.push(randomTerm.translation);
            }
        }

        return this.shuffleArray(options);
    }

    generateExampleOptions(correctTerm) {
        const options = [correctTerm.example];
        const otherTerms = this.terms.filter(t => t.id !== correctTerm.id);
        
        while (options.length < 4 && otherTerms.length > 0) {
            const randomTerm = otherTerms.splice(Math.floor(Math.random() * otherTerms.length), 1)[0];
            if (!options.includes(randomTerm.example)) {
                // 替换例句中的词汇以创建错误选项
                const modifiedExample = randomTerm.example.replace(
                    new RegExp(randomTerm.term, 'gi'), 
                    correctTerm.term
                );
                options.push(modifiedExample);
            }
        }

        return this.shuffleArray(options);
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    setupQuizInterface() {
        const quizSection = document.getElementById('quiz-section');
        const quizContent = document.getElementById('quiz-content');
        
        if (!quizSection || !quizContent) {
            console.error('Quiz elements not found');
            return;
        }

        // 设置关闭按钮
        const closeBtn = document.getElementById('close-quiz-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeQuiz();
            });
        }

        // 显示测验界面
        quizSection.style.display = 'block';
        
        // 渲染初始界面
        this.renderQuizStart();
    }

    renderQuizStart() {
        const quizContent = document.getElementById('quiz-content');
        quizContent.innerHTML = `
            <div class="quiz-start">
                <div class="quiz-intro">
                    <h3>词汇测验</h3>
                    <p>测验包含 ${this.totalQuestions} 道题目，每题限时 ${this.timeLimit} 秒</p>
                    <div class="quiz-stats">
                        <div class="stat">
                            <span class="stat-label">题目数量</span>
                            <span class="stat-value">${this.totalQuestions}</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">每题时间</span>
                            <span class="stat-value">${this.timeLimit}秒</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">词汇范围</span>
                            <span class="stat-value">${this.terms.length}个词汇</span>
                        </div>
                    </div>
                </div>
                <div class="quiz-actions">
                    <button id="start-quiz" class="btn btn-primary quiz-start-btn">
                        <i class="fas fa-play"></i>
                        开始测验
                    </button>
                </div>
            </div>
        `;

        // 绑定开始按钮事件
        const startBtn = document.getElementById('start-quiz');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.startQuiz();
            });
        }
    }

    startQuiz() {
        this.quizStartTime = new Date();
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.renderQuestion();
    }

    renderQuestion() {
        if (this.currentQuestionIndex >= this.questions.length) {
            this.showResults();
            return;
        }

        const question = this.questions[this.currentQuestionIndex];
        const quizContent = document.getElementById('quiz-content');
        
        quizContent.innerHTML = `
            <div class="quiz-question">
                <div class="quiz-header-info">
                    <div class="question-progress">
                        <span>题目 ${this.currentQuestionIndex + 1} / ${this.totalQuestions}</span>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${((this.currentQuestionIndex + 1) / this.totalQuestions) * 100}%"></div>
                        </div>
                    </div>
                    <div class="timer">
                        <i class="fas fa-clock"></i>
                        <span id="time-left">${this.timeLimit}</span>
                    </div>
                </div>
                
                <div class="question-content">
                    <h3 class="question-text">${question.question}</h3>
                    <div class="question-options">
                        ${question.options.map((option, index) => `
                            <button class="option-btn" data-answer="${option}">
                                <span class="option-letter">${String.fromCharCode(65 + index)}</span>
                                <span class="option-text">${option}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        // 绑定选项点击事件
        const optionBtns = quizContent.querySelectorAll('.option-btn');
        optionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectAnswer(btn.dataset.answer, question);
            });
        });

        // 开始计时
        this.startTimer();
    }

    startTimer() {
        this.timeLeft = this.timeLimit;
        this.updateTimerDisplay();

        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();

            if (this.timeLeft <= 0) {
                this.timeUp();
            }
        }, 1000);
    }

    updateTimerDisplay() {
        const timeLeftElement = document.getElementById('time-left');
        if (timeLeftElement) {
            timeLeftElement.textContent = this.timeLeft;
            
            // 时间紧急时改变颜色
            if (this.timeLeft <= 5) {
                timeLeftElement.style.color = 'var(--danger-color)';
            } else if (this.timeLeft <= 10) {
                timeLeftElement.style.color = 'var(--warning-color)';
            } else {
                timeLeftElement.style.color = 'var(--text-primary)';
            }
        }
    }

    timeUp() {
        this.clearTimer();
        const question = this.questions[this.currentQuestionIndex];
        this.showAnswerFeedback(null, question, false);
    }

    selectAnswer(selectedAnswer, question) {
        this.clearTimer();
        const isCorrect = selectedAnswer === question.correctAnswer;
        
        if (isCorrect) {
            this.score++;
        }

        this.showAnswerFeedback(selectedAnswer, question, isCorrect);
    }

    showAnswerFeedback(selectedAnswer, question, isCorrect) {
        const quizContent = document.getElementById('quiz-content');
        const timeBonus = Math.max(0, this.timeLeft);
        
        quizContent.innerHTML = `
            <div class="answer-feedback">
                <div class="feedback-header">
                    <div class="feedback-icon ${isCorrect ? 'correct' : 'incorrect'}">
                        <i class="fas fa-${isCorrect ? 'check' : 'times'}"></i>
                    </div>
                    <h3 class="feedback-title">
                        ${isCorrect ? '回答正确！' : selectedAnswer ? '回答错误' : '时间到！'}
                    </h3>
                </div>
                
                <div class="feedback-content">
                    <div class="correct-answer">
                        <h4>正确答案：</h4>
                        <p>${question.correctAnswer}</p>
                    </div>
                    
                    ${selectedAnswer && !isCorrect ? `
                        <div class="selected-answer">
                            <h4>您的答案：</h4>
                            <p>${selectedAnswer}</p>
                        </div>
                    ` : ''}
                    
                    <div class="explanation">
                        <h4>解释：</h4>
                        <p>${question.explanation}</p>
                    </div>
                    
                    ${isCorrect ? `
                        <div class="time-bonus">
                            <i class="fas fa-clock"></i>
                            <span>时间奖励: +${timeBonus}秒</span>
                        </div>
                    ` : ''}
                </div>
                
                <div class="feedback-actions">
                    <button id="next-question" class="btn btn-primary">
                        ${this.currentQuestionIndex < this.questions.length - 1 ? '下一题' : '查看结果'}
                        <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        `;

        // 绑定下一题按钮
        const nextBtn = document.getElementById('next-question');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.currentQuestionIndex++;
                this.renderQuestion();
            });
        }
    }

    showResults() {
        const quizContent = document.getElementById('quiz-content');
        const accuracy = Math.round((this.score / this.totalQuestions) * 100);
        const totalTime = Math.round((new Date() - this.quizStartTime) / 1000);
        
        let performanceLevel = '';
        let performanceColor = '';
        
        if (accuracy >= 90) {
            performanceLevel = '优秀';
            performanceColor = 'var(--success-color)';
        } else if (accuracy >= 70) {
            performanceLevel = '良好';
            performanceColor = 'var(--primary-color)';
        } else if (accuracy >= 60) {
            performanceLevel = '及格';
            performanceColor = 'var(--warning-color)';
        } else {
            performanceLevel = '需要提高';
            performanceColor = 'var(--danger-color)';
        }

        quizContent.innerHTML = `
            <div class="quiz-results">
                <div class="results-header">
                    <div class="results-icon">
                        <i class="fas fa-trophy"></i>
                    </div>
                    <h2>测验完成！</h2>
                </div>
                
                <div class="results-content">
                    <div class="score-display">
                        <div class="score-circle" style="--score-color: ${performanceColor}">
                            <span class="score-percentage">${accuracy}%</span>
                            <span class="score-label">${performanceLevel}</span>
                        </div>
                    </div>
                    
                    <div class="results-stats">
                        <div class="result-stat">
                            <i class="fas fa-check-circle"></i>
                            <div>
                                <span class="stat-number">${this.score}</span>
                                <span class="stat-label">正确答案</span>
                            </div>
                        </div>
                        <div class="result-stat">
                            <i class="fas fa-times-circle"></i>
                            <div>
                                <span class="stat-number">${this.totalQuestions - this.score}</span>
                                <span class="stat-label">错误答案</span>
                            </div>
                        </div>
                        <div class="result-stat">
                            <i class="fas fa-clock"></i>
                            <div>
                                <span class="stat-number">${totalTime}s</span>
                                <span class="stat-label">总用时</span>
                            </div>
                        </div>
                        <div class="result-stat">
                            <i class="fas fa-percentage"></i>
                            <div>
                                <span class="stat-number">${accuracy}%</span>
                                <span class="stat-label">准确率</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="results-actions">
                        <button id="retry-quiz" class="btn btn-secondary">
                            <i class="fas fa-redo"></i>
                            重新测验
                        </button>
                        <button id="close-results" class="btn btn-primary">
                            <i class="fas fa-times"></i>
                            关闭
                        </button>
                    </div>
                </div>
            </div>
        `;

        // 绑定按钮事件
        const retryBtn = document.getElementById('retry-quiz');
        const closeBtn = document.getElementById('close-results');
        
        if (retryBtn) {
            retryBtn.addEventListener('click', () => {
                this.generateQuestions();
                this.renderQuizStart();
            });
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeQuiz();
            });
        }

        // 保存测验记录
        this.saveQuizRecord(accuracy, totalTime);
    }

    saveQuizRecord(accuracy, totalTime) {
        const records = JSON.parse(localStorage.getItem('vocablearn_quiz_records') || '[]');
        const record = {
            date: new Date().toISOString(),
            score: this.score,
            total: this.totalQuestions,
            accuracy: accuracy,
            totalTime: totalTime,
            category: window.location.pathname.split('/').pop().split('.')[0]
        };
        
        records.push(record);
        
        // 只保留最近50条记录
        if (records.length > 50) {
            records.splice(0, records.length - 50);
        }
        
        localStorage.setItem('vocablearn_quiz_records', JSON.stringify(records));
    }

    clearTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    closeQuiz() {
        this.clearTimer();
        const quizSection = document.getElementById('quiz-section');
        if (quizSection) {
            quizSection.style.display = 'none';
        }
    }

    start() {
        // 公共方法，供外部调用
        this.renderQuizStart();
    }
}

// 导出类供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InteractiveQuiz;
} else {
    window.InteractiveQuiz = InteractiveQuiz;
} 