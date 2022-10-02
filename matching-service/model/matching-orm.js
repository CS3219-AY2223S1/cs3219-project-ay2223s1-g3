import { createMatch, findMatchAndUpdate, deleteMatches, findMatchDocument } from "./repository.js";
import MatchModel from "./matching-model.js";

export async function ormCreateMatch(socketID, roomID, chatRoomID, difficulty, matched, username) {
  try {
    console.log("socketID", socketID);
    const newMatch = await createMatch({
      socketID,
      roomID,
      chatRoomID,
      difficulty,
      matched,
      username,
    });
    newMatch.save();
    return true;
  } catch (err) {
    console.log("ERROR: Could not create new Match");
    return { err };
  }
}

export async function existInDb(socketID) {

  const collection = await findMatchDoc(socketID);
  console.log("collection is", collection);
  return collection !== null;
}

// returns roomID of the match, and updates the match found to matched.
export async function findMatch(difficulty) {
  try {
    const document = await findMatchAndUpdate(difficulty, true);
    console.log(document);
    if (document === undefined || document === null) {
      return undefined;
    }
    return document;
  } catch (err) {
    console.log("ERROR: Could not update new match");
    return { err };
  }
}

// deletes all documents with the corresponding roomID.
export async function deleteRoom(roomID) {
  try {
    console.log("room to delete", roomID)
    await deleteMatches(roomID);
  } catch (err) {
    console.log("ERROR: Could not delete matches");
    return { err };
  }
}

export async function findMatchDoc(socketID) {
  try {
    const doc = await findMatchDocument(socketID);
    return doc;
  } catch (err) {
    console.log("ERROR: Could not find roomName");
    return { err };
  }
}