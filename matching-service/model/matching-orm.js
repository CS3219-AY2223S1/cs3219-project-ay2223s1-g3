import { createMatch } from "./repository.js";
import MatchModel from "./matching-model.js";

export async function ormCreateMatch(socketID, roomID, difficulty, matched) {
  try {
    console.log("socketID", socketID);
    const newMatch = await createMatch({
      socketID,
      roomID,
      difficulty,
      matched,
    });
    newMatch.save();
    return true;
  } catch (err) {
    console.log("ERROR: Could not create new Match");
    return { err };
  }
}

export async function existInDb(socketID) {

  const collection = await MatchModel.findOne({ socketID: socketID });
  console.log("collection is", collection);
  return collection !== null;
}

// returns roomID of the match, and updates the match found to matched.
export async function findMatch(difficulty) {
  try {
    const filter = {
      difficulty: difficulty,
      matched: false,
    };
    const count = await MatchModel.count({});
    console.log(count);
    const document = await MatchModel.findOneAndUpdate(
      { difficulty: difficulty, matched: false },
      {
        $set: {
          matched: true,
        },
      }
    );
    console.log(document);
    if (document === undefined || document === null) {
      return undefined;
    }
    return document.roomID;
  } catch (err) {
    console.log("ERROR: Could not update new match");
    return { err };
  }
}

// deletes all documents with the corresponding roomID.
export async function deleteRoom(roomID) {
  try {
    console.log("room to delete", roomID)
    await MatchModel.deleteMany({
      roomID: roomID
    });
  } catch (err) {
    console.log("ERROR: Could not delete matches");
    return { err };
  }
}

export async function findRoomName(socketID) {
  try {
    const doc = await MatchModel.findOne({ socketID : socketID });
    return doc.roomID;
  } catch (err) {
    console.log("ERROR: Could not find roomName");
    return { err };
  }
}