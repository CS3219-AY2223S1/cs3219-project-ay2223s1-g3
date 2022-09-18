import { createUser, usernameInDb, getUser } from './repository.js';
import bcrypt from 'bcryptjs'

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

export async function ormGetUser(username, password) {
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
        return user
    } catch (err) {
        console.log(`ERROR: Could not retrieve user: ${username}`)
        return { err }
    }
}

