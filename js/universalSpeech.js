// 增强的通用语音播放解决方案 - 多层级fallback机制
class UniversalSpeech {
    constructor() {
        this.isInitialized = false;
        this.hasUserInteracted = false;
        this.voicesLoaded = false;
        this.voices = [];
        this.pendingSpeech = null;
        
        // 设备和浏览器检测
        this.platform = this.detectPlatform();
        this.compatibility = this.checkCompatibility();
        
        // 音频文件缓存
        this.audioCache = new Map();
        this.audioSupported = this.checkAudioSupport();
        
        // 初始化
        this.init();
    }

    detectPlatform() {
        const ua = navigator.userAgent;
        
        if (/iPhone|iPad|iPod/i.test(ua)) {
            return { 
                type: 'ios', 
                name: 'iOS Safari',
                isMobile: true,
                // iOS Safari 对 Web Speech API 支持有限
                speechSupport: 'limited' 
            };
        } else if (/Android/i.test(ua)) {
            const isChrome = /Chrome/i.test(ua);
            return { 
                type: 'android', 
                name: isChrome ? 'Android Chrome' : 'Android Browser',
                isMobile: true,
                // Android Chrome 支持较好，其他Android浏览器支持有限
                speechSupport: isChrome ? 'good' : 'limited'
            };
        } else if (/Chrome/i.test(ua)) {
            return { 
                type: 'chrome', 
                name: 'Chrome Desktop',
                isMobile: false,
                speechSupport: 'excellent'
            };
        } else if (/Firefox/i.test(ua)) {
            return { 
                type: 'firefox', 
                name: 'Firefox',
                isMobile: false,
                speechSupport: 'good'
            };
        } else if (/Safari/i.test(ua)) {
            return { 
                type: 'safari', 
                name: 'Safari Desktop',
                isMobile: false,
                speechSupport: 'good'
            };
        } else if (/Edge/i.test(ua)) {
            return { 
                type: 'edge', 
                name: 'Microsoft Edge',
                isMobile: false,
                speechSupport: 'good'
            };
        }
        
        return { 
            type: 'unknown', 
            name: 'Unknown Browser',
            isMobile: /Mobile|Android|iPhone|iPad/i.test(ua),
            speechSupport: 'unknown'
        };
    }

    checkCompatibility() {
        const compatibility = {
            speechSynthesis: 'speechSynthesis' in window,
            speechSynthesisUtterance: 'SpeechSynthesisUtterance' in window,
            audioContext: 'AudioContext' in window || 'webkitAudioContext' in window,
            htmlAudio: 'Audio' in window,
            fetch: 'fetch' in window
        };

        console.log('浏览器兼容性检查:', compatibility);
        return compatibility;
    }

    checkAudioSupport() {
        try {
            const audio = new Audio();
            return {
                supported: true,
                canPlayMP3: audio.canPlayType('audio/mpeg') !== '',
                canPlayOGG: audio.canPlayType('audio/ogg') !== '',
                canPlayWAV: audio.canPlayType('audio/wav') !== ''
            };
        } catch (error) {
            return { supported: false };
        }
    }

