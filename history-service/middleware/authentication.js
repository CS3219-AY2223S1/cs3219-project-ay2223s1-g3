import { inBlacklist } from '../model/token-blacklist.js'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

const TOKEN_EXPIRY = 3600

export async function signToken(username) {
    try {
        const token = jwt.sign({id: username}, process.env.JWT_KEY, {expiresIn: TOKEN_EXPIRY})
        return token
    } catch (err) {
        console.log(`ERROR: Unable to generate JWT for ${username}`)
        return { err }
    }
}

export async function verifyToken(username, token) {
    try {
        if (await inBlacklist(token)) {
            console.log(`ERROR: User: ${username}'s JWT is in blacklist`)
            return null
        }
        const decoded = jwt.verify(token, process.env.JWT_KEY)
        if (decoded.id != username) {
            return null
        }
        return decoded
    } catch (err) {
        console.log(`ERROR: Unable to verify JWT for ${username}`)
        return { err }
    }
}