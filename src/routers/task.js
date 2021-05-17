const express = require('express')
const router = new express.Router()
const Task = require('../models/task')
    //create a task
router.post('/tasks', async(req, res) => {
        try {
            const task = new Task(req.body)
            await task.save()
            res.status(201).send('saved task')
        } catch (e) {
            res.status(400).send("check again sir")
        }
    })
    //fetch all tasks
router.get('/tasks', async(req, res) => {
    try {
        const tasks = await Task.find({})
        res.status(200).send(tasks)
    } catch (e) {
        res.status(400).send("something went wrong")
    }
});
//get a task by its id
router.get('/tasks/:id', async(req, res) => {
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
});
//update task
router.patch('/tasks/:id', async(req, res) => {
    const _id = req.params.id
    const newValue = req.body
    const keys = Object.keys(newValue)
    const check = keys.every((key) => {
        return ["completed", "description"].includes(key)
    })
    if (check) {
        try {
            const task = await Task.findByIdAndUpdate(_id, newValue, { new: true, runValidators: true })
            if (!task) {
                return res.status(404).send('not found task')
            }
            const updatedTask = await Task.findById(_id)
            res.status(200).send(updatedTask)

        } catch (e) {
            res.status(500).send('something wrong')
        }
    } else {
        res.status(400).send("accepted keys: ['completed', 'description']")
    }
});

//delete task
router.delete('/tasks/:id', async(req, res) => {
    const id = req.params.id
    try {
        const task = await Task.findByIdAndDelete(id)
        if (!task) {
            return res.status(404).send('not found task')
        }
        res.send(`deleted task ${task}`)

    } catch (e) {
        res.status(500).send('something wrong')
    }
});

module.exports = router