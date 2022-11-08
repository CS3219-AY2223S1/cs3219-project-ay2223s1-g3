import app from '../index.js';
import chai, { assert } from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import HistoryModel from '../model/history-model.js';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

let should = chai.should();
chai.use(chaiHttp);

mongoose.connect(process.env.MONGO_TEST_DB_URL);
const db = mongoose.connection
  .once('open', () => console.log('Connected!'))
  .on('error', (error) => {
    console.warn('Error : ', error);
  });

const hardqn1 = {
  question: 1,
  difficulty: 'Hard',
  title: 'mom',
  roommates: ['you'],
};
const hardqn2 = {
  question: 2,
  difficulty: 'Hard',
  title: 'dad',
  roommates: ['me'],
};

describe('history-service', () => {
  beforeEach(async () => {
    const newHistory = new HistoryModel({
      username: 'dumdum',
      questionsDone: [hardqn1],
    });
    await newHistory.save();
  });

  afterEach((done) => {
    db.collections.historymodels.drop(() => {
      done();
    });
  });

  it('should get questions done from a user', (done) => {
    const username = 'dumdum';
    console.log("key", process.env.JWT_KEY)
    const token = jwt.sign({ id: username }, process.env.JWT_KEY);

    chai
      .request(app)
      .post('/api/history/getQuestionsDone')
      .set('content-type', 'application/json')
      .set('authorization', token)
      .send({
        username: username,
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.data[0].should.be.deep.equal(hardqn1);
        done();
      });
  });

  it('should not get history from no user', (done) => {
    chai
      .request(app)
      .post('/api/history/getQuestionsDone')
      .set('content-type', 'application/json')
      .send({})
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });

  it('should add new history for new user', (done) => {
    const username = 'you';
    const token = jwt.sign({ id: username }, process.env.JWT_KEY);

    chai
      .request(app)
      .post('/api/history/addQuestionDone')
      .set('content-type', 'application/json')
      .set('authorization', token)
      .send({
        username: username,
        questionDone: hardqn1,
      })
      .end((err, res) => {
        res.should.have.status(200);

        chai
          .request(app)
          .post('/api/history/getQuestionsDone')
          .set('content-type', 'application/json')
          .set('authorization', token)
          .send({
            username: username,
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.data[0].should.be.deep.equal(hardqn1);
            done();
          });
      });
  });

  it('should add question done to existing history', (done) => {
    const username = 'dumdum';
    const token = jwt.sign({ id: username }, process.env.JWT_KEY);

    chai
      .request(app)
      .post('/api/history/addQuestionDone')
      .set('content-type', 'application/json')
      .set('authorization', token)
      .send({
        username: username,
        questionDone: hardqn2,
      })
      .end((err, res) => {
        res.should.have.status(200);

        chai
          .request(app)
          .post('/api/history/getQuestionsDone')
          .set('content-type', 'application/json')
          .set('authorization', token)
          .send({
            username: username,
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.data[0].should.be.deep.equal(hardqn1);
            res.body.data[1].should.be.deep.equal(hardqn2);
            done();
          });
      });
  });
});
