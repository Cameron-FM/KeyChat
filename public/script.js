//Where the server is hosting the socket.js application
const socket = io("http://localhost:3000");

//Get data from HTML elements
const messageContainer = document.getElementById("message-container");
const messageForm = document.getElementById("send-container");
const messageInput = document.getElementById("message-input");
const searchForm = document.getElementById("search-bar");
const searchBar = document.getElementById("search-input");
const roomsContainer = document.getElementById("room-container");

let searchedForRooms = [];

//Sends the users search to the server everytime they lift a key
if (searchForm != null) {
  searchBar.addEventListener("keyup", e => {
    let searchText = document.getElementById("search-input").value.toLowerCase();
    socket.emit("room-search", socket.id, searchText);
  });

  //searchedForRooms.forEach(room => {
  //console.log(searchText);
  //if (room.slice(0, searchText.length).includes(searchText)) {
  //roomsContainer.removeChild(room + searchedForRooms.indexOf(room))
  //}
  //});
}

//Only runs when user joins a server
if (messageForm != null) {
  //Asks user to enter their nickname when joining the server
  const username = prompt("Enter Your Nickname:");
  appendMessage("You Joined The Server");
  socket.emit("new-user", roomName, username);

  //Listen for submit button press
  messageForm.addEventListener("submit", e => {
    e.preventDefault(); //Stop page from auto reloading when form is submitted
    const message = messageInput.value;
    socket.emit("send-chat-message", roomName, message); //Send chat message to server
    appendMessage(`${username}: ${message}`);
    messageInput.value = ""; //Clear the input field
  });
}

//Recvices the items that match the users search
//Doesn't work
socket.on("search-items", room => {
  if (!searchedForRooms.includes(room)) {
    searchedForRooms.push(room);
    let newEl = document.createElement('a');
    newEl.setAttribute("id", room + searchedForRooms.indexOf(room));
    newEl.setAttribute("class", "room");
    newEl.setAttribute('href', "/" + room);
    newEl.innerText = room;
    roomsContainer.appendChild(newEl);
  }
});

//Whenever the client recives a message run appendMessage()
socket.on("recive-chat-message", data => {
  appendMessage(`${data.name}: ${data.message}`);
});

//Whenever a new user connects run appendMessage()
socket.on("user-connected", username => {
  appendMessage(`${username}: Connected To The Server`);
});

//Whenever a new user connects run appendMessage()
socket.on("user-disconnected", username => {
  appendMessage(`${username}: Disconnected From The Server`);
});

//Append a message element to the page containing the message data
function appendMessage(message) {
  messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageContainer.append(messageElement);
}
