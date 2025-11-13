// Popup Script - 处理配置界面逻辑

document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('configForm');
  const testBtn = document.getElementById('testBtn');
  const statusIndicator = document.getElementById('connectionStatus');
  const temperatureSlider = document.getElementById('temperature');
  const temperatureValue = document.getElementById('temperatureValue');
  const modelList = document.getElementById('modelList');

  // 加载当前配置
  async function loadConfig() {
    const response = await chrome.runtime.sendMessage({ action: 'getConfig' });
    
    document.getElementById('ollamaUrl').value = response.ollamaUrl || '';
    document.getElementById('model').value = response.model || '';
    document.getElementById('targetLanguage').value = response.targetLanguage || 'auto';
    document.getElementById('temperature').value = response.temperature || 0.7;
    temperatureValue.textContent = response.temperature || 0.7;

    // 自动测试连接
    testConnection();
  }

  // 更新温度显示
  temperatureSlider.addEventListener('input', (e) => {
    temperatureValue.textContent = e.target.value;
  });

  // 保存配置
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const config = {
      ollamaUrl: document.getElementById('ollamaUrl').value,
      model: document.getElementById('model').value,
      targetLanguage: document.getElementById('targetLanguage').value,
      temperature: parseFloat(document.getElementById('temperature').value)
    };

    await chrome.runtime.sendMessage({ 
      action: 'saveConfig', 
      config: config 
    });

    // 显示保存成功提示
    const saveBtn = form.querySelector('button[type="submit"]');
    const originalText = saveBtn.textContent;
    saveBtn.textContent = '✅ 保存成功！';
    saveBtn.style.backgroundColor = '#10b981';

    setTimeout(() => {
      saveBtn.textContent = originalText;
      saveBtn.style.backgroundColor = '';
    }, 2000);
  });

  // 测试连接
  async function testConnection() {
    updateStatus('testing', '正在连接...');
    modelList.innerHTML = '';

    const response = await chrome.runtime.sendMessage({ action: 'testConnection' });

    if (response.success) {
      updateStatus('connected', '✅ 连接成功');
      
      // 显示可用模型列表
      if (response.models && response.models.length > 0) {
        modelList.innerHTML = '<div class="model-list-title">📋 可用模型：</div>';
        response.models.forEach(model => {
          const modelItem = document.createElement('div');
          modelItem.className = 'model-item';
          modelItem.textContent = model.name;
          modelItem.onclick = () => {
            document.getElementById('model').value = model.name;
          };
          modelList.appendChild(modelItem);
        });
      }
    } else {
      updateStatus('disconnected', '❌ 连接失败');
      modelList.innerHTML = `<div class="error-message">
        ⚠️ ${response.error || '无法连接到 Ollama 服务'}<br/>
        <small>请确保 Ollama 已安装并运行</small>
      </div>`;
    }
  }

  // 更新连接状态显示
  function updateStatus(status, text) {
    const statusDot = statusIndicator.querySelector('.status-dot');
    const statusText = statusIndicator.querySelector('.status-text');

    statusIndicator.className = 'status-indicator ' + status;
    statusText.textContent = text;

    // 更新状态点颜色
    if (status === 'connected') {
      statusDot.style.backgroundColor = '#10b981';
    } else if (status === 'disconnected') {
      statusDot.style.backgroundColor = '#ef4444';
    } else {
      statusDot.style.backgroundColor = '#f59e0b';
    }
  }

  // 测试按钮点击事件
  testBtn.addEventListener('click', testConnection);

  // 初始化加载配置
  loadConfig();
});

