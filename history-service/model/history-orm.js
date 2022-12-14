import { historyInDb, createHistory, deleteHistory, getQuestionsDone, addQuestionDone } from './repository.js';
import { verifyToken } from '../middleware/authentication.js';

//need to separate orm functions from repository to decouple business logic from persistence

export async function ormGetQuestionsDone(username, jwt) {
  try {
    const exists = await historyInDb(username);
    if (!exists) {
      return [];
    }
    // authentication
    const verification = await verifyToken(username, jwt)
    if (!verification || verification.err) {
      console.log(verification)
        console.log(`ERROR: Verification failed for user: ${username}`)
        return null
    }
    const questionsDone = await getQuestionsDone(username);
    return questionsDone;
  } catch (err) {
    console.log(`ERROR: Could not get questions done: ${username}`);
    return { err };
  }
}

export async function ormAddQuestionDone(username, questionDone, jwt) {
  try {
    // authentication
    const verification = await verifyToken(username, jwt)
    if (!verification || verification.err) {
        console.log(`ERROR: Verification failed for user: ${username}`)
        return false
    }
    const exists = await historyInDb(username);
    if (!exists) {
      let newHistory = await createHistory(username, [questionDone]);
      newHistory.save();
      return newHistory;
    }
    const success = await addQuestionDone(username, questionDone);
    return success;
  } catch (err) {
    console.log(`ERROR: Could not add questions done: ${username}`);
    return { err };
  }
}

export async function ormDeleteHistory(username, jwt) {
  try {
    const exists = await historyInDb(username);
    if (!exists) {
      return true;
    }
    // // authentication
    // const verification = await verifyToken(username, jwt)
    // if (!verification || verification.err) {
    //     console.log(`ERROR: Verification failed for user: ${username}`)
    //     return null
    // }
    const success = await deleteHistory(username);
    return success;
  } catch (err) {
    console.log(`ERROR: Could not delete history: ${username}`);
    return { err };
  }
}
