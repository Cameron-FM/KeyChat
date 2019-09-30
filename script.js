//Where the server is hosting the socket.js application
const socket = io('http://localhost:3000')

//Get data from HTML elements
const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')

const username = prompt('Enter Your Nickname:')
appendMessage('You Joined The Server')
socket.emit('new-user', username)

//Whenever the client recives a message run appendMessage()
socket.on('chat-message', data => {
  appendMessage(`${data.name}: ${data.message}`)
})

//Whenever a new user connects run appendMessage()
socket.on('user-connected', username => {
  appendMessage(`${username} Connected To The Server`)
})

//Listen for submit button press
messageForm.addEventListener('submit', e => {
  e.preventDefault() //Stop page from auto reloading when form is submitted
  const message = messageInput.value
  socket.emit('send-chat-message', message) //Send chat message to server
  appendMessage(`${username}: ${message}`)
  messageInput.value = '' //Clear the input field
})

//Append a message element to the page containing the message data
function appendMessage(message){
  messageElement = document.createElement('div')
  messageElement.innerText = message
  messageContainer.append(messageElement)

}