    init() {
        console.log(`增强语音系统初始化 - 平台: ${this.platform.name}, 语音支持: ${this.platform.speechSupport}`);
        
        // 监听用户首次交互
        this.setupUserInteractionListener();
        
        // 根据兼容性选择初始化策略
        if (this.compatibility.speechSynthesis) {
            this.loadVoices();
        }
        
        // 预加载常用词汇的音频文件
        this.preloadCommonAudio();
        
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
            
            // 预热各种音频引擎
            this.warmUpAudioEngines();
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

    // 预加载常用词汇音频
    async preloadCommonAudio() {
        // 这里可以预加载一些常用词汇的音频文件
        // 例如: algorithm, computer, programming, network等
        const commonWords = ['algorithm', 'computer', 'programming', 'network', 'data', 'function'];
        
        for (const word of commonWords) {
            this.loadAudioFile(word);
        }
    }

    // 加载音频文件
    async loadAudioFile(word) {
        if (!this.audioSupported.supported) return null;
        
        try {
            // 尝试不同的音频格式，优先WAV格式
            const formats = [];
            if (this.audioSupported.canPlayWAV) formats.push('wav');
            if (this.audioSupported.canPlayMP3) formats.push('mp3');
            if (this.audioSupported.canPlayOGG) formats.push('ogg');
            
            for (const format of formats) {
                try {
                    const audioUrl = `../audio/${word}.${format}`;
                    const audio = new Audio(audioUrl);
                    
                    // 测试是否可以加载
                    await new Promise((resolve, reject) => {
                        audio.addEventListener('canplaythrough', resolve, { once: true });
                        audio.addEventListener('error', reject, { once: true });
                        audio.load();
                        
                        // 超时处理
                        setTimeout(() => reject(new Error('Audio load timeout')), 3000);
                    });
                    
                    this.audioCache.set(word, audio);
                    console.log(`音频文件加载成功: ${word}.${format}`);
                    return audio;
                } catch (error) {
                    // 继续尝试下一个格式
                    continue;
                }
            }
        } catch (error) {
            console.log(`音频文件加载失败: ${word}`, error);
        }
        
        return null;
    }

    warmUpAudioEngines() {
        // 预热Web Speech API
        if (this.compatibility.speechSynthesis) {
            this.warmUpSpeechEngine();
        }
        
        // 预热HTML5 Audio
        if (this.audioSupported.supported) {
            this.warmUpHtmlAudio();
        }
    }

    warmUpSpeechEngine() {
        if (!this.hasUserInteracted) return;
        
        try {
            const utterance = new SpeechSynthesisUtterance(' ');
            utterance.volume = 0.01;
            utterance.rate = 2;
            
            utterance.onend = () => {
                console.log('Web Speech API 预热完成');
            };
            
            speechSynthesis.speak(utterance);
        } catch (error) {
            console.warn('Web Speech API 预热失败:', error);
        }
    }

    warmUpHtmlAudio() {
        try {
            // 创建一个极短的静音音频进行预热
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.01);
            
            console.log('HTML5 Audio 预热完成');
        } catch (error) {
            console.warn('HTML5 Audio 预热失败:', error);
        }
    }

    async speak(text, options = {}) {
        return new Promise(async (resolve, reject) => {
            if (!this.isInitialized) {
                reject(new Error('UniversalSpeech 未初始化'));
                return;
            }

            if (!this.hasUserInteracted) {
                this.showInteractionPrompt(() => {
                    this.speak(text, options).then(resolve).catch(reject);
                });
                return;
            }

            // 尝试多种方法播放语音
            const methods = this.getSpeechMethods();
            
            for (const method of methods) {
                try {
                    console.log(`尝试使用 ${method.name} 播放: "${text}"`);
                    await method.execute(text, options);
                    console.log(`${method.name} 播放成功`);
                    resolve();
                    return;
                } catch (error) {
                    console.warn(`${method.name} 播放失败:`, error);
                    continue;
                }
            }
            
            // 所有方法都失败了
            console.error('所有语音播放方法都失败了');
            this.showFallbackMessage(text);
            reject(new Error('语音播放不可用'));
        });
    }

    getSpeechMethods() {
        const methods = [];
        
        // 方法1: 音频文件
        if (this.audioSupported.supported) {
            methods.push({
                name: 'HTML5 Audio File',
                execute: (text) => this.playAudioFile(text)
            });
        }
        
        // 方法2: Web Speech API
        if (this.compatibility.speechSynthesis && this.platform.speechSupport !== 'none') {
            methods.push({
                name: 'Web Speech API',
                execute: (text, options) => this.playSpeechSynthesis(text, options)
            });
        }
        
        // 方法3: 在线TTS服务 (如果需要的话)
        if (this.compatibility.fetch) {
            methods.push({
                name: 'Online TTS Service',
                execute: (text) => this.playOnlineTTS(text)
            });
        }
        
        return methods;
    }

    // 播放音频文件
    async playAudioFile(text) {
        const word = text.toLowerCase().trim();
        
        // 检查缓存
        if (this.audioCache.has(word)) {
            const audio = this.audioCache.get(word);
            audio.currentTime = 0;
            await audio.play();
            return;
        }
        
        // 尝试加载音频文件
        const audio = await this.loadAudioFile(word);
        if (audio) {
            await audio.play();
            return;
        }
        
        throw new Error('音频文件不可用');
    }

