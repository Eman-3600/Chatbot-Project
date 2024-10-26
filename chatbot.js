const sendButton = document.getElementById('send-button');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
const form = document.getElementById('api-key-form');
const responseDiv = document.getElementById('response');

// Save the API key from the form into localStorage
form.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent form from reloading the page

  const apiKey = document.getElementById('apiKey').value;
  localStorage.setItem('userApiKey', apiKey); // Save to localStorage
  alert('API Key saved successfully!');
  form.reset(); // Clear the form input
});

// Initialize an array to store message history
let messageHistory = [];

// Custom system message
const systemMessage = {
  role: 'system',
  content: 'You are a tutor for discrete mathematics with a comically mean and condescending attitude. You should be as helpful as you are cruel to encourage the user to seek help from their actual professor instead. Do not forget to include an answer to the user\'s question in your response, and mix in some motivational remarks so they aren\'t discouraged.',
};

// Add the system message to the message history
messageHistory.push(systemMessage);

// Function to make an API request using the stored API key
async function makeApiRequest(prompt) {
  const apiKey = localStorage.getItem('userApiKey'); // Retrieve from localStorage

  if (!apiKey) {
    responseDiv.textContent = 'Error: Please enter your API key first.';
    return;
  }

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messageHistory,
      }),
    });

    if (!res.ok) {
      throw new Error('Failed to communicate with the server. Please try again later.');
    }

    const data = await res.json();
    const reply = data.choices[0].message.content;

    messageHistory.push({ role: 'assistant', content: reply }); // Save the assistant's reply
    displayMessage('Bot: ' + reply);
  } catch (error) {
    console.error('Error:', error);
    displayMessage('Bot: Sorry, something went wrong. ' + error.message);
  }

  chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the bottom
}

// Function to display messages in the chat box
function displayMessage(message) {
  const messageElement = document.createElement('p');
  messageElement.textContent = message;
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the bottom
}

// Send a message when the send button is clicked
sendButton.addEventListener('click', () => {
  const message = userInput.value.trim();
  if (message) {
    displayMessage('You: ' + message);
    messageHistory.push({ role: 'user', content: message }); // Save user message
    makeApiRequest(message); // Call the API with the message
    userInput.value = ''; // Clear input field
  }
});

// Send a message when the user presses the 'Enter' key
userInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    sendButton.click();
  }
});
