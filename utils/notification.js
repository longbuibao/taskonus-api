const User = require('../models/user')
const getUsersTasks = async() => {
    const users = await User.find({})
    const allUsersTasks = await Promise.all(users.map(async(user) => {
        return await user.populate('tasks').execPopulate()
    }))

    const result = allUsersTasks.map(user => {
        return {
            tasks: user.tasks,
            username: user.name,
            userId: user._id
        }
    })

    return result
}
const notification = async() => {
    const userTasks = await getUsersTasks()
    console.log(userTasks)
}

module.exports = {
    notification
}