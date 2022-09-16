import { createMatch } from "./repository";

export async function ormCreateMatch(socketID, roomID, level) {
    try {
        const newMatch = await createMatch({socketID, roomID, level});
        newMatch.save();
        return true;
    } catch (err) {
        console.log('ERROR: Could not create new user');
        return { err };
    }
}