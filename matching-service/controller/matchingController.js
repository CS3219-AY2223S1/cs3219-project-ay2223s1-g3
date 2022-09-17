import { v4 as uuidv4 } from 'uuid';
import { ormCreateMatch, findMatch as _findMatch, deleteRoom, existInDb } from '../model/matching-orm.js';

function createRoomId() {
    return uuidv4();
}

async function findMatch(difficulty, socket, io) {
    console.log("findMatch called", socket.id);
    const ifExist = await existInDb(socket.id)
    if (ifExist) {
        console.log("??");
        return;
    }
    const roomID = await _findMatch(difficulty);
    console.log("roomId", roomID);
    if (roomID === undefined || roomID === null) {
        //const newRoomID = createRoomId();
        const newMatch = ormCreateMatch(socket.id, socket.id, difficulty, false);
        socket.join(socket.id);
        io.emit("new room created", socket.id);
        io.emit("user joined room", socket.id);
    } else {
        const newMatch = ormCreateMatch(socket.id, socket.id, difficulty, true);
        socket.join(socket.id);
        io.emit("room joined", roomID);
        io.emit("user joined room", socket.id);
    }
}

export function createListeners(socket, io) {
    socket.on('find-match', async(difficulty) => await findMatch(difficulty, socket, io))
}