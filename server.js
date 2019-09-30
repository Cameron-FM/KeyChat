//Create express app and server
const express = require('express')
const app = express()
const server = require('http').Server(app) //Create http server
const io = require('socket.io')(server) //Server will run on the socket.io connection (Port 3000)

//Set up express server
app.set('views', './views') //Set where are view will come from
app.set('view engine', 'ejs') //Tell app views to use ejs
app.use(express.static('public')) //State the public folder where client side JS will be held
app.use(express.urlencoded({extended: true})) //Allows app to use URL encoded parameters inside of a body for a form

const rooms = { name: {}}
const users = {}

//Create routes for the server
app.get('/', (req, res) => {
  res.render('index', {rooms: rooms})
})

app.post('/room', (req, res) => {
  if (rooms[req.body.room] != null){ //If name of room already exists
    return res.redirect('/') //Redirect to room select page
  }
  rooms[req.body.room] = {users: {}}
  res.redirect(req.body.room) //Redirect to choosen room
})

app.get('/:room', (req, res) => {
  res.render('room', {roomName: req.params.room})
})

//Server will listen on port 3000
server.listen(3000)

//Log whenever a new user connects
io.on('connection', socket => {
  //Broadcast that a new user had joined to al other users
  socket.on('new-user', username => {
    users[socket.id] = username //Assign the users name to their socket ID
    socket.broadcast.emit('user-connected', username)
  })
  //Broadcast a user disconnect message to all other users
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id])
    delete users[socket.id] // Delete users ID from the user array
  })
  //Broadcast chat message to all other users
  socket.on('send-chat-message', message => {
    socket.broadcast.emit('chat-message', {name: users[socket.id], message: message})
  })
})
