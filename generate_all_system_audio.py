#!/usr/bin/env python3
"""
使用增强的系统TTS为所有词汇生成高质量英语发音音频
支持macOS、Linux和Windows多平台
"""

import os
import subprocess
import sys
import time
from words_list import all_vocabulary

# 音频生成配置
AUDIO_CONFIG = {
    "voice": "Alex",           # macOS高质量英语男声
    "rate": "170",             # 语速 (单词/分钟)
    "output_format": "wav",    # 输出格式
    "output_directory": "audio",
    "quality": "high"          # 高质量设置
}

def clean_filename(word):
    """清理文件名，移除特殊字符"""
    import re
    # 替换空格和特殊字符为下划线
    clean = re.sub(r'[^a-zA-Z0-9\-]', '_', word.lower())
    # 移除连续的下划线
    clean = re.sub(r'_+', '_', clean)
    # 移除开头和结尾的下划线
    clean = clean.strip('_')
    return clean

def generate_audio_macos(word, output_file):
    """使用macOS的say命令生成音频"""
    try:
        # 使用高质量设置
        cmd = [
            "say",
            "-v", AUDIO_CONFIG["voice"],
            "-r", AUDIO_CONFIG["rate"],
            "-o", output_file,
            "--data-format=LEI16@22050",  # 高质量音频格式
            word
        ]
        
        result = subprocess.run(cmd, check=True, capture_output=True, text=True)
        return True, "成功"
        
    except subprocess.CalledProcessError as e:
        return False, f"say命令失败: {e}"
    except Exception as e:
        return False, f"生成失败: {str(e)}"

def generate_audio_linux(word, output_file):
    """使用Linux的espeak-ng生成音频"""
    try:
        cmd = [
            "espeak-ng",
            "-v", "en-us+f3",      # 美式英语女声
            "-s", "150",           # 语速
            "-a", "100",           # 音量
            "-w", output_file,     # 输出文件
            word
        ]
        
        result = subprocess.run(cmd, check=True, capture_output=True, text=True)
        return True, "成功"
        
    except FileNotFoundError:
        return False, "espeak-ng未安装"
    except subprocess.CalledProcessError as e:
        return False, f"espeak-ng失败: {e}"
    except Exception as e:
        return False, f"生成失败: {str(e)}"

def generate_audio_windows(word, output_file):
    """使用Windows的PowerShell SAPI生成音频"""
    try:
        # PowerShell脚本使用SAPI
        ps_script = f'''
        Add-Type -AssemblyName System.Speech
        $synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
        $synth.SelectVoice("Microsoft Zira Desktop")
        $synth.Rate = 0
        $synth.SetOutputToWaveFile("{output_file}")
        $synth.Speak("{word}")
        $synth.Dispose()
        '''
        
        cmd = ["powershell", "-Command", ps_script]
        result = subprocess.run(cmd, check=True, capture_output=True, text=True)
        return True, "成功"
        
    except subprocess.CalledProcessError as e:
        return False, f"PowerShell失败: {e}"
    except Exception as e:
        return False, f"生成失败: {str(e)}"

def generate_audio_for_word(word, index, total):
    """为单个单词生成音频（跨平台）"""
    print(f"[{index+1:2d}/{total}] 生成音频: {word}")
    
    # 清理文件名
    clean_name = clean_filename(word)
    output_file = os.path.join(AUDIO_CONFIG["output_directory"], f"{clean_name}.{AUDIO_CONFIG['output_format']}")
    
    # 检查文件是否已存在
    if os.path.exists(output_file):
        file_size = os.path.getsize(output_file)
        print(f"  ⚠️  已存在 ({file_size} bytes): {clean_name}.{AUDIO_CONFIG['output_format']}")
        return True, "文件已存在"
    
    # 根据操作系统选择生成方法
    if sys.platform == "darwin":
        success, message = generate_audio_macos(word, output_file)
    elif sys.platform.startswith("linux"):
        success, message = generate_audio_linux(word, output_file)
    elif sys.platform == "win32":
        success, message = generate_audio_windows(word, output_file)
    else:
        return False, f"不支持的操作系统: {sys.platform}"
    
    if success:
        try:
            file_size = os.path.getsize(output_file)
            print(f"  ✅ 成功 ({file_size} bytes): {clean_name}.{AUDIO_CONFIG['output_format']}")
        except:
            print(f"  ✅ 成功: {clean_name}.{AUDIO_CONFIG['output_format']}")
    else:
        print(f"  ❌ 失败: {message}")
    
    return success, message

