//Where the server is hosting the socket.js application
const socket = io ('http://localhost:3000')

//Get data from HTML elements
const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')

//Whenever the client recives a message run appendMessage()
socket.on('chat-message', data => {
  appendMessage(data)
})

//Listen for submit button press
messageForm.addEventListener('submit', e => {
  e.preventDefault() //Stop page from auto reloading when form is submitted
  const message = messageInput.value
  socket.emit('send-chat-message', message)//Send chat message to server
  messageInput.value = ''//Clear the input field
})

//Append a message element to the page containing the message data
function appendMessage(message){
  messageElement = document.createElement('div')
  messageElement.innerText = message
  messageContainer.append(messageElement)

}
