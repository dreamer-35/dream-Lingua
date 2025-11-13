// Background Script - 处理与 Ollama API 的通信

// 默认配置
const DEFAULT_CONFIG = {
  ollamaUrl: 'http://127.0.0.1:11434',
  model: 'qwen3:0.6b',
  temperature: 0.7,
  targetLanguage: 'auto' // auto: 自动检测，zh: 中文，en: 英文
};

// 获取配置
async function getConfig() {
  const result = await chrome.storage.sync.get(DEFAULT_CONFIG);
  return result;
}

// 保存配置
async function saveConfig(config) {
  await chrome.storage.sync.set(config);
}

// 检测文本语言
function detectLanguage(text) {
  // 简单的语言检测：检查是否包含中文字符
  const chineseRegex = /[\u4e00-\u9fa5]/;
  return chineseRegex.test(text) ? 'zh' : 'en';
}

// 生成翻译提示词
function generatePrompt(text, sourceLang, targetLang) {
  if (targetLang === 'auto') {
    // 自动检测目标语言（中文翻译成英文，其他翻译成中文）
    if (sourceLang === 'zh') {
      return `请将以下中文翻译成英文，只返回翻译结果，不要有任何解释：\n\n${text}`;
    } else {
      return `请将以下文本翻译成中文，只返回翻译结果，不要有任何解释：\n\n${text}`;
    }
  } else if (targetLang === 'zh') {
    return `请将以下文本翻译成中文，只返回翻译结果，不要有任何解释：\n\n${text}`;
  } else {
    return `请将以下文本翻译成英文，只返回翻译结果，不要有任何解释：\n\n${text}`;
  }
}

// 调用 Ollama API 进行翻译
async function translateWithOllama(text, config) {
  try {
    const sourceLang = detectLanguage(text);
    const prompt = generatePrompt(text, sourceLang, config.targetLanguage);

    const response = await fetch(`${config.ollamaUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
      body: JSON.stringify({
        model: config.model,
        prompt: prompt,
        stream: false,
        options: {
          temperature: config.temperature,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama API 请求失败: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.response) {
      throw new Error('Ollama API 返回数据格式错误');
    }

    return {
      success: true,
      translation: data.response.replace("/think", '').trim()
    };

  } catch (error) {
    console.error('翻译错误:', error);
    return {
      success: false,
      error: error.message || '翻译失败，请检查 Ollama 服务是否运行'
    };
  }
}

// 监听来自 content script 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'translate') {
    // 异步处理翻译请求
    (async () => {
      const config = await getConfig();
      const result = await translateWithOllama(request.text, config);
      sendResponse(result);
    })();
    
    // 返回 true 表示异步发送响应
    return true;
  }
  
  if (request.action === 'getConfig') {
    getConfig().then(config => sendResponse(config));
    return true;
  }
  
  if (request.action === 'saveConfig') {
    saveConfig(request.config).then(() => {
      sendResponse({ success: true });
    });
    return true;
  }

  if (request.action === 'testConnection') {
    (async () => {
      try {
        const config = await getConfig();
        const response = await fetch(`${config.ollamaUrl}/api/tags`);
        if (response.ok) {
          const data = await response.json();
          sendResponse({ success: true, models: data.models });
        } else {
          sendResponse({ success: false, error: 'Ollama 服务连接失败' });
        }
      } catch (error) {
        sendResponse({ success: false, error: error.message });
      }
    })();
    return true;
  }
});

console.log('DreamLingua后台脚本已启动');

