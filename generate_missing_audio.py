#!/usr/bin/env python3
"""
检查并生成缺失的音频文件
确保所有词汇都有对应的音频播报功能
"""

import os
import subprocess
import sys
import time
from complete_vocabulary_list import complete_vocabulary, vocabulary_mapping

# 音频生成配置
AUDIO_CONFIG = {
    "voice": "Alex",           # macOS高质量英语男声
    "rate": "170",             # 语速 (单词/分钟)
    "output_format": "wav",    # 输出格式
    "output_directory": "audio",
    "quality": "high"          # 高质量设置
}

def check_existing_audio_files():
    """检查已存在的音频文件"""
    audio_dir = AUDIO_CONFIG["output_directory"]
    if not os.path.exists(audio_dir):
        return set()
    
    existing_files = set()
    for filename in os.listdir(audio_dir):
        if filename.endswith('.wav'):
            # 去掉扩展名
            name = filename[:-4]
            existing_files.add(name)
    
    return existing_files

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

def generate_missing_audio():
    """生成缺失的音频文件"""
    print("🔍 检查缺失的音频文件...")
    
    # 确保输出目录存在
    os.makedirs(AUDIO_CONFIG["output_directory"], exist_ok=True)
    
    # 检查已存在的文件
    existing_files = check_existing_audio_files()
    print(f"📂 已存在音频文件: {len(existing_files)} 个")
    
    # 检查缺失的词汇
    missing_words = []
    for word in complete_vocabulary:
        expected_filename = clean_filename(word)
        if expected_filename not in existing_files:
            missing_words.append(word)
    
    print(f"❌ 缺失音频文件: {len(missing_words)} 个")
    
    if not missing_words:
        print("✅ 所有词汇都已有音频文件!")
        return
    
    print(f"\n🎵 开始生成缺失的音频文件...")
    print("=" * 60)
    
    success_count = 0
    fail_count = 0
    start_time = time.time()
    
    for i, word in enumerate(missing_words):
        print(f"[{i+1:2d}/{len(missing_words)}] 生成: {word}")
        
        clean_name = clean_filename(word)
        output_file = os.path.join(AUDIO_CONFIG["output_directory"], f"{clean_name}.{AUDIO_CONFIG['output_format']}")
        
        try:
            if sys.platform == "darwin":
                success, message = generate_audio_macos(word, output_file)
            else:
                print(f"  ⚠️  当前系统 ({sys.platform}) 暂不支持，请使用macOS")
                continue
            
            if success:
                try:
                    file_size = os.path.getsize(output_file)
                    print(f"  ✅ 成功 ({file_size:,} bytes): {clean_name}.{AUDIO_CONFIG['output_format']}")
                    success_count += 1
                except:
                    print(f"  ✅ 成功: {clean_name}.{AUDIO_CONFIG['output_format']}")
                    success_count += 1
            else:
                print(f"  ❌ 失败: {message}")
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
    print(f"  ✅ 成功生成: {success_count}")
    print(f"  ❌ 生成失败: {fail_count}")
    print(f"  📈 总计处理: {len(missing_words)}")
    print(f"  ⏱️  耗时: {end_time - start_time:.1f} 秒")
    
    # 再次检查完整性
    check_completeness()

def check_completeness():
    """检查音频文件完整性"""
    print("\n🔍 检查音频文件完整性...")
    
    existing_files = check_existing_audio_files()
    total_needed = len(complete_vocabulary)
    total_existing = 0
    missing_words = []
    
    for word in complete_vocabulary:
        expected_filename = clean_filename(word)
        if expected_filename in existing_files:
            total_existing += 1
        else:
            missing_words.append(word)
    
    completion_rate = (total_existing / total_needed) * 100
    
    print(f"📊 完整性报告:")
    print(f"  📝 总词汇数: {total_needed}")
    print(f"  ✅ 已有音频: {total_existing}")
    print(f"  ❌ 缺失音频: {len(missing_words)}")
    print(f"  📈 完成率: {completion_rate:.1f}%")
    
    if missing_words:
        print(f"\n❌ 仍然缺失的词汇:")
        for word in missing_words:
            print(f"  - {word}")
    else:
        print(f"\n🎉 所有词汇都有音频文件了!")

def list_audio_files():
    """列出所有音频文件"""
    audio_dir = AUDIO_CONFIG["output_directory"]
    if not os.path.exists(audio_dir):
        print("音频目录不存在")
        return
    
    files = [f for f in os.listdir(audio_dir) if f.endswith('.wav')]
    print(f"\n📁 音频文件列表 ({len(files)} 个):")
    
    total_size = 0
    for f in sorted(files):
        file_path = os.path.join(audio_dir, f)
        size = os.path.getsize(file_path)
        total_size += size
        print(f"  🎵 {f} ({size:,} bytes)")
    
    if total_size > 0:
        print(f"\n📦 总大小: {total_size:,} bytes ({total_size/1024/1024:.1f} MB)")

def main():
    """主函数"""
    print("🎵 音频文件完整性检查和生成工具")
    print("=" * 60)
    
    print(f"📚 词汇总数: {len(complete_vocabulary)}")
    print(f"💻 操作系统: {sys.platform}")
    print(f"📁 音频目录: {AUDIO_CONFIG['output_directory']}")
    
    # 检查系统要求
    if sys.platform != "darwin":
        print("⚠️  此脚本目前只支持macOS系统")
        print("   建议使用MiniMax API生成音频")
        return
    
    # 生成缺失的音频
    generate_missing_audio()
    
    # 列出所有文件
    list_audio_files()

if __name__ == "__main__":
    main() 