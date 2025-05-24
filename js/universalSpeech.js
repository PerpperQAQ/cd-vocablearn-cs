// 通用语音播放解决方案 - 专门解决移动端兼容性问题
class UniversalSpeech {
    constructor() {
        this.isInitialized = false;
        this.hasUserInteracted = false;
        this.voicesLoaded = false;
        this.voices = [];
        this.pendingSpeech = null;
        
        // 设备检测
        this.platform = this.detectPlatform();
        
        // 初始化
        this.init();
    }

    detectPlatform() {
        const ua = navigator.userAgent;
        
        if (/iPhone|iPad|iPod/i.test(ua)) {
            return { type: 'ios', name: 'iOS Safari' };
        } else if (/Android/i.test(ua)) {
            return { type: 'android', name: 'Android Chrome' };
        } else if (/Chrome/i.test(ua)) {
            return { type: 'chrome', name: 'Chrome Desktop' };
        } else if (/Firefox/i.test(ua)) {
            return { type: 'firefox', name: 'Firefox' };
        } else if (/Safari/i.test(ua)) {
            return { type: 'safari', name: 'Safari Desktop' };
        } else if (/Edge/i.test(ua)) {
            return { type: 'edge', name: 'Microsoft Edge' };
        }
        
        return { type: 'unknown', name: 'Unknown Browser' };
    }

    init() {
        console.log(`Universal Speech 初始化 - 平台: ${this.platform.name}`);
        
        // 检查基本支持
        if (!('speechSynthesis' in window)) {
            console.warn('浏览器不支持 Speech Synthesis API');
            return;
        }

        // 监听用户首次交互
        this.setupUserInteractionListener();
        
        // 加载语音列表
        this.loadVoices();
        
        this.isInitialized = true;
    }

    setupUserInteractionListener() {
        const events = ['click', 'touch', 'keydown', 'touchstart'];
        const handleFirstInteraction = () => {
            this.hasUserInteracted = true;
            console.log('用户首次交互已检测到');
            
            // 移除所有事件监听器
            events.forEach(event => {
                document.removeEventListener(event, handleFirstInteraction);
            });
            
            // 预热语音引擎（移动端特别重要）
            this.warmUpSpeechEngine();
        };
        
        events.forEach(event => {
            document.addEventListener(event, handleFirstInteraction, { passive: true });
        });
    }

    loadVoices() {
        const updateVoices = () => {
            this.voices = speechSynthesis.getVoices();
            this.voicesLoaded = this.voices.length > 0;
            
            if (this.voicesLoaded) {
                console.log(`已加载 ${this.voices.length} 个语音`);
                this.logAvailableVoices();
            }
        };

        // 立即尝试加载
        updateVoices();

        // 监听语音变化事件
        if ('onvoiceschanged' in speechSynthesis) {
            speechSynthesis.onvoiceschanged = updateVoices;
        }

        // 针对某些浏览器的特殊处理
        setTimeout(updateVoices, 1000);
        setTimeout(updateVoices, 3000);
    }

    logAvailableVoices() {
        const englishVoices = this.voices.filter(voice => 
            voice.lang.toLowerCase().includes('en')
        );
        console.log('可用英语语音:', englishVoices.map(v => `${v.name} (${v.lang})`));
    }

    warmUpSpeechEngine() {
        // 在用户交互后预热语音引擎
        if (!this.hasUserInteracted) return;
        
        try {
            const utterance = new SpeechSynthesisUtterance(' ');
            utterance.volume = 0.01; // 极低音量
            utterance.rate = 2; // 快速播放
            
            utterance.onend = () => {
                console.log('语音引擎预热完成');
            };
            
            speechSynthesis.speak(utterance);
        } catch (error) {
            console.warn('语音引擎预热失败:', error);
        }
    }

    selectBestVoice() {
        if (!this.voicesLoaded || this.voices.length === 0) {
            return null;
        }

        const englishVoices = this.voices.filter(voice => 
            voice.lang.toLowerCase().includes('en')
        );

        if (englishVoices.length === 0) {
            return this.voices[0]; // 使用默认语音
        }

        // 根据平台选择最佳语音
        switch (this.platform.type) {
            case 'ios':
                return this.selectIOSVoice(englishVoices);
            case 'android':
                return this.selectAndroidVoice(englishVoices);
            default:
                return this.selectDesktopVoice(englishVoices);
        }
    }

    selectIOSVoice(voices) {
        // iOS 优选语音
        const preferred = ['Samantha', 'Alex', 'Victoria', 'Allison'];
        
        for (const name of preferred) {
            const voice = voices.find(v => v.name.includes(name));
            if (voice) return voice;
        }
        
        return voices.find(v => v.lang === 'en-US') || voices[0];
    }

    selectAndroidVoice(voices) {
        // Android 优选语音
        const preferred = ['en-us-x-sfg', 'English', 'US English'];
        
        for (const name of preferred) {
            const voice = voices.find(v => 
                v.name.toLowerCase().includes(name.toLowerCase())
            );
            if (voice) return voice;
        }
        
        return voices.find(v => v.lang === 'en-US') || voices[0];
    }

    selectDesktopVoice(voices) {
        // 桌面端优选语音
        const preferred = ['Microsoft', 'Google', 'Alex', 'Samantha'];
        
        for (const name of preferred) {
            const voice = voices.find(v => v.name.includes(name));
            if (voice) return voice;
        }
        
        return voices.find(v => v.lang === 'en-US') || voices[0];
    }

