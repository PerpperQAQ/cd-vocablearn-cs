// 语音功能降级方案
class SpeechFallback {
    constructor() {
        this.isSupported = this.checkSupport();
        this.voices = [];
        this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        this.isAndroid = /Android/.test(navigator.userAgent);
        
        if (this.isSupported) {
            this.loadVoices();
        }
    }

    checkSupport() {
        return 'speechSynthesis' in window;
    }

    loadVoices() {
        const loadVoiceList = () => {
            this.voices = speechSynthesis.getVoices();
            console.log('已加载语音:', this.voices.length);
        };

        // 初始化语音列表
        loadVoiceList();

        // 监听语音加载完成事件
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = loadVoiceList;
        }
    }

    getEnglishVoice() {
        if (!this.voices.length) return null;

        // 优先选择英语语音
        const englishVoices = this.voices.filter(voice => 
            voice.lang.includes('en') || voice.lang.includes('US') || voice.lang.includes('GB')
        );

        if (englishVoices.length > 0) {
            // 根据平台选择最适合的语音
            if (this.isIOS) {
                return englishVoices.find(v => v.name.includes('Samantha')) || 
                       englishVoices.find(v => v.name.includes('Alex')) || 
                       englishVoices[0];
            } else if (this.isAndroid) {
                return englishVoices.find(v => v.name.includes('English')) || 
                       englishVoices[0];
            } else {
                return englishVoices.find(v => v.name.includes('Microsoft')) || 
                       englishVoices.find(v => v.name.includes('Google')) || 
                       englishVoices[0];
            }
        }

        return this.voices[0]; // 返回默认语音
    }

    speak(text, options = {}) {
        if (!this.isSupported) {
            console.warn('语音合成不支持');
            return Promise.reject(new Error('Speech synthesis not supported'));
        }

        return new Promise((resolve, reject) => {
            try {
                // 停止当前播放
                speechSynthesis.cancel();

                const utterance = new SpeechSynthesisUtterance(text);
                
                // 设置语音参数
                utterance.lang = options.lang || 'en-US';
                utterance.rate = options.rate || (this.isIOS ? 0.7 : 0.8);
                utterance.volume = options.volume || 0.9;
                utterance.pitch = options.pitch || 1.0;

                // 选择合适的语音
                const voice = this.getEnglishVoice();
                if (voice) {
                    utterance.voice = voice;
                }

                // 事件处理
                utterance.onstart = () => {
                    console.log('语音播放开始:', text);
                    resolve();
                };

                utterance.onend = () => {
                    console.log('语音播放结束:', text);
                };

                utterance.onerror = (event) => {
                    console.error('语音播放错误:', event.error);
                    reject(new Error(`Speech error: ${event.error}`));
                };

                // 移动端需要稍微延迟播放
                if (this.isIOS || this.isAndroid) {
                    setTimeout(() => {
                        speechSynthesis.speak(utterance);
                    }, 100);
                } else {
                    speechSynthesis.speak(utterance);
                }

            } catch (error) {
                console.error('语音播放异常:', error);
                reject(error);
            }
        });
    }

    // 静态方法，供全局使用
    static createInstance() {
        if (!window.speechFallback) {
            window.speechFallback = new SpeechFallback();
        }
        return window.speechFallback;
    }

    // 测试语音功能
    test() {
        return this.speak('Hello, this is a test.').then(() => {
            console.log('语音测试成功');
            return true;
        }).catch((error) => {
            console.log('语音测试失败:', error);
            return false;
        });
    }
}

// 全局初始化
document.addEventListener('DOMContentLoaded', () => {
    SpeechFallback.createInstance();
});

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SpeechFallback;
} else {
    window.SpeechFallback = SpeechFallback;
} 