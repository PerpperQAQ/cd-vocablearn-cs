#!/usr/bin/env python3
"""
生成英语词汇音频文件
使用系统TTS功能为常用计算机科学词汇生成发音文件
"""

import os
import subprocess
import sys

def create_audio_file(word, output_dir="audio"):
    """使用系统TTS生成音频文件"""
    
    # 确保输出目录存在
    os.makedirs(output_dir, exist_ok=True)
    
    try:
        # 检查是否是macOS系统
        if sys.platform == "darwin":
            # 使用macOS的say命令生成WAV文件
            output_file = os.path.join(output_dir, f"{word}.wav")
            
            # 直接生成WAV文件（macOS say命令支持）
            subprocess.run([
                "say", 
                "-v", "Alex",  # 使用Alex语音
                "-o", output_file,
                "--data-format=LEI16@22050",  # 设置音频格式
                word
            ], check=True)
            
        elif sys.platform.startswith("linux"):
            # Linux系统使用espeak
            output_file = os.path.join(output_dir, f"{word}.wav")
            subprocess.run([
                "espeak",
                "-v", "en-us",
                "-s", "150",  # 语速
                "-w", output_file,
                word
            ], check=True)
            
        elif sys.platform.startswith("win"):
            # Windows系统提示
            print(f"Windows系统需要安装额外的TTS工具来生成 {word} 的音频文件")
            return False
            
        print(f"✓ 成功生成音频文件: {output_file}")
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"✗ 生成 {word} 音频文件失败: {e}")
        return False
    except FileNotFoundError as e:
        print(f"✗ 找不到所需的命令行工具: {e}")
        print("请确保安装了 'say' (macOS) 或 'espeak' (Linux)")
        return False

def main():
    """主函数"""
    # 常用的计算机科学词汇（选择最重要的20个）
    common_words = [
        # 最基础的词汇
        "algorithm", "computer", "programming", "network", "data", 
        "function", "variable", "array", "string", "integer",
        
        # 重要概念
        "class", "object", "method", "interface", "protocol",
        "server", "client", "api", "database", "system"
    ]
    
    print("开始生成英语词汇音频文件...")
    print(f"计划生成 {len(common_words)} 个词汇的音频文件")
    print("-" * 50)
    
    success_count = 0
    
    for i, word in enumerate(common_words, 1):
        print(f"[{i}/{len(common_words)}] 正在生成: {word}")
        if create_audio_file(word):
            success_count += 1
    
    print("-" * 50)
    print(f"音频文件生成完成！")
    print(f"成功: {success_count}/{len(common_words)} 个文件")
    
    if success_count > 0:
        print(f"\n音频文件已保存到 'audio' 目录")
        print("这些文件将作为语音播放的fallback选项")

if __name__ == "__main__":
    main() 