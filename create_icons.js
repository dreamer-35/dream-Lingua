// 简单的图标创建脚本
// 如果系统有 ImageMagick 或其他工具，可以用这个脚本生成图标

const fs = require('fs');
const { exec } = require('child_process');

const sizes = [16, 32, 48, 128];

// 检查是否安装了 ImageMagick
exec('which convert', (error) => {
  if (error) {
    console.log('❌ 未找到 ImageMagick');
    console.log('请使用以下方法之一生成图标：');
    console.log('1. 在浏览器中打开 generate_icons.html');
    console.log('2. 安装 ImageMagick: brew install imagemagick');
    console.log('3. 使用在线工具转换 icons/icon.svg');
    process.exit(1);
  }

  // 使用 ImageMagick 从 SVG 生成 PNG
  sizes.forEach(size => {
    const command = `convert -background none -resize ${size}x${size} icons/icon.svg icons/icon${size}.png`;
    exec(command, (error) => {
      if (error) {
        console.error(`生成 icon${size}.png 失败:`, error.message);
      } else {
        console.log(`✅ 成功生成 icon${size}.png`);
      }
    });
  });
});

