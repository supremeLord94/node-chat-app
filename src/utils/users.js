const users = []

//addUser(), removeUser(), getUser() getUsersInRoom()

const addUser = ({ id, username, room }) => {
    //Clean Data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //validate data
    if (!username || !room) {
        return {
            error: 'username and room are required!'
        }
    }

    //existing user?
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    // Validate username
    if (existingUser) {
        return {
            error: 'username is in use!'
        }
    }

    //store user
    const user = {
        id,
        username,
        room
    }
    users.push(user)
    return { user }
}
const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (_id) => {
    const match = users.find((e) => e.id === _id)

    if (match === undefined) {
        return { error: 'No user found' }
    }

    return match
}

const getUsersInRoom = (room) => {
    const usersInRoom = users.filter((e)=> e.room === room)
    
    if(usersInRoom.length === 0){
        return { error: 'No users found in room '}
    }

    return usersInRoom
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}
