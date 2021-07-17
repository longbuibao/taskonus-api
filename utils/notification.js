const User = require('../models/user')
const mailer = require('../utils/mailer')
const getUsersTasks = async() => {
    const users = await User.find({})
    const allUsersTasks = await Promise.all(users.map(async(user) => {
        return await user.populate('tasks').execPopulate()
    }))

    const result = allUsersTasks.map(user => {
        return {
            tasks: user.tasks,
            username: user.name,
            userId: user._id,
            email: user.email
        }
    })

    return result
}
const notification = async() => {
    const userTasks = await getUsersTasks()
    console.log(userTasks)
    userTasks.forEach(usrTask => {
        usrTask.tasks.forEach(task => {
            const dateNow = (new Date()).getTime()
            const deadline = (new Date(task.deadline)).getTime()
            if (deadline - dateNow > 0 && deadline - dateNow <= 86400000 && task.completed === false) {
                mailer({
                    from: process.env.NODEMAILER_USERNAME,
                    to: usrTask.email,
                    subject: 'Deadline',
                    text: `còn ${(new Date(deadline - dateNow)).getHours()} tiếng nữa là hết hạn ${task.description}! Nhanh lên nào!`
                }).catch(e => {
                    console.log(e.response)
                })
            } else if (deadline - dateNow < 0 && task.completed === false) {
                console.log('hello?')
                mailer({
                    from: process.env.NODEMAILER_USERNAME,
                    to: usrTask.email,
                    subject: 'Deadline',
                    text: `Bạn đã hết hạn ${task.description}! Cố gắng hơn nhé!`
                }).catch(e => {
                    console.log(e.response)
                })
            }
        })
    })
}



module.exports = {
    notification
}