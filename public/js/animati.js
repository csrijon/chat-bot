function appendTypingIndicator() {
    const chatBox = document.getElementById('chat-box');
    const typingElement = document.createElement('div');
    typingElement.classList.add('message', 'bot');
    typingElement.innerHTML = `
      <div class="typing-indicator">
        <span></span>
        <span></span>
        <span></span>
      </div>
    `;
    chatBox.appendChild(typingElement);
    chatBox.scrollTop = chatBox.scrollHeight;
  }
  
  function sendMessage() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();
  
    if (message) {
      appendMessage('user', message);
      userInput.value = '';
  
      // Show typing indicator
      appendTypingIndicator();
  
      fetch('/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      })
        .then(response => {
          if (!response.ok) {
            return response.json().then(err => { throw err; });
          }
          return response.json();
        })
        .then(data => {
          // Remove typing indicator and show bot's response
          const chatBox = document.getElementById('chat-box');
          chatBox.lastChild.remove(); // Remove typing indicator
          appendMessage('bot', data.reply);
        })
        .catch(error => {
          console.error('Error:', error);
          const chatBox = document.getElementById('chat-box');
          chatBox.lastChild.remove(); // Remove typing indicator
          appendMessage('bot', error.error || 'An error occurred. Please try again.');
        });
    }
  }