import { createUser, usernameInDb } from './repository.js';

//need to separate orm functions from repository to decouple business logic from persistence
export async function ormCreateUser(username, password) {
    try {
        if (await usernameInDb(username)) {
            console.log('Username already exist! Please use a different username.')
            return false
        } else {
            const newUser = await createUser({username, password});
            newUser.save();
            return true;
        }
    } catch (err) {
        console.log('ERROR: Could not create new user');
        return { err };
    }
}

