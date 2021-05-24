const { ObjectID } = require('bson');
const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const Task = require('../models/task');

//create a task
router.post('/tasks', auth, async(req, res) => {
        const task = new Task({
            ...req.body,
            owner: req.user._id
        })
        try {
            await task.save()
            res.status(201).send(task)
        } catch (e) {
            res.status(400).send(e)
        }
    })
    //fetch all tasks
router.get('/tasks', auth, async(req, res) => {
    const _id = req.user._id
    try {
        const tasks = await Task.find({ owner: new ObjectID(_id) })
        res.status(200).send(tasks)
    } catch (e) {
        res.status(400).send(e)
    }
});
//update task
router.patch('/tasks/update/:id', auth, async(req, res) => {
    const taskId = req.params.id
    const newValue = req.body
    const keys = Object.keys(newValue)
    const check = keys.every((key) => {
        return ["completed", "description"].includes(key)
    })
    if (check) {
        try {
            const tasks = await Task.find()
            if (!task) {
                return res.status(404).send('not found task')
            }
            keys.forEach(key => {
                task[key] = newValue[key]
            })
            const updatedTask = await task.save()
            res.status(200).send(updatedTask)

        } catch (e) {
            res.status(500).send(e)
        }
    } else {
        res.status(400).send("accepted keys: ['completed', 'description']")
    }
});

//delete task
router.delete('/tasks/delete/:id', auth, async(req, res) => {
    const id = req.params.id
    try {
        const task = await Task.findByIdAndDelete(id)
        if (!task) {
            return res.status(404).send('not found task')
        }
        res.send(`deleted task ${task}`)

    } catch (e) {
        res.status(500).send(e)
    }
});

module.exports = router