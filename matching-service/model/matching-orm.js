import { createMatch, passDatabase } from "./repository.js";

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
  //console.log("socketId", socketID);
  const db = passDatabase();
  const collection = await db.findOne({ socketID: socketID });
  console.log("collection is", collection);
  return collection !== null;
}

// returns roomID of the match, and updates the match found to matched.
export async function findMatch(difficulty) {
  try {
    const db = passDatabase();
    const filter = {
      difficulty: difficulty,
      matched: false
    };
    const document = await db.findOneAndUpdate(filter, {
        "$set": {
            "matched": true
        }
    });
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
    const db = passDatabase();
    const query = {
      roomID: roomID,
    };
    await db.deleteMany(query);
  } catch (err) {
    console.log("ERROR: Could not create new Match");
    return { err };
  }
}
