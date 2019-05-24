/// Web Socket
const wss = require('ws');
/// Start Websocket Server
const ws = new wss.Server({port: 8080}, () => {
    console.log(`Signaling Server Is Now Listening : 8080`)
});
/// Channels List
var channels = {
    room1: [],
    room2: []
}

/// On Connection 
ws.on('connection', (socket) => {
    console.log(`Connected User ${ws.clients.size}`)
    /// On Socket Message
    socket.onmessage = (message) => {
        /// Convert Buffer To JSON 
        let data = JSON.parse(message.data)
        let roomID = data.payload.room
        /// If Rooms Exists.
        if (!channels.hasOwnProperty(roomID)) console.log(`Unable to locate room`)
        /// Push User Into Room
        var room =channels[roomID]
        if (room)
            room.push(socket)
        else 
            room = [socket]
        /// Boardcast User
        wss.broadcast(room, socket, message);
    }
});

/// Broadcast To All
wss.broadcast = (room, socket, message) => {
    for (var i = 0; i < room.length; i++) {
        if (room[i] !== socket && room[i].readyState === wss.OPEN) {
            room[i].send(message.data);
        }
    }
};
