const question_service_url = "http://localhost:8002/"

const defaultQn = {
  num: 0,
  question: "What is love?",
  difficultyLevel: "hard"
}

export async function getQuestion(difficultyLevel, roommates) {
  return await fetch(question_service_url + difficultyLevel, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(roommates),
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
