# 🎉 欢迎使用 Ollama 本地翻译助手！

## 👋 你好！

感谢选择 Ollama 本地翻译助手！这是一款基于本地 AI 大模型的 Chrome 划词翻译插件，让你的翻译数据完全掌握在自己手中。

---

## 🚀 三步快速开始

### 1️⃣ 安装 Ollama
```bash
# macOS
brew install ollama

# Linux  
curl -fsSL https://ollama.ai/install.sh | sh

# Windows：访问 https://ollama.ai 下载
```

### 2️⃣ 启动服务并下载模型
```bash
# 终端 1：启动服务
ollama serve

# 终端 2：下载模型（约 2GB）
ollama pull qwen3:0.6b
```

### 3️⃣ 加载插件
1. Chrome 访问 `chrome://extensions/`
2. 开启「开发者模式」
3. 点击「加载已解压的扩展程序」
4. 选择本文件夹

**完成！** 现在可以在任意网页选中文字进行翻译了 🎊

---

## 📚 文档导航

根据你的需求选择：

### 🆕 我是新用户
- **[安装向导](install_guide.html)** - 图文并茂的完整安装流程（推荐！）
- **[快速开始](QUICK_START.md)** - 5 分钟上手指南
- **[功能测试](test.html)** - 打开测试页面验证功能

### 📖 我需要详细了解
- **[完整文档](README.md)** - 最详细的使用说明、配置和故障排除
- **[项目概览](PROJECT_OVERVIEW.md)** - 技术架构和开发文档

