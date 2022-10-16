import { ormCreateUser as _createUser } from '../model/user-orm.js'
import { ormLoginUser as _loginUser } from '../model/user-orm.js'
import { ormLogoutUser as _logoutUser } from '../model/user-orm.js'
import { ormDeleteUser as _deleteUser } from '../model/user-orm.js'
import { ormPwChange as _pwChange } from '../model/user-orm.js'

export async function createUser(req, res) {
    try {
        const { username, password } = req.body;
        if (username && password) {
            const resp = await _createUser(username, password);
            if (resp.err) {
                return res.status(400).json({ message: 'Could not create a new user!' });
            } else {
                if (resp) {
                    console.log(`Created new user ${username} successfully!`)
                    return res.status(201).json({ message: `Created new user ${username} successfully!` });
                } else {
                    console.log(`Username ${username} already exist! Please use a different username.`)
                    return res.status(400).json({ message: `Username ${username} already exist! Please use a different username.` });
                }
            }
        } else {
            return res.status(400).json({ message: 'Username and/or Password are missing!' });
        }
    } catch (err) {
        return res.status(500).json({ message: 'Database failure when creating new user!' })
    }
}

export async function loginUser(req, res) {
    try {
        const { username, password } = req.body
        if (username && password) {
            const resp = await _loginUser(username, password)
            if (!resp) {
                console.log('Incorrect username or password. Please try again!')
                return res.status(400).json({ message: 'Incorrect username or password. Please try again!' })
            }
            if (resp.err) {
                console.log(`Unable to retrieve user: ${username}`)
                return res.status(400).json({ message: `Unable to retrieve user: ${username}` })
            }
            console.log(`User ${username} logged in successfully!`)
            req.session.token = resp
            return res.status(201).json({ message: 'Login successful!', token: req.session.token })
        } else {
            return res.status(400).json({ message: 'Username and/or Password are missing!' });
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Authentication failure when logging in!' })
    }
}

export async function logoutUser(req, res) {
    console.log(req.session)
    try {
        const { username } = req.body
        if (username) {
            const resp = await _logoutUser(username, req.headers.cookie)
            if (!resp) {
                console.log('User does not exist!')
                return res.status(400).json({ message: 'User does not exist!' })
            }
            if (resp.err) {
                console.log(`Unable to retrieve user: ${username}`)
                return res.status(400).json({ message: `Unable to retrieve user: ${username}` })
            }
            console.log(`User ${username} logged out successfully!`)
            return res.status(201).json({ message: 'Logout successful!' })
        } else {
            return res.status(400).json({ message: 'Username is missing!' });
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Error occurred when logging out!' })
    }
}

export async function deleteUser(req, res) {
    try {
        const { username, password } = req.body
        if (username && password) {
            const resp = await _deleteUser(username, password, req.session.token)
            if (!resp) {
                console.log('Unable to delete account. Please check your password!')
                return res.status(400).json({ message: 'Unable to delete account. Please check your password!' })
            }
            if (resp.err) {
                console.log(`Unable to retrieve user: ${username}`)
                return res.status(400).json({ message: `Unable to retrieve user: ${username}` })
            }
            console.log(`Deleted account with username: ${username} successfully!`)
            return res.status(201).json({ message: `Deleted account with username: ${username} successfully!` })
        } else {
            return res.status(400).json({ message: 'Username and/or Password are missing!' });
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Error occurred when deleting account!' })
    }
}

export async function pwChange(req, res) {
    try {
        const { username, oldPw, newPw } = req.body
        if (username && oldPw && newPw) {
            const resp = await _pwChange(username, oldPw, newPw, req.session.token)
            if (!resp) {
                console.log('Unable to change your password. Please check your old password!')
                return res.status(400).json({ message: 'Unable to change your password. Please check your old password!' })
            }
            if (resp.err) {
                console.log(`Unable to retrieve user: ${username}`)
                return res.status(400).json({ message: `Unable to retrieve user: ${username}` })
            }
            console.log(`Changed password of username: ${username} successfully!`)
            return res.status(201).json({ message: `Changed password of username: ${username} successfully!` })
        } else {
            return res.status(400).json({ message: 'Username and/or Passwords are missing!' });
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Error occurred when changing password!' })
    }
}