    async speak(text, options = {}) {
        return new Promise((resolve, reject) => {
            // 基本检查
            if (!this.isInitialized) {
                reject(new Error('UniversalSpeech 未初始化'));
                return;
            }

            if (!('speechSynthesis' in window)) {
                reject(new Error('浏览器不支持语音合成'));
                return;
            }

            // 如果用户还没有交互，显示提示
            if (!this.hasUserInteracted) {
                this.showInteractionPrompt(() => {
                    this.speak(text, options).then(resolve).catch(reject);
                });
                return;
            }

            try {
                // 停止当前播放
                speechSynthesis.cancel();

                const utterance = new SpeechSynthesisUtterance(text);
                
                // 设置参数
                utterance.lang = options.lang || 'en-US';
                utterance.rate = this.getOptimalRate();
                utterance.volume = options.volume || 0.9;
                utterance.pitch = options.pitch || 1.0;

                // 选择最佳语音
                const voice = this.selectBestVoice();
                if (voice) {
                    utterance.voice = voice;
                    console.log(`使用语音: ${voice.name} (${voice.lang})`);
                }

                // 事件处理
                utterance.onstart = () => {
                    console.log(`开始播放: "${text}"`);
                };

                utterance.onend = () => {
                    console.log(`播放完成: "${text}"`);
                    resolve();
                };

                utterance.onerror = (event) => {
                    console.error(`语音播放错误: ${event.error}`);
                    reject(new Error(`语音播放失败: ${event.error}`));
                };

                // 平台特定的播放策略
                this.executeSpeech(utterance);

            } catch (error) {
                console.error('语音播放异常:', error);
                reject(error);
            }
        });
    }

    getOptimalRate() {
        // 根据平台调整语速
        switch (this.platform.type) {
            case 'ios':
                return 0.7; // iOS 语速稍慢一些
            case 'android':
                return 0.8; // Android 标准语速
            default:
                return 0.85; // 桌面端略快
        }
    }

    executeSpeech(utterance) {
        if (this.platform.type === 'ios') {
            // iOS 需要小延迟
            setTimeout(() => {
                speechSynthesis.speak(utterance);
            }, 100);
        } else if (this.platform.type === 'android') {
            // Android 可能需要重试机制
            this.speakWithRetry(utterance);
        } else {
            // 桌面端直接播放
            speechSynthesis.speak(utterance);
        }
    }

    speakWithRetry(utterance, maxRetries = 3) {
        let retryCount = 0;
        
        const attempt = () => {
            const originalOnError = utterance.onerror;
            
            utterance.onerror = (event) => {
                if (retryCount < maxRetries && event.error === 'network') {
                    retryCount++;
                    console.log(`语音播放重试 ${retryCount}/${maxRetries}`);
                    setTimeout(attempt, 500 * retryCount);
                } else {
                    originalOnError(event);
                }
            };
            
            speechSynthesis.speak(utterance);
        };
        
        attempt();
    }

    showInteractionPrompt(callback) {
        // 创建用户交互提示
        const promptHTML = `
            <div id="speech-interaction-prompt" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                backdrop-filter: blur(5px);
            ">
                <div style="
                    background: white;
                    padding: 2rem;
                    border-radius: 12px;
                    text-align: center;
                    max-width: 300px;
                    margin: 1rem;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                ">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🔊</div>
                    <h3 style="margin: 0 0 1rem 0; color: #333;">启用语音播放</h3>
                    <p style="margin: 0 0 1.5rem 0; color: #666; line-height: 1.5;">
                        点击下方按钮启用语音播放功能
                    </p>
                    <button id="enable-speech-btn" style="
                        width: 100%;
                        padding: 0.75rem;
                        background: #007bff;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        font-size: 1rem;
                        cursor: pointer;
                    ">启用语音</button>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', promptHTML);
        
        const prompt = document.getElementById('speech-interaction-prompt');
        const button = document.getElementById('enable-speech-btn');
        
        button.addEventListener('click', () => {
            this.hasUserInteracted = true;
            prompt.remove();
            this.warmUpSpeechEngine();
            callback();
        });

        // 5秒后自动关闭
        setTimeout(() => {
            if (prompt && prompt.parentNode) {
                prompt.remove();
            }
        }, 10000);
    }

    // 简单测试方法
    async test() {
        try {
            await this.speak('Hello, this is a speech test.');
            return true;
        } catch (error) {
            console.error('语音测试失败:', error);
            return false;
        }
    }

    // 获取支持状态信息
    getStatus() {
        return {
            isInitialized: this.isInitialized,
            hasUserInteracted: this.hasUserInteracted,
            voicesLoaded: this.voicesLoaded,
            voiceCount: this.voices.length,
            platform: this.platform,
            speechSynthesisAvailable: 'speechSynthesis' in window
        };
    }
}

// 全局初始化
let universalSpeech;

document.addEventListener('DOMContentLoaded', () => {
    universalSpeech = new UniversalSpeech();
    window.universalSpeech = universalSpeech;
    
    console.log('UniversalSpeech 状态:', universalSpeech.getStatus());
});

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UniversalSpeech;
} else {
    window.UniversalSpeech = UniversalSpeech;
} 