### 🔧 我遇到了问题
- **[环境检查](#环境检查)** - 运行诊断脚本
- **[常见问题](#常见问题)** - 快速解决方案
- **[故障排除](README.md#故障排除)** - 详细的问题解决指南

### 👨‍💻 我想参与开发
- **[项目概览](PROJECT_OVERVIEW.md)** - 完整的技术文档
- **[更新日志](CHANGELOG.md)** - 版本历史和计划
- **[图标生成](icons/README.md)** - 生成图标文件

---

## 🔍 环境检查

### 自动检查（推荐）
```bash
./check_setup.sh
```

### 手动检查
```bash
# 检查 Ollama 是否安装
ollama --version

# 检查服务是否运行
curl http://localhost:11434/api/tags

# 查看已安装的模型
ollama list
```

---

## ❓ 常见问题

### Q: 选中文字没有反应？
**A:** 
1. 确认插件已启用（chrome://extensions/）
2. 刷新当前网页
3. 检查 Ollama 服务是否运行

### Q: 显示 "403 Forbidden" 错误？（最常见！）
**A:** 需要配置 Ollama 允许跨域请求：
```bash
# 停止 Ollama
pkill ollama

# 设置环境变量并重启
OLLAMA_ORIGINS="*" ollama serve
```
📖 详细解决方案：[QUICK_FIX_403.md](QUICK_FIX_403.md)

### Q: 显示"连接失败"？
**A:**
1. 确认 Ollama 正在运行：`ps aux | grep ollama`
2. 测试 API：`curl http://127.0.0.1:11434/api/tags`
3. 重启服务：`pkill ollama && ollama serve`

### Q: 翻译速度很慢？
**A:**
1. 使用更小的模型：`qwen3:0.6b`（2GB）
2. 确保电脑内存充足（推荐 8GB+）
3. 减少选中文本长度

### Q: 图标显示不正常？
**A:**
打开浏览器访问 `generate_icons.html` 生成图标，或查看 [icons/README.md](icons/README.md)

---

## 📁 项目文件说明

```
📦 dream-Lingua/
├── 📄 START_HERE.md          ← 你在这里！新手入口
│
├── 🚀 快速开始
│   ├── install_guide.html     ← 可视化安装向导（强烈推荐）
│   ├── QUICK_START.md         ← 文本版快速指南
│   └── test.html              ← 功能测试页面
│
├── 📖 详细文档  
│   ├── README.md              ← 完整使用文档
│   ├── PROJECT_OVERVIEW.md    ← 技术文档
│   └── CHANGELOG.md           ← 版本历史
│
├── 🔧 核心文件
│   ├── manifest.json          ← 插件配置
│   ├── background.js          ← 后台脚本（API 通信）
│   ├── content.js             ← 内容脚本（页面交互）
│   ├── popup.html/js/css      ← 配置界面
│   └── content.css            ← 弹窗样式
│
├── 🎨 资源文件
│   └── icons/                 ← 插件图标（需生成）
│
└── 🛠️ 工具脚本
    ├── check_setup.sh         ← 环境检查（可执行）
    ├── generate_icons.html    ← 图标生成器
    └── create_icons.js        ← 图标生成脚本
```

---

## 🎯 使用技巧

### 基础用法
1. 在任意网页上**选中**文字
2. 自动弹出翻译窗口
3. 点击空白处关闭

### 高级技巧
- **中英互译**：默认自动检测，中文→英文，英文→中文
- **调整温度**：配置中降低温度（0.3）获得更精确翻译
- **选择模型**：大模型质量更好，小模型速度更快
- **快捷方式**：可在 Chrome 扩展设置中配置快捷键

### 推荐配置
- **快速翻译**：qwen3:0.6b + 温度 0.5
- **高质量**：llama3.1:8b + 温度 0.3
- **平衡模式**：gemma2:9b + 温度 0.7

---

## 💡 特性亮点

- ✅ **完全本地**：数据不上传，保护隐私
- ✅ **即时响应**：选中即译，无需点击
- ✅ **AI 驱动**：使用先进的大语言模型
- ✅ **免费开源**：MIT 许可，永久免费
- ✅ **无需注册**：不需要任何账号
- ✅ **离线可用**：无需互联网连接
- ✅ **自定义**：支持多种模型和参数

---

## 🌟 推荐模型对比

| 模型 | 大小 | 内存需求 | 速度 | 质量 | 适用场景 |
|------|------|---------|------|------|----------|
| **qwen3:0.6b** | ~2GB | 4GB+ | ⚡⚡⚡ | ⭐⭐⭐ | 日常快速翻译 |
| **llama3.1:8b** | ~4.7GB | 8GB+ | ⚡⚡ | ⭐⭐⭐⭐ | 推荐首选 |
| **gemma2:9b** | ~5.5GB | 8GB+ | ⚡⚡ | ⭐⭐⭐⭐ | 高质量翻译 |
| **qwen:14b** | ~8GB | 16GB+ | ⚡ | ⭐⭐⭐⭐⭐ | 专业翻译 |

💡 **推荐**：如果不确定，选择 `qwen3:0.6b` 或 `llama3.1:8b`

---

## 🔗 有用的链接

- 🌐 [Ollama 官网](https://ollama.ai)
- 📚 [Ollama 文档](https://github.com/ollama/ollama)
- 🎓 [Chrome 扩展文档](https://developer.chrome.com/docs/extensions/)
- 💬 [问题反馈](https://github.com/dreamer-35/ollama-translate/issues)

---

## 🎊 开始你的翻译之旅

### 方式一：可视化向导（推荐）
在浏览器中打开 **[install_guide.html](install_guide.html)**

### 方式二：命令行
```bash
# 运行环境检查
./check_setup.sh

# 如果一切正常，打开测试页面
open test.html
```

### 方式三：手动配置
按照 **[QUICK_START.md](QUICK_START.md)** 操作

---

## 💬 需要帮助？

- 📖 查看 [README.md](README.md) 获取详细说明
- 🔍 运行 `./check_setup.sh` 诊断问题  
- 🐛 提交 [GitHub Issue](https://github.com/dreamer-35/ollama-translate/issues)
- ✉️ 发送邮件：rhythm35@protonmail.com

---

## ❤️ 享受翻译

**祝你使用愉快！** 🚀

有任何问题或建议，欢迎随时反馈。我们希望这个工具能让你的阅读和工作更加高效！

---

*Version 1.0.0 | MIT License | Made with ❤️*

