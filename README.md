# 💫 DreamLingua 翻译工具

- A local, privacy-first AI translator. No clouds. No tracking. Just dreams, in your language.
- 一款本地化、注重隐私的AI翻译器。无云端，无追踪。只用你的语言，为你带来梦境般的体验。

### 🎥 演示视频
<video src="https://vimeo.com/1136545162?fl=ip&fe=ec" controls="controls" width="600"></video>

## ✨ 特性

- 🔒 **隐私保护**：所有翻译在本地完成，数据不上传
- 🚀 **即时翻译**：选中文本即可快速翻译
- 🧠 **AI 驱动**：使用 Ollama 本地大语言模型
- 🌍 **智能识别**：自动检测语言，中英互译
- 🎨 **精美界面**：现代化设计，用户体验友好
- ⚙️ **灵活配置**：支持自定义模型和参数

## 📋 系统要求

- Chrome 浏览器（版本 88+）
- [Ollama](https://ollama.ai) 已安装并运行
- 至少一个已下载的 Ollama 模型（推荐 `qwen3:0.6b`, `llama3.1`, `gemma2`）

## 🚀 快速开始

### 1. 安装 Ollama

访问 [Ollama 官网](https://ollama.ai) 下载并安装 Ollama。

**macOS:**
```bash
brew install ollama
```

**Linux:**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

**Windows:**
从官网下载安装包

### 2. 下载并运行模型

```bash
# 下载推荐的轻量级模型（约 2GB）
ollama pull qwen3:0.6b

# 或者其他模型
ollama pull llama3.1
ollama pull gemma2

# 启动 Ollama 服务
ollama serve
```

### 3. 安装 Chrome 插件

#### 方法一：开发者模式安装

1. 下载或克隆此仓库
2. 打开 Chrome 浏览器，访问 `chrome://extensions/`
3. 开启右上角的「开发者模式」
4. 点击「加载已解压的扩展程序」
5. 选择本项目文件夹

#### 方法二：生成图标（可选）

在浏览器中打开 `generate_icons.html` 生成图标文件，或使用以下命令：

```bash
# 如果安装了 ImageMagick
node create_icons.js

# 或者使用 brew 安装 ImageMagick
brew install imagemagick
convert -background none -resize 128x128 icons/icon.svg icons/icon128.png
```

### 4. 配置插件

1. 点击浏览器工具栏中的插件图标
2. 配置 Ollama API 地址（默认：`http://localhost:11434`）
3. 选择要使用的模型（例如：`qwen3:0.6b`）
4. 点击「测试连接」确保服务正常
5. 保存配置

## 📖 使用方法

1. 在任意网页上**选中**想要翻译的文本
2. 翻译弹窗会**自动显示**在选中文本附近
3. 等待几秒，翻译结果出现
4. 点击空白处或滚动页面关闭弹窗

### 翻译模式

- **自动检测**（默认）：中文翻译成英文，英文翻译成中文
- **总是中文**：所有文本翻译成中文
- **总是英文**：所有文本翻译成英文

## ⚙️ 配置说明

### Ollama API 地址

默认：`http://localhost:11434`

如果 Ollama 运行在其他端口或远程服务器，可以修改此地址。

### 模型选择

推荐模型（按大小排序）：

| 模型 | 大小 | 速度 | 质量 | 适用场景 |
|------|------|------|------|----------|
| `qwen3:0.6b` | ~523MB | ⚡⚡⚡ | ⭐⭐⭐ | 轻量快速 |
| `llama3.1:8b` | ~4.7GB | ⚡⚡ | ⭐⭐⭐⭐ | 平衡选择 |
| `gemma2:9b` | ~5.5GB | ⚡⚡ | ⭐⭐⭐⭐ | 高质量 |
| `llama3.1:70b` | ~40GB | ⚡ | ⭐⭐⭐⭐⭐ | 最佳效果 |

### 温度参数

- **0.0 - 0.3**：更精确、一致的翻译
- **0.4 - 0.7**：平衡（推荐）
- **0.8 - 1.0**：更有创造性，但可能不够精确

## 🔧 高级配置

### 自定义提示词

如需自定义翻译提示词，可修改 `background.js` 中的 `generatePrompt` 函数：

```javascript
function generatePrompt(text, sourceLang, targetLang) {
  // 自定义你的提示词
  return `请将以下文本翻译成${targetLang}，保持原意：\n\n${text}`;
}
```

### 使用远程 Ollama 服务

如果 Ollama 运行在另一台机器上：

1. 启动 Ollama 时允许外部访问：
```bash
OLLAMA_HOST=0.0.0.0:11434 ollama serve
```

2. 在插件配置中填入远程地址：
```
http://192.168.1.100:11434
```

## 📁 项目结构

```
dream-Lingua/
├── manifest.json          # Chrome 插件配置文件
├── background.js          # 后台脚本（与 Ollama API 通信）
├── content.js             # 内容脚本（处理页面文本选择）
├── content.css            # 翻译弹窗样式
├── popup.html             # 配置页面 HTML
├── popup.js               # 配置页面逻辑
├── popup.css              # 配置页面样式
├── icons/                 # 插件图标
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   ├── icon128.png
│   └── icon.svg
├── generate_icons.html    # 图标生成器（浏览器打开）
├── create_icons.js        # 图标生成脚本（Node.js）
└── README.md              # 说明文档
```

## 🔍 工作原理

```
用户选中文本
    ↓
Content Script 捕获选择
    ↓
发送消息到 Background Script
    ↓
Background Script 调用 Ollama API
    ↓
Ollama 处理并返回翻译
    ↓
Content Script 显示翻译弹窗
```

### 数据流程

1. **Content Script**（`content.js`）：
   - 监听页面文本选择事件
   - 创建和管理翻译弹窗
   - 显示翻译结果

2. **Background Script**（`background.js`）：
   - 接收翻译请求
   - 调用本地 Ollama API
   - 返回翻译结果

3. **Ollama API**：
   - 接收翻译提示词
   - 使用本地模型生成翻译
   - 返回 JSON 格式结果

## 🐛 故障排除

### ❌ 403 Forbidden 错误（最常见）

**问题**：翻译失败: Ollama API 请求失败: 403 Forbidden

**解决方案**：设置 Ollama 允许跨域请求

```bash
# 停止 Ollama
pkill ollama

# 设置环境变量并重启
OLLAMA_ORIGINS="chrome-extension://*" ollama serve

# 或允许所有来源
OLLAMA_ORIGINS="*" ollama serve
```

**永久设置**（推荐）：
```bash
# 编辑 ~/.zshrc 或 ~/.bashrc
echo 'export OLLAMA_ORIGINS="*"' >> ~/.zshrc
source ~/.zshrc
ollama serve
```

---

### 无法连接到 Ollama 服务

**问题**：插件显示「连接失败」

**解决方案**：
1. 确认 Ollama 正在运行：
   ```bash
   ps aux | grep ollama
   ```

2. 检查端口是否正确：
   ```bash
   curl http://127.0.0.1:11434/api/tags
   ```

3. 重启 Ollama 服务：
   ```bash
   pkill ollama
   ollama serve
   ```

### 翻译速度慢

**问题**：翻译等待时间过长

**解决方案**：
1. 使用更小的模型（如 `qwen3:0.6b`）
2. 确保硬件满足要求（推荐 8GB+ 内存）
3. 限制选中文本长度（建议 < 500 字）

### 翻译质量不佳

**问题**：翻译结果不准确

**解决方案**：
1. 尝试更大的模型（如 `llama3.1:8b`）
2. 调整温度参数（降低到 0.3-0.5）
3. 修改提示词，提供更多上下文

### CORS 错误

**问题**：浏览器控制台显示跨域错误

**解决方案**：
确保 `manifest.json` 中包含正确的 `host_permissions`：
```json
"host_permissions": [
  "http://localhost:11434/*"
]
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 开发

1. Clone 仓库
2. 修改代码
3. 在 Chrome 中加载插件测试
4. 提交 PR

## 📄 许可证

MIT License

## 🙏 致谢

- [Ollama](https://ollama.ai) - 优秀的本地大模型运行工具
- [Chrome Extensions](https://developer.chrome.com/docs/extensions/) - 扩展开发文档

## 📮 联系方式

- Issues: [GitHub Issues](https://github.com/dreamer-35/dream-Lingua/issues)
- Email: rhythm35@protonmail.com

---

**享受无干扰的本地翻译体验！** 🎉

