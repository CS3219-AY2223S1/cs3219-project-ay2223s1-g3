const history_service_url = 'http://localhost:8003/api/history/';

/**
 * Returns qns done for user with username
 * @param {*} username
 * @param {*} token
 * @returns {
 *  message: String
 *  data: [{ question: Number, difficulty: String }]
 * }
 */
export async function getQuestionsDone(username) {
  return await fetch(history_service_url + 'getQuestionsDone', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username: username }),
    credentials: 'include',
  })
    .then((res) => {
      if (!res.ok) {
        return Promise.reject(res);
      }
      return res.json();
    })
    .catch((err) => console.log(err));
}

/**
 * Adds question for user with username to history
 * @param {*} username
 * @param {*} questionNum
 * @param {*} difficulty
 * @param {*} token
 * @returns {
 *  message: String
 * }
 */
export async function addQuestionDone(username, questionNum, difficulty) {
  return await fetch(history_service_url + 'addQuestionDone', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: username,
      questionDone: { question: questionNum, difficulty: difficulty },
    }),
    credentials: "include",
  })
    .then((res) => {
      if (!res.ok) {
        return Promise.reject(res);
      }
      return res.json();
    })
    .catch((err) => console.log(err));
}
