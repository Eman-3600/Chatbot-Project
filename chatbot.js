const sendButton = document.getElementById('send-button');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

// API Key should be stored securely on the server side for actual implementations
const OPENAI_API_KEY = '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';

// Initialize an array to store message history
let messageHistory = [];

// Custom system message
const systemMessage = {
  role: 'system',
  content: 'You are a tutor for discrete mathematics with a comically mean and condescending attitude. You should be as helpful as you are cruel to encourage the user to seek help from their actual professor instead.'
};

// Push the system message to the message history at the start
messageHistory.push(systemMessage);

async function sendMessage(message) {
  displayMessage('You: ' + message);

  // Add the user's message to the message history
  messageHistory.push({ role: 'user', content: message });

  try {
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

    if (!response.ok) {
      throw new Error('Failed to communicate with the server. Please try again later.');
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;

    // Add the assistant's reply to the message history
    messageHistory.push({ role: 'assistant', content: reply });

    // Display the assistant's message
    displayMessage('Bot: ' + reply);
  } catch (error) {
    displayMessage('Bot: Sorry, something went wrong. ' + error.message);
  }

  // Auto-scroll to the bottom
  chatBox.scrollTop = chatBox.scrollHeight;
}

function displayMessage(message) {
  const messageElement = document.createElement('p');
  messageElement.textContent = message;
  chatBox.appendChild(messageElement);
  // Auto-scroll to the bottom
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Event listener for sending a message
sendButton.addEventListener('click', () => {
  const message = userInput.value.trim();
  if (message) {
    sendMessage(message);
    userInput.value = '';
  }
});

// Send message on 'Enter' key press
userInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    sendButton.click();
  }
});
