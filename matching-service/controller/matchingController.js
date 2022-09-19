import { ormCreateMatch, findMatch as _findMatch, deleteRoom, existInDb, findMatchDoc } from '../model/matching-orm.js';

async function sendChatMessage(socket, io, message) {
    const doc = await findMatchDoc(socket.id)
    console.log("socket making message", socket.id, message)
    console.log("room connected to", socket.rooms);
    const clients = io.sockets.adapter.rooms.get(doc.chatRoomID);
    console.log("clients are", clients)
    socket.broadcast.to(doc.chatRoomID).emit('send-chat-message', { room: doc.chatRoomID, message: message }); 
    //socket.emit('send-chat-message', { room: doc.chatRoomID, message: message })
}

async function sendMessage(socket, io, message) {
    const doc = await findMatchDoc(socket.id)
    console.log("socket making message", socket.id, message)
    console.log("room connected to", socket.rooms);
    socket.to(doc.roomID).emit('send-message', { room: doc.roomID, message: message }); 
}

async function findMatch(difficulty, socket, io) {
    console.log("findMatch called", socket.id);
    const ifExist = await existInDb(socket.id)
    if (ifExist) {
        return;
    }
    let doc = await _findMatch(difficulty);
    let chatRoomID = "";
    let roomID = "";
    if (doc === undefined || doc === null) {
        // create a unique roomID, cannot just use socket.id as the function sendMessage will fail. 
        //socket.to(socket.id) wont work as .to() will not send a message to a room with its own id.
        roomID = socket.id + "collab";
        chatRoomID = socket.id + "chatRoom";
        const newMatch = ormCreateMatch(socket.id, roomID, chatRoomID, difficulty, false);
        socket.join(roomID);
        socket.join(chatRoomID);
        io.emit("new room created", socket.id);
        io.emit("user joined room", socket.id);
    } 
    
    // case where a match is found. front end needs to listen to the socket.io emit
    else {
        const newMatch = ormCreateMatch(socket.id, doc.roomID, doc.chatRoomID, difficulty, true);
        socket.join(doc.roomID);
        socket.join(doc.chatRoomID);
        io.emit("user joined room", roomID);

        // frontend listens to "match-found" and bring users to coding page".
        socket.to(roomID).emit("match-found");
    }
}

async function disconnect_match(socket, io, message) {
    const doc = await findMatchDoc(socket.id);
    await deleteRoom(doc.roomID);
    socket.to(doc.roomID).emit('disconnect-event', { 
        room: doc.roomID, 
        user: doc.roomID + " room will be closed as" + message + " has left"});
    socket.leave(doc.roomID);
    socket.leave(doc.chatRoomID);
}

export function createListeners(socket, io) {
    socket.on('find-match', async(difficulty) => await findMatch(difficulty, socket, io));
    socket.on('send-chat-message', async(message) => await sendChatMessage(socket, io, message));
    socket.on('send-message', async (message) => await sendMessage(socket, io, message));
    socket.on('disconnect-match', async (message) => await disconnect_match(socket, io, message));
}