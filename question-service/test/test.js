import app, {easys, mediums, hards} from '../index.js'
import chai from 'chai'
import chaiHttp from 'chai-http'

let should = chai.should()
chai.use(chaiHttp)

describe('question-service', () => {

  it('should return same easy qn with same input', (done) => {
    chai.request(app).post('/easy')
    .set('content-type', 'application/json')
    .send(['user1', 'user2'])
    .end((err, res) => {
      res.should.have.status(200)
      res.body.should.be.deep.oneOf(easys)
      let firstRes = res.body

      chai.request(app).post('/easy')
      .set('content-type', 'application/json')
      .send(['user2', 'user1'])
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.eql(firstRes)
        done()
      })
    })

  })

  it('should return same medium qn with same input', (done) => {
    chai.request(app).post('/medium')
    .set('content-type', 'application/json')
    .send(['user1', 'user2'])
    .end((err, res) => {
      res.should.have.status(200)
      res.body.should.be.deep.oneOf(mediums)
      let firstRes = res.body

      chai.request(app).post('/medium')
      .set('content-type', 'application/json')
      .send(['user1', 'user2'])
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.eql(firstRes)
        done()
      })
    })

  })

  it('should return same hard qn with same input', (done) => {
    chai.request(app).post('/hard')
    .set('content-type', 'application/json')
    .send(['user1', 'user2'])
    .end((err, res) => {
      res.should.have.status(200)
      res.body.should.be.deep.oneOf(hards)
      let firstRes = res.body

      chai.request(app).post('/hard')
      .set('content-type', 'application/json')
      .send(['user2', 'user1'])
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.eql(firstRes)
        done()
      })
    })

  })

  it('should return same qns with interleaving requests from diff rooms', (done) => {
    // room 1
    chai.request(app).post('/easy')
    .set('content-type', 'application/json')
    .send(['user1', 'user2'])
    .end((err, res) => {
      res.should.have.status(200)
      res.body.should.be.deep.oneOf(easys)
      let firstRes = res.body
      // room 1
      chai.request(app).post('/easy')
      .set('content-type', 'application/json')
      .send(['user2', 'user1'])
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.eql(firstRes)
      })
    })

    // room 2
    chai.request(app).post('/easy')
    .set('content-type', 'application/json')
    .send(['user3', 'user4'])
    .end((err, res) => {
      res.should.have.status(200)
      res.body.should.be.deep.oneOf(easys)
      let secondRes = res.body
      // room 2
      chai.request(app).post('/easy')
      .set('content-type', 'application/json')
      .send(['user3', 'user4'])
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.eql(secondRes)
        done()
      })
    })

    // room 3
    chai.request(app).post('/hard')
    .set('content-type', 'application/json')
    .send(['user5', 'user6'])
    .end((err, res) => {
      res.should.have.status(200)
      res.body.should.be.deep.oneOf(hards)
      let thirdRes = res.body
      // room 3
      chai.request(app).post('/hard')
      .set('content-type', 'application/json')
      .send(['user6', 'user5'])
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.eql(thirdRes)
      })
    })
  })
})
