//const question_service_url = "http://localhost:8002/"
const question_service_url = "https://question-service-xkpqea35pq-as.a.run.app/";

const defaultQn = {
  num: 0,
  question: "What is love?",
  difficultyLevel: "hard"
}

/**
 * Gets question for room
 * @param {*} difficultyLevel
 * @param {*} roommates
 * @param {*} questionsDone
 * @returns {
 *  num: Number,
 *  title: String
 * }
 */
export async function getQuestion(difficultyLevel, roommates, questionsDone) {
  return await fetch(question_service_url + difficultyLevel, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      roommates: roommates,
      questionsDone: questionsDone
    }),
  })
  .then(res => {
    if (!res.ok) {
      return Promise.reject(res)
    }
    return res.json()
  })
  .then(res => {
    let question = defaultQn;
    if (res && Object.keys(res).length !== 0) {
      question = res
    }
    return question;
  })
  .catch(err => console.log(err))
}
