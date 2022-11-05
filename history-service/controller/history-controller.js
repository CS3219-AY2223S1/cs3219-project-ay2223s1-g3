import { ormGetQuestionsDone as _getQuestionsDone } from '../model/history-orm.js';
import { ormAddQuestionDone as _addQuestionDone } from '../model/history-orm.js';
import { ormDeleteHistory as _deleteHistory } from '../model/history-orm.js';

export async function getQuestionsDone(req, res) {
  try {
    const { username } = req.body;
    if (username) {
      const resp = await _getQuestionsDone(username, req.headers.cookie);
      if (!resp || resp.err) {
        console.log(`Unable to retrieve user: ${username}`);
        return res.status(400).json({ message: `Unable to retrieve user: ${username}` });
      }
      console.log(`Got questions done for username: ${username} successfully!`);
      return res.status(200).json({ message: `Got questions done for username: ${username} successfully!`, data: resp });
    } else {
      return res.status(400).json({ message: 'Username is missing!!' });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Error occurred when getting questions!' });
  }
}

export async function addQuestionDone(req, res) {
  try {
    const { username, questionDone } = req.body;
    if (username && questionDone) {
      const resp = await _addQuestionDone(username, questionDone, req.headers.cookie);
      const jsonQuestionsDone = JSON.stringify(questionDone);
      if (!resp || resp.err) {
        console.log(`Unable to add question: ${username}, ${jsonQuestionsDone}`);
        return res.status(400).json({ message: `Unable to add question: ${username}, ${jsonQuestionsDone}` });
      }
      console.log(`Added question done (${jsonQuestionsDone}) for username: ${username} successfully!`);
      return res.status(200).json({ message: `Added question done (${jsonQuestionsDone}) for username: ${username} successfully!` });
    } else {
      return res.status(400).json({ message: 'Username and/or question are missing!' });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Error occurred when adding question!' });
  }
}

export async function deleteHistory(req, res) {
  try {
    const { username } = req.body;
    if (username) {
      const resp = await _deleteHistory(username, req.headers.cookie);
      if (!resp || resp.err) {
        console.log(`Unable to delete history: ${username}`);
        return res.status(400).json({ message: `Unable to delete history: ${username}` });
      }
      console.log(`Deleted history for username: ${username} successfully!`);
      return res.status(200).json({ message: `Delete history for username: ${username} successfully!` });
    } else {
      return res.status(400).json({ message: 'Username is missing!' });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Error occurred when deleting history!' });
  }
}
