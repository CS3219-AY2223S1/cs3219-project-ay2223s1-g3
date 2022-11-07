import express from 'express';
import cors from 'cors';
import 'dotenv/config'

const corsConfig = {
    credentials: true,
    origin: true,
};

const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors(corsConfig)) // config cors so that front-end can use
app.options('*', cors())

import { createUser, loginUser, logoutUser, deleteUser, pwChange } from './controller/user-controller.js';
import cookieSession from 'cookie-session';

// cookie
app.use(
    cookieSession({
        name: "cs3219-project-session",
        secret: process.env.COOKIE_SECRET,
        httpOnly: true
    })
)

const router = express.Router()

// Controller will contain all the User-defined Routes
router.get('/', (_, res) => res.send('Hello World from user-service'))
router.post('/', createUser)
router.post('/login', loginUser)
router.post('/logout', logoutUser)
router.post('/delete', deleteUser)
router.post('/pwChange', pwChange)

app.use('/api/user', router).all((_, res) => {
    res.setHeader('content-type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*')
})

app.listen(8000, () => console.log('user-service listening on port 8000'));