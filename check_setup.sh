#!/bin/bash

# DreamLingua环境检查脚本

echo "🔍 检查 DreamLingua运行环境..."
echo ""

# 检查 Ollama 是否安装
echo "1️⃣  检查 Ollama 安装状态..."
if command -v ollama &> /dev/null; then
    echo "   ✅ Ollama 已安装"
    ollama --version
else
    echo "   ❌ Ollama 未安装"
    echo "   📦 安装方法："
    echo "      macOS:  brew install ollama"
    echo "      Linux:  curl -fsSL https://ollama.ai/install.sh | sh"
    echo "      或访问: https://ollama.ai"
    exit 1
fi

echo ""

# 检查 Ollama 服务是否运行
echo "2️⃣  检查 Ollama 服务状态..."
if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo "   ✅ Ollama 服务正在运行"
else
    echo "   ❌ Ollama 服务未运行"
    echo "   🚀 启动方法: ollama serve"
    exit 1
fi

echo ""

# 检查已安装的模型
echo "3️⃣  检查已安装的模型..."
MODELS=$(curl -s http://localhost:11434/api/tags | grep -o '"name":"[^"]*"' | cut -d'"' -f4)

if [ -z "$MODELS" ]; then
    echo "   ❌ 未找到已安装的模型"
    echo "   📥 推荐安装:"
    echo "      ollama pull qwen3:0.6b    (轻量级，约 2GB)"
    echo "      ollama pull llama3.1      (平衡，约 4.7GB)"
    echo "      ollama pull gemma2        (高质量，约 5.5GB)"
    exit 1
else
    echo "   ✅ 已安装的模型："
    echo "$MODELS" | while read -r model; do
        echo "      • $model"
    done
fi

echo ""

# 检查推荐模型
echo "4️⃣  检查推荐模型..."
RECOMMENDED=("qwen3:0.6b" "llama3.1" "gemma2" "qwen:7b" "mistral")
FOUND=false

for model in "${RECOMMENDED[@]}"; do
    if echo "$MODELS" | grep -q "$model"; then
        echo "   ✅ 找到推荐模型: $model"
        FOUND=true
        break
    fi
done

if [ "$FOUND" = false ]; then
    echo "   ⚠️  未找到推荐模型"
    echo "   建议安装: ollama pull qwen3:0.6b"
fi

echo ""

# 检查图标文件
echo "5️⃣  检查插件图标..."
ICON_SIZES=(16 32 48 128)
ICONS_MISSING=false

for size in "${ICON_SIZES[@]}"; do
    if [ -f "icons/icon${size}.png" ]; then
        echo "   ✅ icon${size}.png 存在"
    else
        echo "   ⚠️  icon${size}.png 缺失"
        ICONS_MISSING=true
    fi
done

if [ "$ICONS_MISSING" = true ]; then
    echo ""
    echo "   💡 生成图标的方法："
    echo "      1. 在浏览器中打开 generate_icons.html"
    echo "      2. 或运行: brew install imagemagick && node create_icons.js"
fi

echo ""

# 测试 API 连接
echo "6️⃣  测试 Ollama API 连接..."
RESPONSE=$(curl -s -X POST http://localhost:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qwen3:0.6b",
    "prompt": "Hello",
    "stream": false
  }' 2>&1)

if echo "$RESPONSE" | grep -q "response"; then
    echo "   ✅ API 连接正常"
else
    echo "   ⚠️  API 测试异常"
    echo "   请确保已安装并加载了模型"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ 环境检查完成！"
echo ""
echo "📌 下一步："
echo "   1. 打开 Chrome 访问 chrome://extensions/"
echo "   2. 开启「开发者模式」"
echo "   3. 点击「加载已解压的扩展程序」"
echo "   4. 选择此文件夹"
echo "   5. 打开 test.html 进行测试"
echo ""
echo "📖 详细文档: README.md"
echo "🚀 快速开始: QUICK_START.md"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

