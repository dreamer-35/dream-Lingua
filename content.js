// Content Script - 处理页面文本选择和显示翻译结果

let translationPopup = null;
let currentSelection = null;

// 创建翻译弹窗
function createTranslationPopup() {
  if (translationPopup) {
    translationPopup.remove();
  }

  translationPopup = document.createElement('div');
  translationPopup.id = 'ollama-translation-popup';
  translationPopup.className = 'ollama-popup';
  translationPopup.innerHTML = `
    <div class="ollama-popup-header">
      <span class="ollama-popup-title">💫 翻译中...</span>
      <button class="ollama-popup-close">×</button>
    </div>
    <div class="ollama-popup-content">
      <div class="ollama-popup-loading">正在请求本地模型...</div>
    </div>
  `;

  // 直接添加到 documentElement（html），避免被 body 的层叠上下文影响
  (document.body || document.documentElement).appendChild(translationPopup);

  // 添加关闭按钮事件
  const closeBtn = translationPopup.querySelector('.ollama-popup-close');
  closeBtn.addEventListener('click', hideTranslationPopup);

  return translationPopup;
}

// 显示翻译弹窗
function showTranslationPopup(x, y, text) {
  const popup = createTranslationPopup();
  
  // 保存鼠标位置，供后续重新定位使用
  popup.dataset.cursorX = x;
  popup.dataset.cursorY = y;
  
  // 先显示弹窗以获取真实尺寸
  popup.style.display = 'block';
  popup.style.visibility = 'hidden';
  
  // 初始位置设置
  popup.style.top = `${y + 20}px`;
  popup.style.left = `${x}px`;
  
  // 等待下一帧，确保 DOM 已渲染
  requestAnimationFrame(() => {
    positionPopup(popup, x, y);
    popup.style.visibility = 'visible';
  });

  // 发送翻译请求到 background script
  chrome.runtime.sendMessage(
    { action: 'translate', text: text },
    (response) => {
      if (response && response.success) {
        updateTranslationContent(response.translation);
      } else {
        updateTranslationContent(`❌ 翻译失败: ${response?.error || '未知错误'}`);
      }
    }
  );
}

// 智能定位弹窗，确保完全在视口内可见
function positionPopup(popup, pageX, pageY) {
  const popupRect = popup.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const scrollX = window.scrollX || window.pageXOffset;
  const scrollY = window.scrollY || window.pageYOffset;
  
  // 转换为视口坐标（fixed 定位使用）
  const viewportX = pageX - scrollX;
  const viewportY = pageY - scrollY;
  
  // 定义弹窗与边缘的安全距离
  const PADDING = 10;
  const OFFSET_FROM_CURSOR = 20;
  
  // 计算可用的最大高度（视口高度减去上下边距）
  const maxHeight = viewportHeight - (PADDING * 2);
  const contentEl = popup.querySelector('.ollama-popup-content');
  if (contentEl) {
    // 设置内容区域的最大高度，留出头部空间
    contentEl.style.maxHeight = `${maxHeight - 60}px`;
  }
  
  let top, left;
  
  // 水平位置计算（使用视口坐标）
  // 优先尝试在光标右侧显示
  if (viewportX + popupRect.width + PADDING <= viewportWidth) {
    // 光标右侧有足够空间
    left = viewportX;
  } else if (viewportX - popupRect.width >= PADDING) {
    // 光标右侧空间不足，尝试左侧
    left = viewportX - popupRect.width;
  } else {
    // 两侧都不够，居中显示或靠右
    left = Math.max(PADDING, viewportWidth - popupRect.width - PADDING);
  }
  
  // 垂直位置计算（使用视口坐标）
  // 优先尝试在光标下方显示
  const spaceBelow = viewportHeight - viewportY - OFFSET_FROM_CURSOR;
  const spaceAbove = viewportY - OFFSET_FROM_CURSOR;
  
  if (popupRect.height <= spaceBelow) {
    // 下方有足够空间
    top = viewportY + OFFSET_FROM_CURSOR;
  } else if (popupRect.height <= spaceAbove) {
    // 下方空间不足，上方有足够空间
    top = viewportY - popupRect.height - OFFSET_FROM_CURSOR;
  } else {
    // 上下都不够，选择空间较大的一侧，并调整高度
    if (spaceBelow >= spaceAbove) {
      // 下方空间更大
      top = viewportY + OFFSET_FROM_CURSOR;
      if (contentEl) {
        contentEl.style.maxHeight = `${spaceBelow - 80}px`;
      }
    } else {
      // 上方空间更大
      top = PADDING;
      if (contentEl) {
        contentEl.style.maxHeight = `${spaceAbove - 80}px`;
      }
    }
  }
  
  // 确保不超出视口边界（fixed 定位，无需加 scrollY）
  left = Math.max(PADDING, Math.min(left, viewportWidth - popupRect.width - PADDING));
  top = Math.max(PADDING, Math.min(top, viewportHeight - PADDING - 100));
  
  // 应用最终位置（使用 fixed 定位的视口坐标）
  popup.style.left = `${left}px`;
  popup.style.top = `${top}px`;
}

