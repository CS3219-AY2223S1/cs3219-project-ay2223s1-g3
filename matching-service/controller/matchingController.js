import { ormCreateMatch, findMatch as _findMatch, deleteRoom, existInDb, findRoomName } from '../model/matching-orm.js';

async function sendMessage(socket, io, message) {
    const roomID = await findRoomName(socket.id)
    console.log("socket making message", socket.id, message)
    console.log("room in db",  roomID);
    console.log("room connected to", socket.rooms);
    socket.to(roomID).emit('send-message', { room: roomID, message: message }); 
}

async function findMatch(difficulty, socket, io) {
    console.log("findMatch called", socket.id);
    const ifExist = await existInDb(socket.id)
    if (ifExist) {
        return;
    }
    let roomID = await _findMatch(difficulty);
    console.log("roomID", roomID);
    if (roomID === undefined || roomID === null) {
        // create a unique roomID, cannot just use socket.id as the function sendMessage will fail. 
        //socket.to(socket.id) wont work as .to() will not send a message to a room with its own id.
        roomID = socket.id + "1";
        console.log("roomID created", roomID)
        const newMatch = ormCreateMatch(socket.id, roomID, difficulty, false);
        socket.join(roomID);
        io.emit("new room created", socket.id);
        io.emit("user joined room", socket.id);
    } else {
        const newMatch = ormCreateMatch(socket.id, roomID, difficulty, true);
        socket.join(roomID);
        io.emit("user joined room", roomID);
    }
}

async function disconnect_match(socket, io, message) {
    const roomID = await findRoomName(socket.id);
    await deleteRoom(roomID);
    socket.to(roomID).emit('disconnect-event', { 
        room: roomID, 
        user: roomID + " room will be closed as" + message + " has left"});
    socket.leave(roomID);
}

export function createListeners(socket, io) {
    socket.on('find-match', async(difficulty) => await findMatch(difficulty, socket, io));
    socket.on('send-message', async (message) => await sendMessage(socket, io, message));
    socket.on('disconnect-match', async (message) => await disconnect_match(socket, io, message));
}