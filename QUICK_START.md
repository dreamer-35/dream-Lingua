# 🚀 快速开始指南

## 第一步：安装 Ollama

### macOS
```bash
brew install ollama
```

### Linux
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

### Windows
访问 https://ollama.ai 下载安装包

## 第二步：启动 Ollama 并下载模型

```bash
# 启动 Ollama 服务（在终端中运行）
ollama serve

# 新开一个终端窗口，下载模型
ollama pull qwen3:0.6b
```

等待模型下载完成（约 2GB）。

## 第三步：安装插件

1. 打开 Chrome 浏览器
2. 访问 `chrome://extensions/`
3. 开启右上角的「**开发者模式**」
4. 点击「**加载已解压的扩展程序**」
5. 选择 `dream-Lingua` 文件夹

## 第四步：配置插件

1. 点击 Chrome 工具栏中的插件图标 🤖
2. 查看连接状态是否为「✅ 连接成功」
3. 如果连接失败，确保：
   - Ollama 服务正在运行
   - API 地址为 `http://localhost:11434`
   - 模型名称为 `qwen3:0.6b`
4. 点击「💾 保存配置」

## 第五步：开始使用

1. 打开任意网页
2. 用鼠标**选中**要翻译的文本
3. 等待翻译弹窗出现
4. 查看翻译结果

## ⚠️ 注意事项

### 图标文件
插件需要图标文件才能正常显示。请使用以下方法之一创建图标：

**方法 1：使用浏览器生成**
1. 在浏览器中打开 `generate_icons.html`
2. 点击「生成所有图标」按钮
3. 将下载的 PNG 文件放入 `icons/` 文件夹

**方法 2：使用 ImageMagick**
```bash
brew install imagemagick
cd dream-Lingua/icons
convert -background none -resize 16x16 icon.svg icon16.png
convert -background none -resize 32x32 icon.svg icon32.png
convert -background none -resize 48x48 icon.svg icon48.png
convert -background none -resize 128x128 icon.svg icon128.png
```

**方法 3：临时解决方案**
如果暂时不需要图标，可以注释掉 `manifest.json` 中的图标配置：
```json
// 注释掉这些行
// "action": {
//   "default_icon": { ... }
// },
// "icons": { ... }
```

## 🔍 验证安装

### 检查 Ollama 服务
```bash
curl http://localhost:11434/api/tags
```

应该返回已安装的模型列表。

### 检查插件状态
在 `chrome://extensions/` 页面中，插件卡片应该显示为「已启用」状态。

## ❓ 遇到问题？

查看完整的 [README.md](README.md) 文档中的「故障排除」部分。

---

**祝使用愉快！** 🎉

