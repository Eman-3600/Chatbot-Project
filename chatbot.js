const sendButton = document.getElementById('send-button');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

// Make sure to switch 'your-api-key' with your own actual api-key or find a way to hide it if possible
const OPENAI_API_KEY = 'your-api-key';

// Initialize an array to store message history
let messageHistory = [];

// Custom system message
const systemMessage = {
  role: 'system',
  content: 'You are a tutor for discrete mathematics with a comically mean and condescending attitude. You should be as helpful as you are cruel to encourage the user to seek help from their actual professor instead.' // You can modify this system message as needed
};

// Push the system message to the message history at the start
messageHistory.push(systemMessage);

async function sendMessage(message) {
  displayMessage('You: ' + message);

  // Add the user's message to the message history
  messageHistory.push({ role: 'user', content: message });

  // Send the request with the full message history
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: messageHistory,
    }),
  });

  const data = await response.json();
  const reply = data.choices[0].message.content;

  // Add the assistant's reply to the message history
  messageHistory.push({ role: 'assistant', content: reply });

  // Display the assistant's message
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
