import { createUser, usernameInDb, getUser, deleteUser } from './repository.js';
import { addToBlacklist } from './token-blacklist.js'
import { signToken, verifyToken } from '../middleware/authentication.js'
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

export async function ormLoginUser(username, password) {
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
        const jwt = await signToken(username)
        user.save()
        return jwt
    } catch (err) {
        console.log(`ERROR: Could not retrieve user: ${username}`)
        return { err }
    }
}

export async function ormLogoutUser(username, jwt) {
    try {
        const exists = await usernameInDb(username)
        if (!exists) {
            return false
        }
        const user = await getUser(username)
        // authentication
        const verification = await verifyToken(username, jwt)
        if (!verification || verification.err) {
            console.log(`ERROR: Verification failed for user: ${username}`)
            return false
        }
        // blacklisting
        const exp = verification.exp
        if (!await addToBlacklist(jwt, exp)) {
            console.log(`ERROR: Unable to add user: ${username}'s JWT to redis database`)
            return false
        }
        return true
    } catch (err) {
        console.log(`ERROR: Could not retrieve user: ${username}`)
        return { err }
    }
}

export async function ormDeleteUser(username, password, jwt) {
    try {
        const exists = await usernameInDb(username)
        if (!exists) {
            return false
        }
        const user = await getUser(username)
        const pwValidity = bcrypt.compareSync(password, user.password)
        if (!pwValidity) {
            return false
        }
        // authentication
        const verification = await verifyToken(username, jwt)
        if (!verification || verification.err) {
            console.log(`ERROR: Verification failed for user: ${username}`)
            return false
        }
        // blacklisting
        const exp = verification.exp
        if (!await addToBlacklist(jwt, exp)) {
            console.log(`ERROR: Unable to add user: ${username}'s JWT to redis database`)
            return false
        }
        const success = await deleteUser(username)
        return success
    } catch (err) {
        console.log(`ERROR: Could not delete user: ${username}`)
        return { err }
    }
}

export async function ormPwChange(username, oldPw, newPw, jwt) {
    try {
        const exists = await usernameInDb(username)
        if (!exists) {
            return false
        }
        const user = await getUser(username)
        const pwValidity = bcrypt.compareSync(oldPw, user.password)
        if (!pwValidity) {
            return false
        }
        // authentication
        const verification = await verifyToken(username, jwt)
        if (!verification || verification.err) {
            console.log(`ERROR: Verification failed for user: ${username}`)
            return false
        }
        user.password = bcrypt.hashSync(newPw)
        user.save()
        return true
    } catch (err) {
        console.log(`ERROR: Could not change password for user: ${username}`)
        return { err }
    }
}

