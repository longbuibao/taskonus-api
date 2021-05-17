const express = require('express')
const User = require('../src/models/user')
const Task = require('../src/models/task')
require('./db/mongoose')

const app = express()
const port = process.env.PORT || 3000

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//create a user
app.post('/users', async(req, res) => {
        try {
            const user = new User(req.body)
            await user.save()
            res.status(201).send('saved user')
        } catch (e) {
            res.status(400).send("check again sir")
        }
    })
    //fetch all users
app.get('/users', async(req, res) => {
        try {
            const users = await User.find({})
            res.status(200).send(users)
        } catch (e) {
            res.status(400).send("something went wrong")
        }
    })
    //fetch user by its id
app.get('/users/:id', async(req, res) => {
    const _id = req.params.id
    try {
        const user = await User.findById(_id)
        if (!user) {
            return res.status(404).send('not found user')
        }
        res.status(200).send(user)

    } catch (e) {
        res.status(500).send('something wrong')
    }
})

//update user
app.patch('/users/:id', async(req, res) => {
    const _id = req.params.id
    const newValue = req.body
    const keys = Object.keys(newValue)
    const check = keys.every((key) => {
        return ["name", "email", "password"].includes(key)
    })
    if (check) {
        try {
            const user = await User.findByIdAndUpdate(_id, newValue, { new: true, runValidators: true })
            if (!user) {
                return res.status(404).send('not found user')
            }
            const updatedUser = await User.findById(_id)
            res.status(200).send(updatedUser)

        } catch (e) {
            res.status(500).send('something wrong')
        }
    } else {
        res.status(400).send("accept values: ['name', 'email', 'password']")
    }
})

//create a task
app.post('/tasks', async(req, res) => {
        try {
            const task = new Task(req.body)
            await task.save()
            res.status(201).send('saved task')
        } catch (e) {
            res.status(400).send("check again sir")
        }
    })
    //fetch all tasks
app.get('/tasks', async(req, res) => {
        try {
            const tasks = await Task.find({})
            res.status(200).send(tasks)
        } catch (e) {
            res.status(400).send("something went wrong")
        }
    })
    //get a task by its id
app.get('/tasks/:id', async(req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findById(_id)
        if (!task) {
            return res.status(404).send('not found task')
        }
        res.status(200).send(task)

    } catch (e) {
        res.status(500).send('something wrong')
    }
})

app.listen(port, () => {
    console.log('server is up at ' + port)
})