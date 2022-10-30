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