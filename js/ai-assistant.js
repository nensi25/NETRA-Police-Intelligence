/* =============================================
   NETRA AI ASSISTANT LOGIC
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  const fab = document.getElementById('netra-ai-fab');
  const panel = document.getElementById('netra-ai-panel');
  const closeBtn = document.getElementById('netra-ai-close');
  const clearBtn = document.getElementById('netra-ai-clear');
  const chatHistory = document.getElementById('netra-ai-chat-history');
  const inputEl = document.getElementById('netra-ai-input');
  const sendBtn = document.getElementById('netra-ai-send');
  const chips = document.querySelectorAll('.netra-ai-chip');
  
  let isPanelOpen = false;
  let isAiTyping = false;

  const originalWelcomeMessage = chatHistory.innerHTML;

  function togglePanel() {
    isPanelOpen = !isPanelOpen;
    if (isPanelOpen) {
      panel.classList.add('open');
      setTimeout(() => inputEl.focus(), 300);
    } else {
      panel.classList.remove('open');
      inputEl.blur();
    }
  }

  fab.addEventListener('click', togglePanel);
  closeBtn.addEventListener('click', togglePanel);
  
  clearBtn.addEventListener('click', () => {
    chatHistory.innerHTML = originalWelcomeMessage;
  });

  // Keyboard shortcut Ctrl+K
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      togglePanel();
    }
  });

  // Quick Action Chips
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const text = chip.textContent;
      inputEl.value = text;
      handleSend();
    });
  });

  // Auto-resize textarea
  inputEl.addEventListener('input', () => {
    inputEl.style.height = 'auto';
    inputEl.style.height = (inputEl.scrollHeight) + 'px';
  });

  // Send message on Enter (but allow Shift+Enter for newline)
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });

  sendBtn.addEventListener('click', handleSend);

  function handleSend() {
    const text = inputEl.value.trim();
    if (!text || isAiTyping) return;
    
    appendUserMessage(text);
    inputEl.value = '';
    inputEl.style.height = 'auto';
    
    simulateAiResponse(text);
  }

  function appendUserMessage(text) {
    const timeStr = getFormattedTime();
    const html = `
      <div class="netra-ai-msg-row user">
        <div class="netra-ai-bubble">${escapeHtml(text)}</div>
        <div class="netra-ai-msg-time">${timeStr}</div>
      </div>
    `;
    chatHistory.insertAdjacentHTML('beforeend', html);
    scrollToBottom();
  }

  function appendAiTyping() {
    const html = `
      <div class="netra-ai-msg-row ai" id="netra-ai-typing-indicator">
        <div class="netra-ai-bubble netra-ai-typing">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      </div>
    `;
    chatHistory.insertAdjacentHTML('beforeend', html);
    scrollToBottom();
  }

  function removeAiTyping() {
    const el = document.getElementById('netra-ai-typing-indicator');
    if (el) el.remove();
  }

  function appendAiMessage(htmlContent) {
    const timeStr = getFormattedTime();
    const html = `
      <div class="netra-ai-msg-row ai">
        <div class="netra-ai-bubble">${htmlContent}</div>
        <div class="netra-ai-msg-time">${timeStr}</div>
      </div>
    `;
    chatHistory.insertAdjacentHTML('beforeend', html);
    scrollToBottom();
  }

  function simulateAiResponse(userText) {
    isAiTyping = true;
    appendAiTyping();
    
    // Simulate network delay
    setTimeout(() => {
      removeAiTyping();
      
      let responseHtml = "";
      
      if (userText.toLowerCase().includes("deploy") || userText.toLowerCase().includes("patrol")) {
        responseHtml = `
          <h4>🚨 Patrol Recommendation</h4>
          <p><strong>High Risk Area:</strong> Koramangala Sector 3</p>
          <p><strong>Risk Score:</strong> 92%</p>
          <p><strong>Reason:</strong></p>
          <ul>
            <li>12 robberies in the last 48 hours</li>
            <li>High evening footfall</li>
            <li>Previous repeat offender activity</li>
            <li>Festival crowd expected tonight</li>
          </ul>
          <p><strong>Recommended Action:</strong></p>
          <ul>
            <li>Deploy 3 patrol units</li>
            <li>Activate CCTV monitoring</li>
            <li>Schedule drone surveillance</li>
            <li>Increase highway checkpoints</li>
          </ul>
          <p><strong>Confidence:</strong> 96%</p>
        `;
      } else {
        // Generic fallback response
        responseHtml = `<p>I have analyzed your request regarding "<strong>${escapeHtml(userText)}</strong>".</p>
          <p>Based on current intelligence and active databases, I recommend reviewing the latest hotspot data on the dashboard for real-time correlations. Would you like me to generate a detailed pdf report for this query?</p>`;
      }

      appendAiMessage(responseHtml);
      isAiTyping = false;
    }, 1200 + Math.random() * 800);
  }

  function scrollToBottom() {
    chatHistory.scrollTo({
      top: chatHistory.scrollHeight,
      behavior: 'smooth'
    });
  }

  function getFormattedTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;")
         .replace(/\n/g, "<br>");
  }
});
