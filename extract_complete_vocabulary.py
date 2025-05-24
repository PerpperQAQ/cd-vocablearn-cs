#!/usr/bin/env python3
"""
完整提取网站所有词汇和文本内容
包括单词本身、定义、例句等所有需要语音播报的内容
"""

import json
import re
import os

def clean_filename(text):
    """清理文件名，移除特殊字符"""
    # 替换空格和特殊字符为下划线
    clean = re.sub(r'[^a-zA-Z0-9\-]', '_', text.lower())
    # 移除连续的下划线
    clean = re.sub(r'_+', '_', clean)
    # 移除开头和结尾的下划线
    clean = clean.strip('_')
    return clean

def extract_terms_from_js_file(file_path):
    """从JS文件中提取词汇数据"""
    terms = []
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 使用正则表达式提取词汇对象
        # 匹配 { ... } 的完整对象
        object_pattern = r'\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}'
        matches = re.findall(object_pattern, content, re.DOTALL)
        
        for match in matches:
            try:
                # 提取关键字段
                term_match = re.search(r'term:\s*["\']([^"\']+)["\']', match)
                definition_match = re.search(r'definition:\s*["\']([^"\']+)["\']', match)
                example_match = re.search(r'example:\s*["\']([^"\']+)["\']', match)
                translation_match = re.search(r'translation:\s*["\']([^"\']+)["\']', match)
                explanation_match = re.search(r'explanation:\s*["\']([^"\']+)["\']', match)
                
                if term_match:
                    term_data = {
                        'term': term_match.group(1),
                        'definition': definition_match.group(1) if definition_match else '',
                        'example': example_match.group(1) if example_match else '',
                        'translation': translation_match.group(1) if translation_match else '',
                        'explanation': explanation_match.group(1) if explanation_match else ''
                    }
                    terms.append(term_data)
                    
            except Exception as e:
                print(f"解析词汇对象时出错: {e}")
                continue
                
    except Exception as e:
        print(f"读取文件 {file_path} 时出错: {e}")
    
    return terms

def main():
    """主函数"""
    print("🔍 正在提取网站所有词汇和文本内容...")
    
    # 数据文件路径
    data_files = [
        'data/computer-science_terms.js',
        'data/programming_terms.js', 
        'data/artificial-intelligence_terms.js',
        'data/internet_terms.js'
    ]
    
    all_terms = []
    all_text_items = []  # 所有需要语音播报的文本
    
    # 从每个文件提取词汇
    for file_path in data_files:
        if os.path.exists(file_path):
            print(f"📖 处理文件: {file_path}")
            terms = extract_terms_from_js_file(file_path)
            all_terms.extend(terms)
            print(f"  找到 {len(terms)} 个词汇")
        else:
            print(f"⚠️  文件不存在: {file_path}")
    
    print(f"\n📊 总计提取词汇: {len(all_terms)}")
    
    # 收集所有需要语音播报的文本
    unique_terms = set()
    term_definitions = []
    term_examples = []
    
    for term_data in all_terms:
        term = term_data['term']
        definition = term_data['definition']
        example = term_data['example']
        
        # 添加词汇本身
        if term and term not in unique_terms:
            all_text_items.append({
                'type': 'term',
                'text': term,
                'filename': clean_filename(term),
                'priority': 'high'
            })
            unique_terms.add(term)
        
        # 添加定义 (可选)
        if definition:
            definition_key = f"definition_{clean_filename(term)}"
            term_definitions.append({
                'type': 'definition',
                'text': definition,
                'filename': definition_key,
                'related_term': term,
                'priority': 'medium'
            })
        
        # 添加例句 (可选)
        if example:
            example_key = f"example_{clean_filename(term)}"
            term_examples.append({
                'type': 'example', 
                'text': example,
                'filename': example_key,
                'related_term': term,
                'priority': 'low'
            })
    
    # 生成词汇列表
    all_vocabulary = list(unique_terms)
    all_vocabulary.sort()
    
    print(f"🎯 去重后词汇数量: {len(all_vocabulary)}")
    
    # 保存基础词汇列表
    with open('complete_vocabulary_list.py', 'w', encoding='utf-8') as f:
        f.write('# 完整词汇列表 - 所有需要音频的单词\n')
        f.write('complete_vocabulary = [\n')
        for term in all_vocabulary:
            f.write(f'    "{term}",\n')
        f.write(']\n\n')
        
        # 添加文件名映射
        f.write('# 词汇到音频文件名的映射\n')
        f.write('vocabulary_mapping = {\n')
        for term in all_vocabulary:
            filename = clean_filename(term)
            f.write(f'    "{term.lower()}": "{filename}.wav",\n')
        f.write('}\n')
    
    # 保存完整文本内容列表 (包括定义和例句)
    complete_texts = all_text_items + term_definitions + term_examples
    
    with open('complete_text_content.py', 'w', encoding='utf-8') as f:
        f.write('# 完整文本内容 - 包括词汇、定义、例句\n')
        f.write('complete_text_content = [\n')
        for item in complete_texts:
            f.write(f'    {{\n')
            f.write(f'        "type": "{item["type"]}",\n')
            f.write(f'        "text": """{item["text"]}""",\n')
            f.write(f'        "filename": "{item["filename"]}",\n')
            f.write(f'        "priority": "{item["priority"]}"\n')
            if 'related_term' in item:
                f.write(f'        "related_term": "{item["related_term"]}",\n')
            f.write(f'    }},\n')
        f.write(']\n')
    
    # 生成详细的JSON报告
    report = {
        'total_terms': len(all_vocabulary),
        'total_texts': len(complete_texts),
        'terms_only': len(all_text_items),
        'definitions': len(term_definitions),
        'examples': len(term_examples),
        'vocabulary_list': all_vocabulary,
        'file_mapping': {term.lower(): clean_filename(term) + '.wav' for term in all_vocabulary}
    }
    
    with open('vocabulary_report.json', 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2, ensure_ascii=False)
    
    # 输出统计信息
    print("\n" + "="*60)
    print("📊 词汇提取统计:")
    print(f"  📝 总词汇数: {len(all_vocabulary)}")
    print(f"  📖 定义数: {len(term_definitions)}")  
    print(f"  📄 例句数: {len(term_examples)}")
    print(f"  📚 总文本项: {len(complete_texts)}")
    
    print(f"\n📁 生成的文件:")
    print(f"  📄 complete_vocabulary_list.py - 基础词汇列表")
    print(f"  📄 complete_text_content.py - 完整文本内容")
    print(f"  📄 vocabulary_report.json - 详细统计报告")
    
    print(f"\n🎵 推荐生成音频的优先级:")
    print(f"  🔥 高优先级: 词汇本身 ({len(all_text_items)} 个)")
    print(f"  🔹 中优先级: 词汇定义 ({len(term_definitions)} 个)")
    print(f"  🔸 低优先级: 例句 ({len(term_examples)} 个)")

if __name__ == "__main__":
    main() 