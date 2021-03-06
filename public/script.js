//Where the server is hosting the socket.js application
const socket = io('http://localhost:3000')

//Get data from HTML elements
const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')

 //Only runs when user joins a server
if (messageForm != null){
  //Asks user to enter their nickname when joining the server
  const username = prompt('Enter Your Nickname:')
  appendMessage('You Joined The Server')
  socket.emit('new-user', roomName, username)

  //Listen for submit button press
  messageForm.addEventListener('submit', e => {
    e.preventDefault() //Stop page from auto reloading when form is submitted
    const message = messageInput.value
    socket.emit('send-chat-message', roomName, message) //Send chat message to server
    appendMessage(`${username}: ${message}`)
    messageInput.value = '' //Clear the input field
  })
}

//Whenever the client recives a message run appendMessage()
socket.on('recive-chat-message', data => {
  appendMessage(`${data.name}: ${data.message}`)
})

//Whenever a new user connects run appendMessage()
socket.on('user-connected', username => {
  appendMessage(`${username}: Connected To The Server`)
})

//Whenever a new user connects run appendMessage()
socket.on('user-disconnected', username => {
  appendMessage(`${username}: Disconnected From The Server`)
})

//Append a message element to the page containing the message data
function appendMessage(message){
  messageElement = document.createElement('div')
  messageElement.innerText = message
  messageContainer.append(messageElement)

}
