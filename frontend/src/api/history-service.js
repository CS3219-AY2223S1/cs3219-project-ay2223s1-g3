//const history_service_url = 'http://localhost:8003/api/history/';
const history_service_url =
  "https://history-service-xkpqea35pq-as.a.run.app/api/history/";
/**
 * Returns qns done for user with username
 * @param {*} username
 * @returns {
 *  message: String
 *  data: [{ question: Number, difficulty: String, title: String, roommates: [String] }]
 * }
 */

const headerConfig = {
  headers: {
    Authorization: document.cookie,
    "Content-Type": "application/json",
  },
};

export async function getQuestionsDone(username) {
  return await fetch(history_service_url + "getQuestionsDone", {
    method: "POST",
    headers: {
      Authorization: document.cookie,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: username }),
    //credentials: 'include',
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
 * @param {*} title
 * @param {*} roommates
 * @returns {
 *  message: String
 * }
 */
export async function addQuestionDone(
  username,
  questionNum,
  difficulty,
  title,
  roommates
) {
  return await fetch(history_service_url + "addQuestionDone", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: document.cookie,
    },
    body: JSON.stringify({
      username: username,
      questionDone: {
        question: questionNum,
        difficulty: difficulty,
        title,
        roommates,
      },
    }),
    //credentials: "include",
  })
    .then((res) => {
      if (!res.ok) {
        return Promise.reject(res);
      }
      return res.json();
    })
    .catch((err) => console.log(err));
}
