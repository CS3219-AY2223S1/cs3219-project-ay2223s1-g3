import { createUser, usernameInDb, getUser } from './repository.js';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

//need to separate orm functions from repository to decouple business logic from persistence
export async function ormCreateUser(username, originalPassword) {
    try {
        if (await usernameInDb(username)) {
            return false
        } else {
            const password = bcrypt.hashSync(originalPassword)
            const newUser = await createUser({username, password});
            newUser.save();
            return true;
        }
    } catch (err) {
        console.log('ERROR: Could not create new user');
        return { err };
    }
}

export async function ormLogInUser(username, password) {
    try {
        const exists = await usernameInDb(username)
        if (!exists) {
            return null
        }
        const user = await getUser(username)
        const pwValidity = bcrypt.compareSync(password, user.password)
        if (!pwValidity) {
            return null
        }
        const token = jwt.sign({id: username}, process.env.JWT_KEY, {expiresIn: 86400})
        console.log(token)
        user.jwt = token
        return user
    } catch (err) {
        console.log(`ERROR: Could not retrieve user: ${username}`)
        return { err }
    }
}

