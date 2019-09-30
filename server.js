//Server Will Run on Port 3000
const io = require('socket.io')(3000)

//Log whenever a new user connects
io.on('connection', socket => {
  console.log('User Connected');
  //Broadcast chat message to all other users
  socket.on('send-chat-message', message =>{
    socket.broadcast.emit('chat-message', message)
  })
})
