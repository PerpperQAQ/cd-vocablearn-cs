#!/usr/bin/env python3
"""
更新网站语音系统
检查音频文件完整性，更新映射，准备部署
"""

import os
import json
import shutil
from complete_vocabulary_list import complete_vocabulary, vocabulary_mapping

def check_audio_files():
    """检查音频文件完整性"""
    print("🔍 检查音频文件完整性...")
    
    audio_dir = "audio"
    missing_files = []
    existing_files = []
    
    for word in complete_vocabulary:
        # 从映射中获取文件名
        normalized_word = word.lower()
        if normalized_word in vocabulary_mapping:
            filename = vocabulary_mapping[normalized_word]
            file_path = os.path.join(audio_dir, filename)
            
            if os.path.exists(file_path):
                file_size = os.path.getsize(file_path)
                existing_files.append((word, filename, file_size))
            else:
                missing_files.append((word, filename))
    
    print(f"✅ 存在的音频文件: {len(existing_files)} 个")
    print(f"❌ 缺失的音频文件: {len(missing_files)} 个")
    
    if missing_files:
        print("\n缺失的音频文件:")
        for word, filename in missing_files:
            print(f"  - {word} -> {filename}")
    
    # 计算总大小
    total_size = sum(size for _, _, size in existing_files)
    print(f"\n📦 音频文件总大小: {total_size:,} bytes ({total_size/1024/1024:.1f} MB)")
    
    return len(missing_files) == 0, existing_files, missing_files

def generate_audio_mapping_js():
    """生成JavaScript音频映射文件"""
    print("📄 生成JavaScript音频映射文件...")
    
    js_content = '''// 音频文件映射 - 自动生成
// 包含所有74个词汇的音频文件映射

const AUDIO_FILE_MAPPING = {
'''
    
    for word in complete_vocabulary:
        normalized_word = word.lower()
        if normalized_word in vocabulary_mapping:
            filename = vocabulary_mapping[normalized_word]
            js_content += f'    "{normalized_word}": "{filename}",\n'
    
    js_content += '''};

// 导出映射
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AUDIO_FILE_MAPPING;
} else {
    window.AUDIO_FILE_MAPPING = AUDIO_FILE_MAPPING;
}
'''

    with open('js/audioMapping.js', 'w', encoding='utf-8') as f:
        f.write(js_content)
    
    print(f"✅ 已生成: js/audioMapping.js")

def main():
    """主函数"""
    print("🎵 更新网站语音系统")
    print("=" * 60)
    
    # 1. 检查音频文件
    audio_complete, existing_files, missing_files = check_audio_files()
    
    # 2. 生成JS映射文件
    generate_audio_mapping_js()
    
    # 3. 总结
    print("\n" + "=" * 60)
    print("📊 语音系统更新总结:")
    print(f"  📚 总词汇数: {len(complete_vocabulary)}")
    print(f"  🎵 音频文件: {len(existing_files)}/{len(complete_vocabulary)}")
    print(f"  📁 文件映射: js/audioMapping.js")
    print(f"  📄 测试页面: test_speech.html")
    
    if audio_complete:
        print(f"\n🎉 语音系统完整！所有 {len(complete_vocabulary)} 个词汇都有音频文件")
        print("✅ 可以进行部署")
        
        print(f"\n📋 下一步操作:")
        print(f"  1. 打开 test_speech.html 测试语音功能")
        print(f"  2. 确认所有词汇都能正常播放")
        print(f"  3. 运行 ./deploy.sh 部署到GitHub Pages")
    else:
        print(f"\n⚠️  发现 {len(missing_files)} 个缺失的音频文件")
        print(f"💡 建议运行: python3 generate_missing_audio.py")

if __name__ == "__main__":
    main() 