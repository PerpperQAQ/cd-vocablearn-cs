#!/usr/bin/env python3
"""
提取所有词汇文件中的单词
从网站的词汇数据文件中提取所有单词以生成音频文件
"""

import re
import os

def extract_words_from_js_file(file_path):
    """从JavaScript文件中提取单词"""
    words = []
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # 使用正则表达式查找所有的 term: "xxx" 模式
        pattern = r'term:\s*"([^"]+)"'
        matches = re.findall(pattern, content)
        
        for match in matches:
            # 清理单词，移除特殊字符但保留连字符和斜杠
            word = match.strip()
            # 转换为适合文件名的格式（小写，替换特殊字符）
            clean_word = re.sub(r'[^a-zA-Z0-9\-]', '_', word.lower())
            words.append({
                'original': word,
                'clean': clean_word,
                'file': file_path
            })
            
    except Exception as e:
        print(f"读取文件 {file_path} 时出错: {e}")
    
    return words

def main():
    """主函数"""
    data_dir = "data"
    all_words = []
    
    # 词汇文件列表
    vocab_files = [
        "computer-science_terms.js",
        "programming_terms.js", 
        "artificial-intelligence_terms.js",
        "internet_terms.js"
    ]
    
    print("提取词汇文件中的所有单词...")
    print("=" * 60)
    
    for filename in vocab_files:
        file_path = os.path.join(data_dir, filename)
        if os.path.exists(file_path):
            words = extract_words_from_js_file(file_path)
            all_words.extend(words)
            print(f"{filename}: 找到 {len(words)} 个单词")
        else:
            print(f"文件不存在: {file_path}")
    
    print("=" * 60)
    print(f"总计: {len(all_words)} 个单词")
    
    # 去重并排序
    unique_words = {}
    for word_info in all_words:
        clean_word = word_info['clean']
        if clean_word not in unique_words:
            unique_words[clean_word] = word_info
        
    print(f"去重后: {len(unique_words)} 个唯一单词")
    
    # 保存单词列表到文件
    with open("all_words.txt", "w", encoding="utf-8") as f:
        f.write("# 所有需要生成音频的单词\n")
        f.write(f"# 总计: {len(unique_words)} 个单词\n\n")
        
        for clean_word, word_info in sorted(unique_words.items()):
            f.write(f"{word_info['original']} -> {clean_word}\n")
    
    # 生成Python列表格式
    with open("words_list.py", "w", encoding="utf-8") as f:
        f.write("# 所有单词的Python列表\n")
        f.write("all_vocabulary = [\n")
        for clean_word, word_info in sorted(unique_words.items()):
            f.write(f'    "{word_info["original"]}",  # {clean_word}\n')
        f.write("]\n")
    
    print("\n单词列表已保存到:")
    print("- all_words.txt (详细列表)")
    print("- words_list.py (Python格式)")
    
    # 显示前20个单词示例
    print(f"\n前20个单词示例:")
    for i, (clean_word, word_info) in enumerate(sorted(unique_words.items())[:20]):
        print(f"{i+1:2d}. {word_info['original']} -> {clean_word}")
    
    return list(unique_words.values())

if __name__ == "__main__":
    words = main() 