// 更新翻译内容
function updateTranslationContent(translation) {
  if (!translationPopup) return;

  const titleEl = translationPopup.querySelector('.ollama-popup-title');
  const contentEl = translationPopup.querySelector('.ollama-popup-content');

  titleEl.textContent = '🤪 翻译结果';
  contentEl.innerHTML = `
    <div class="ollama-popup-original">
      <strong>原文：</strong><br/>
      ${currentSelection}
    </div>
    <div class="ollama-popup-translation">
      <strong>译文：</strong><br/>
      ${translation}
    </div>
  `;
  
  // 内容更新后，重新调整弹窗位置以适应新内容
  requestAnimationFrame(() => {
    // 获取弹窗的当前位置（鼠标点击位置已存储）
    if (translationPopup && translationPopup.dataset.cursorX && translationPopup.dataset.cursorY) {
      const x = parseFloat(translationPopup.dataset.cursorX);
      const y = parseFloat(translationPopup.dataset.cursorY);
      positionPopup(translationPopup, x, y);
    }
  });
}

// 隐藏翻译弹窗
function hideTranslationPopup() {
  if (translationPopup) {
    translationPopup.style.display = 'none';
  }
}

// 监听文本选择事件
document.addEventListener('mouseup', (event) => {
  // 延迟执行，确保选择完成
  setTimeout(() => {
    const selectedText = window.getSelection().toString().trim();

    // 如果点击在弹窗内，不处理
    if (translationPopup && translationPopup.contains(event.target)) {
      return;
    }

    // 如果没有选中文本，隐藏弹窗
    if (!selectedText) {
      hideTranslationPopup();
      return;
    }

    // 如果选中了新文本，显示翻译
    if (selectedText.length > 0 && selectedText.length < 1000) {
      currentSelection = selectedText;
      showTranslationPopup(event.pageX, event.pageY, selectedText);
    }
  }, 10);
});

// 点击其他区域隐藏弹窗
document.addEventListener('click', (event) => {
  if (translationPopup && 
      !translationPopup.contains(event.target) && 
      translationPopup.style.display === 'block') {
    // 检查是否是文本选择
    const selectedText = window.getSelection().toString().trim();
    if (!selectedText) {
      hideTranslationPopup();
    }
  }
});

// 滚动时隐藏弹窗
document.addEventListener('scroll', () => {
  hideTranslationPopup();
});

// 窗口大小改变时重新定位弹窗
window.addEventListener('resize', () => {
  if (translationPopup && translationPopup.style.display === 'block') {
    if (translationPopup.dataset.cursorX && translationPopup.dataset.cursorY) {
      const x = parseFloat(translationPopup.dataset.cursorX);
      const y = parseFloat(translationPopup.dataset.cursorY);
      positionPopup(translationPopup, x, y);
    }
  }
});

console.log('DreamLingua 内容脚本已加载');

