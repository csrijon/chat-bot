document.getElementById('send-btn').addEventListener('click', sendMessage);
document.getElementById('user-input').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

function sendMessage() {
  const userInput = document.getElementById('user-input');
  const message = userInput.value.trim();

  if (message) {
    appendMessage('user', message);
    userInput.value = '';

    appendMessage('bot', 'Typing...');

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
        
        const chatBox = document.getElementById('chat-box');
        chatBox.lastChild.remove(); // Remove "Typing..." message
        appendMessage('bot', data.reply);
      })
      .catch(error => {
        console.error('Error:', error);
        const chatBox = document.getElementById('chat-box');
        chatBox.lastChild.remove(); // Remove "Typing..." message
        appendMessage('bot', error.error || 'An error occurred. Please try again.');
      });
  }
}

function appendMessage(sender, message) {
  const chatBox = document.getElementById('chat-box');
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', sender);
  messageElement.innerHTML = `<p>${message}</p>`;
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
}