    // 使用Web Speech API播放
    async playSpeechSynthesis(text, options = {}) {
        return new Promise((resolve, reject) => {
            if (!this.compatibility.speechSynthesis) {
                reject(new Error('Web Speech API 不支持'));
                return;
            }

            try {
                speechSynthesis.cancel();

                const utterance = new SpeechSynthesisUtterance(text);
                
                utterance.lang = options.lang || 'en-US';
                utterance.rate = this.getOptimalRate();
                utterance.volume = options.volume || 0.9;
                utterance.pitch = options.pitch || 1.0;

                const voice = this.selectBestVoice();
                if (voice) {
                    utterance.voice = voice;
                }

                utterance.onend = () => resolve();
                utterance.onerror = (event) => {
                    reject(new Error(`Web Speech API 错误: ${event.error}`));
                };

                this.executeSpeech(utterance);

            } catch (error) {
                reject(error);
            }
        });
    }

    // 在线TTS服务 (示例实现)
    async playOnlineTTS(text) {
        // 这里可以实现调用在线TTS服务
        // 例如: Google Cloud TTS, Amazon Polly等
        // 由于需要API密钥，这里只是一个示例框架
        
        throw new Error('在线TTS服务未配置');
    }

    selectBestVoice() {
        if (!this.voicesLoaded || this.voices.length === 0) {
            return null;
        }

        const englishVoices = this.voices.filter(voice => 
            voice.lang.toLowerCase().includes('en')
        );

        if (englishVoices.length === 0) {
            return this.voices[0];
        }

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
        const preferred = ['Samantha', 'Alex', 'Victoria', 'Allison'];
        
        for (const name of preferred) {
            const voice = voices.find(v => v.name.includes(name));
            if (voice) return voice;
        }
        
        return voices.find(v => v.lang === 'en-US') || voices[0];
    }

    selectAndroidVoice(voices) {
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
        const preferred = ['Microsoft', 'Google', 'Alex', 'Samantha'];
        
        for (const name of preferred) {
            const voice = voices.find(v => v.name.includes(name));
            if (voice) return voice;
        }
        
        return voices.find(v => v.lang === 'en-US') || voices[0];
    }

    getOptimalRate() {
        switch (this.platform.type) {
            case 'ios':
                return 0.7;
            case 'android':
                return 0.8;
            default:
                return 0.85;
        }
    }

    executeSpeech(utterance) {
        if (this.platform.type === 'ios') {
            setTimeout(() => {
                speechSynthesis.speak(utterance);
            }, 100);
        } else if (this.platform.type === 'android') {
            this.speakWithRetry(utterance);
        } else {
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
                    max-width: 320px;
                    margin: 1rem;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                ">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🔊</div>
                    <h3 style="margin: 0 0 1rem 0; color: #333;">启用语音播放</h3>
                    <p style="margin: 0 0 1.5rem 0; color: #666; line-height: 1.5;">
                        ${this.platform.isMobile ? '移动设备需要用户交互后才能播放语音' : '点击下方按钮启用语音播放功能'}
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
            this.warmUpAudioEngines();
            callback();
        });

        setTimeout(() => {
            if (prompt && prompt.parentNode) {
                prompt.remove();
            }
        }, 10000);
    }

    showFallbackMessage(text) {
        const messageHTML = `
            <div id="speech-fallback-message" style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: #f8f9fa;
                border: 1px solid #dee2e6;
                border-radius: 8px;
                padding: 1rem;
                max-width: 300px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                z-index: 9999;
            ">
                <div style="display: flex; align-items: center; margin-bottom: 0.5rem;">
                    <i class="fas fa-info-circle" style="color: #007bff; margin-right: 0.5rem;"></i>
                    <strong>语音播放不可用</strong>
                </div>
                <p style="margin: 0; color: #666; font-size: 0.9rem;">
                    单词: <strong>${text}</strong><br>
                    您的浏览器暂不支持语音播放功能
                </p>
                <div style="margin-top: 0.5rem; font-size: 0.8rem; color: #999;">
                    建议使用Chrome或Firefox浏览器
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', messageHTML);
        
        const message = document.getElementById('speech-fallback-message');
        setTimeout(() => {
            if (message && message.parentNode) {
                message.remove();
            }
        }, 5000);
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
            compatibility: this.compatibility,
            audioSupported: this.audioSupported,
            audioCache: this.audioCache.size
        };
    }
}

// 全局初始化
let universalSpeech;

document.addEventListener('DOMContentLoaded', () => {
    universalSpeech = new UniversalSpeech();
    window.universalSpeech = universalSpeech;
    
    console.log('增强版 UniversalSpeech 状态:', universalSpeech.getStatus());
});

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UniversalSpeech;
} else {
    window.UniversalSpeech = UniversalSpeech;
} 