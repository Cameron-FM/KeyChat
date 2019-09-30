//Server Will Run on Port 3000
const io = require('socket.io')(3000)

const users = {}

//Log whenever a new user connects
io.on('connection', socket => {
  console.log('User Connected');
  //Broadcast that a new user had joined to al other users
  socket.on('new-user', username => {
    users[socket.id] = username //Assign the users name to their socket ID
    socket.broadcast.emit('user-connected', username)
  })
  //Broadcast chat message to all other users
  socket.on('send-chat-message', message => {
    socket.broadcast.emit('chat-message', {name: users[socket.id], message: message})
  })
})
