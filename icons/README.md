# 图标文件说明

## 生成图标

此文件夹需要包含以下图标文件：
- `icon16.png` (16x16 像素)
- `icon32.png` (32x32 像素)
- `icon48.png` (48x48 像素)
- `icon128.png` (128x128 像素)

## 生成方法

### 方法 1：使用浏览器生成器（推荐）

1. 在浏览器中打开项目根目录的 `generate_icons.html` 文件
2. 点击「生成所有图标」按钮
3. 浏览器会自动下载 4 个 PNG 文件
4. 将下载的文件移动到此文件夹

### 方法 2：使用 ImageMagick

如果已安装 ImageMagick：

```bash
# 安装 ImageMagick (macOS)
brew install imagemagick

# 生成图标
cd icons
convert -background none -resize 16x16 icon.svg icon16.png
convert -background none -resize 32x32 icon.svg icon32.png
convert -background none -resize 48x48 icon.svg icon48.png
convert -background none -resize 128x128 icon.svg icon128.png
```

### 方法 3：使用在线工具

1. 将 `icon.svg` 上传到在线转换工具（如 cloudconvert.com）
2. 分别转换为 16x16, 32x32, 48x48, 128x128 的 PNG 文件
3. 下载并放入此文件夹

### 方法 4：手动创建

使用任何图像编辑软件（Photoshop, GIMP, Figma 等）：
1. 打开 `icon.svg`
2. 导出为不同尺寸的 PNG 文件
3. 确保文件名正确

## 临时解决方案

如果暂时无法生成图标，可以：
1. 使用任意 PNG 图片重命名为对应文件名
2. 或在 `manifest.json` 中注释掉图标配置

## 设计说明

图标设计包含：
- 渐变背景（紫色到蓝色）
- 字母 "A" 和汉字 "文" 表示翻译功能
- 箭头表示转换方向
- "AI" 徽章表示 AI 驱动

颜色方案：
- 主色：#667eea 到 #764ba2（渐变）
- 强调色：#10b981（绿色，表示 AI）
- 文字：白色

