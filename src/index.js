const express = require('express')

const userRoute = require('../src/routers/user')
const taskRoute = require('../src/routers/task')

require('./db/mongoose')

const app = express()
const port = process.env.PORT || 3000

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(userRoute)
app.use(taskRoute)

app.listen(port, () => {
    console.log('server is up at ' + port)
})

const Task = require('./models/task')
const User = require('./models/user')
const main = async() => {
    // const task = await Task.findById('60ab6d044edf199ea9630cbd')
    // await task.populate('owner').execPopulate()
    // console.log(task)
    const user = await User.findById('60ab6afe745b076f4346ca34')
    await user.populate('tasks').execPopulate()
    console.log(user.tasks)
}
main()