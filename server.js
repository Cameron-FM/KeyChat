//Create express app and server
const express = require("express");
const app = express();
const server = require("http").Server(app); //Create http server
const io = require("socket.io")(server); //Server will run on the socket.io connection (Port 3000)

//Set up express server
app.set("views", "./views"); //Set where are view will come from
app.set("view engine", "ejs"); //Tell app views to use ejs
app.use(express.static("public")); //State the public folder where client side JS will be held
app.use(express.urlencoded({ extended: true })); //Allows app to use URL encoded parameters inside of a body for a form

//Create object for chat rooms
const rooms = {};

//Create routes for the server
app.get("/", (req, res) => {
  res.render("index", { rooms: rooms });
});

app.post("/room", (req, res) => {
  if (rooms[req.body.room] != null) {
    //If name of room already exists
    return res.redirect("/"); //Redirect to room select page
  }
  rooms[req.body.room] = { users: {} };
  res.redirect(req.body.room); //Redirect to choosen room
});

app.get("/:room", (req, res) => {
  if (rooms[req.params.room] == null) {
    return res.redirect("/");
  }
  res.render("room", { roomName: req.params.room });
});

//Server will listen on port 3000
server.listen(3000);

//Get the rooms a specific user is in
function getUserRooms(socket) {
  return Object.entries(rooms).reduce((names, [name, room]) => {
    if (room.users[socket.id] != null) names.push(name); //If there is a user with this socket ID, push in the name of the room
    return names; //Returns to use in next itteration of the reduce method
  }, []);
}

//Log whenever a new user connects
io.on("connection", socket => {
  //Broadcast that a new user had joined to al other users in that specific room
  socket.on("new-user", (room, username) => {
    socket.join(room);
    rooms[room].users[socket.id] = username; //Assign the users name to their socket ID and store in the object with the room name their in
    socket.to(room).broadcast.emit("user-connected", username);
  });

  //Searchs the rooms object for a room that matchs search
  //Recvies id & text from client but doesnt run line 59
  socket.on("room-search", (id, text) => {
    Array.from(Object.keys(rooms)).forEach(room => {
      if (room.slice(0, text.length).includes(text)) {
        io.to(id).emit("search-items", room);
        console.log(id, text, room);
      }
    });
  });

  //Broadcast a user disconnect message to all other users in that specific room
  socket.on("disconnect", () => {
    getUserRooms(socket).forEach(room => {
      socket
        .to(room)
        .broadcast.emit("user-disconnected", rooms[room].users[socket.id]);
      delete rooms[room].users[socket.id]; // Delete users ID from the object with the room name their in
    });
  });

  //Broadcast chat message to all other users in that specific room
  socket.on("send-chat-message", (room, message) => {
    socket.to(room).broadcast.emit("recive-chat-message", {
      name: rooms[room].users[socket.id],
      message: message
    });
  });
});