def check_system_requirements():
    """检查系统要求"""
    print("🔍 检查系统要求...")
    
    if sys.platform == "darwin":
        # macOS - say命令应该总是可用的
        try:
            result = subprocess.run(["say", "--help"], capture_output=True, text=True)
            print(f"  ✅ macOS say命令可用")
            return True
        except:
            print(f"  ❌ macOS say命令不可用")
            return False
            
    elif sys.platform.startswith("linux"):
        # Linux - 检查espeak-ng
        try:
            result = subprocess.run(["espeak-ng", "--version"], capture_output=True, text=True)
            print(f"  ✅ Linux espeak-ng可用")
            return True
        except FileNotFoundError:
            print(f"  ❌ Linux espeak-ng未安装")
            print(f"     安装命令: sudo apt-get install espeak-ng")
            return False
            
    elif sys.platform == "win32":
        # Windows - PowerShell应该可用
        try:
            result = subprocess.run(["powershell", "-Command", "Get-Host"], capture_output=True, text=True)
            print(f"  ✅ Windows PowerShell可用")
            return True
        except:
            print(f"  ❌ Windows PowerShell不可用")
            return False
    
    return False

def main():
    """主函数"""
    print("🎵 高质量英语词汇音频生成器 (系统TTS版)")
    print("=" * 60)
    
    # 检查系统要求
    if not check_system_requirements():
        print("⚠️  系统要求不满足，无法继续")
        return
    
    # 确保输出目录存在
    os.makedirs(AUDIO_CONFIG["output_directory"], exist_ok=True)
    
    print(f"📁 输出目录: {AUDIO_CONFIG['output_directory']}")
    print(f"🔊 语音配置: {AUDIO_CONFIG['voice']} (语速: {AUDIO_CONFIG['rate']})")
    print(f"🎼 输出格式: {AUDIO_CONFIG['output_format']}")
    print(f"📊 总词汇数: {len(all_vocabulary)}")
    print(f"💻 操作系统: {sys.platform}")
    print("=" * 60)
    
    # 统计信息
    success_count = 0
    skip_count = 0
    fail_count = 0
    
    start_time = time.time()
    
    # 为每个单词生成音频
    for i, word in enumerate(all_vocabulary):
        try:
            success, message = generate_audio_for_word(word, i, len(all_vocabulary))
            if success:
                if "已存在" in message:
                    skip_count += 1
                else:
                    success_count += 1
            else:
                fail_count += 1
                
        except KeyboardInterrupt:
            print("\n⏹️  用户中断，停止生成")
            break
        except Exception as e:
            print(f"  💥 意外错误: {word} - {str(e)}")
            fail_count += 1
    
    end_time = time.time()
    
    # 最终统计
    print("\n" + "=" * 60)
    print("📊 生成统计:")
    print(f"  ✅ 新生成: {success_count}")
    print(f"  ⚠️  已跳过: {skip_count}")
    print(f"  ❌ 失败: {fail_count}")
    print(f"  📈 总计: {len(all_vocabulary)}")
    print(f"  ⏱️  耗时: {end_time - start_time:.1f} 秒")
    
    if success_count > 0 or skip_count > 0:
        print(f"\n🎉 音频文件位置: {AUDIO_CONFIG['output_directory']}/")
        print("💡 网站会自动检测并使用这些高质量音频文件")

def list_generated_files():
    """列出已生成的音频文件"""
    audio_dir = AUDIO_CONFIG["output_directory"]
    if not os.path.exists(audio_dir):
        print("音频目录不存在")
        return
    
    files = [f for f in os.listdir(audio_dir) if f.endswith(('.wav', '.mp3'))]
    print(f"\n📁 已生成的音频文件 ({len(files)} 个):")
    
    total_size = 0
    for f in sorted(files):
        file_path = os.path.join(audio_dir, f)
        size = os.path.getsize(file_path)
        total_size += size
        print(f"  🎵 {f} ({size:,} bytes)")
    
    if total_size > 0:
        print(f"\n📦 总大小: {total_size:,} bytes ({total_size/1024/1024:.1f} MB)")

if __name__ == "__main__":
    main()
    list_generated_files() 