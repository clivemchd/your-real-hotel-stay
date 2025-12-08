document.addEventListener('DOMContentLoaded', () => {
  const apiKeyInput = document.getElementById('apiKey');
  const saveKeyBtn = document.getElementById('saveKeyBtn');
  const removeKeyBtn = document.getElementById('removeKeyBtn');
  const keyInputContainer = document.getElementById('keyInputContainer');
  const keySavedContainer = document.getElementById('keySavedContainer');
  
  const promptInput = document.getElementById('promptInput');
  const savePromptBtn = document.getElementById('savePromptBtn');
  const resetPromptBtn = document.getElementById('resetPromptBtn');
  
  const modelSelect = document.getElementById('modelSelect');
  
  const status = document.getElementById('status');

  const DEFAULT_PROMPT = "Edit this image to make it look like there are happy people enjoying the hotel. Return the result as a generated image.";

  // Load saved settings
  chrome.storage.local.get(['googleApiKey', 'customPrompt', 'selectedModel'], (result) => {
    // Handle API Key UI
    if (result.googleApiKey) {
      showKeySavedState();
    } else {
      showKeyInputState();
    }

    // Handle Prompt UI
    if (result.customPrompt) {
      promptInput.value = result.customPrompt;
    } else {
      promptInput.value = DEFAULT_PROMPT;
    }

    // Handle Model UI
    if (result.selectedModel) {
      modelSelect.value = result.selectedModel;
    }
  });

  // Save Model
  modelSelect.addEventListener('change', () => {
    const model = modelSelect.value;
    chrome.storage.local.set({ selectedModel: model }, () => {
      showStatus('Model preference saved!', 'green');
    });
  });

  // Save Key
  saveKeyBtn.addEventListener('click', () => {
    const key = apiKeyInput.value.trim();
    if (key) {
      chrome.storage.local.set({ googleApiKey: key }, () => {
        showStatus('API Key saved!', 'green');
        showKeySavedState();
        apiKeyInput.value = ''; // Clear input for security
      });
    } else {
      showStatus('Please enter a valid key.', 'red');
    }
  });

  // Remove Key
  removeKeyBtn.addEventListener('click', () => {
    chrome.storage.local.remove('googleApiKey', () => {
      showStatus('API Key removed.', 'black');
      showKeyInputState();
    });
  });

  // Save Prompt
  savePromptBtn.addEventListener('click', () => {
    const prompt = promptInput.value.trim();
    if (prompt) {
      chrome.storage.local.set({ customPrompt: prompt }, () => {
        showStatus('Prompt saved!', 'green');
      });
    } else {
      showStatus('Prompt cannot be empty.', 'red');
    }
  });

  // Reset Prompt
  resetPromptBtn.addEventListener('click', () => {
    promptInput.value = DEFAULT_PROMPT;
    chrome.storage.local.set({ customPrompt: DEFAULT_PROMPT }, () => {
      showStatus('Reset to default.', 'black');
    });
  });

  function showKeySavedState() {
    keyInputContainer.style.display = 'none';
    keySavedContainer.style.display = 'flex';
  }

  function showKeyInputState() {
    keyInputContainer.style.display = 'block';
    keySavedContainer.style.display = 'none';
  }

  function showStatus(msg, color) {
    status.textContent = msg;
    status.style.color = color || 'black';
    setTimeout(() => {
      status.textContent = '';
    }, 3000);
  }
});
