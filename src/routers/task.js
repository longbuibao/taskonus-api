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
});

//get task by id
router.get('/tasks/:id', auth, async(req, res) => {
    const id = req.params.id
    try {
        const task = await Task.findOne({ _id: id, owner: req.user._id })
        if (!task) {
            return res.status(404).send('not found task')
        }
        res.send(task)
    } catch (error) {
        res.status(500).send('something wrong')
    }
});

//fetch {{url}}/tasks?completed=true
//fetch {{url}}/limit=10?skip=0  --> fetch 10 and skip 0 page
//fetch {{url}}/sortBy=createdAt:asc (desc)
//fetch {{url}}/tasks?collectionName
router.get('/tasks', auth, async(req, res) => {
    const match = {}
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    if (req.query.collectionName) {
        match.collectionName = req.query.collectionName
        console.log(match)
    }
    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                //asc 1, desc -1
                sort
            }
        }).execPopulate()
        res.status(200).send(req.user.tasks)
    } catch (e) {
        res.status(400).send(e)
    }
});

//update task
router.patch('/tasks/:id', auth, async(req, res) => {
    const id = req.params.id
    const newValue = req.body
    const keys = Object.keys(newValue)
    const check = keys.every((key) => {
        return ["completed", "description", "collectionName"].includes(key)
    })
    if (check) {
        try {
            const task = await Task.findOne({ _id: id, owner: req.user._id })
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
        res.status(400).send("accepted keys: ['completed', 'description']", "collectionName")
    }
});

//delete task
router.delete('/tasks/:id', auth, async(req, res) => {
    const id = req.params.id
    try {
        const task = await Task.findOneAndDelete({ _id: id, owner: req.user._id })

        if (!task) {
            return res.status(404).send('not found task')
        }
        res.send(`deleted task ${id}`)

    } catch (e) {
        res.status(500).send(e)
    }
});

module.exports = router