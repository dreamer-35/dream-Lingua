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
      <span class="ollama-popup-title">🤡 翻译中...</span>
      <button class="ollama-popup-close">×</button>
    </div>
    <div class="ollama-popup-content">
      <div class="ollama-popup-loading">正在请求本地模型...</div>
    </div>
  `;

  document.body.appendChild(translationPopup);

  // 添加关闭按钮事件
  const closeBtn = translationPopup.querySelector('.ollama-popup-close');
  closeBtn.addEventListener('click', hideTranslationPopup);

  return translationPopup;
}

// 显示翻译弹窗
function showTranslationPopup(x, y, text) {
  const popup = createTranslationPopup();
  
  // 设置位置（在选中文本下方）
  let top = y + 20;
  let left = x;

  // 确保弹窗不超出视口
  const popupRect = popup.getBoundingClientRect();
  if (left + 350 > window.innerWidth) {
    left = window.innerWidth - 360;
  }
  if (top + popupRect.height > window.innerHeight + window.scrollY) {
    top = y - popupRect.height - 10;
  }

  popup.style.top = `${top}px`;
  popup.style.left = `${left}px`;
  popup.style.display = 'block';

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

console.log('DreamLingua 内容脚本已加载');

