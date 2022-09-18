import { ormCreateUser as _createUser } from '../model/user-orm.js'
import { ormLogInUser as _logInUser } from '../model/user-orm.js'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

export async function createUser(req, res) {
    try {
        const { username, password } = req.body;
        if (username && password) {
            const resp = await _createUser(username, password);
            console.log(resp);
            if (resp.err) {
                return res.status(400).json({message: 'Could not create a new user!'});
            } else {
                if (resp) {
                    console.log(`Created new user ${username} successfully!`)
                    return res.status(201).json({message: `Created new user ${username} successfully!`});
                } else {
                    console.log(`Username ${username} already exist! Please use a different username.`)
                    return res.status(400).json({message: `Username ${username} already exist! Please use a different username.`});
                }
            }
        } else {
            return res.status(400).json({message: 'Username and/or Password are missing!'});
        }
    } catch (err) {
        return res.status(500).json({message: 'Database failure when creating new user!'})
    }
}

export async function loginUser(req, res) {
    try {
        const { username, password } = req.body
        if (username && password) {
            const resp = await _logInUser(username, password)
            if (resp.err) {
                console.log(`Unable to retrieve user: ${username}`)
                return res.status(400).json({message: `Unable to retrieve user: ${username}`})
            }
            if (!resp) {
                console.log('Incorrect username or password. Please try again!')
                return res.status(400).json({message: 'Incorrect username or password. Please try again!'})
            }
            return res.status(201).json({message: 'Login successful!', userJWT: resp.jwt})
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({message: 'Authentication failure when logging in!'})
    }
}
