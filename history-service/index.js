import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const corsConfig = {
  credentials: true,
  origin: true,
};

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsConfig)); // config cors so that front-end can use
app.options('*', cors());

import { getQuestionsDone, addQuestionDone, deleteHistory } from './controller/history-controller.js';

const router = express.Router();

// Controller will contain all the Routes
router.get('/', (_, res) => res.send('Hello World from Hiservice'));
router.post('/getQuestionsDone', getQuestionsDone);
router.post('/addQuestionDone', addQuestionDone);
router.post('/deleteHistory', deleteHistory);

app.use('/api/history', router).all((_, res) => {
  res.setHeader('content-type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', 'https://history-service-xkpqea35pq-as.a.run.app');
});

app.listen(8003, () => console.log('history-service listening on port 8003'));

export default app;
