const sendButton = document.getElementById('send-button');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

// Make sure to switch 'your-api-key' with your own actual api-key or find a way to hide it if possible
const OPENAI_API_KEY = 'your-api-key';

async function sendMessage(message) {
  displayMessage('You: ' + message);

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
    }),
  });

  const data = await response.json();
  const reply = data.choices[0].message.content;
  displayMessage('Bot: ' + reply);
}

function displayMessage(message) {
  const messageElement = document.createElement('p');
  messageElement.textContent = message;
  chatBox.appendChild(messageElement);
}

sendButton.addEventListener('click', () => {
  const message = userInput.value.trim();
  if (message) {
    sendMessage(message);
    userInput.value = '';
  }
});

userInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    sendButton.click();
  }
});
