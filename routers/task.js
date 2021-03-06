const express = require('express');
const router = new express.Router()
const auth = require('../middleware/auth')
const Task = require('../models/task');
const Fuse = require('fuse.js');
const { ReplSet } = require('mongodb');
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

router.get('/count-tasks', auth, async(req, res) => {
    if (req.query.deadlineFrom) {
        const { deadlineFrom, deadlineTo } = req.query
        const { _id } = req.user
        const numberOfCompleted = await Task.countDocuments({ owner: _id, completed: true, createdAt: { $lte: new Date(deadlineTo), $gt: new Date(deadlineFrom) } })
        const numberOfNotCompleted = await Task.countDocuments({ owner: _id, completed: false, createdAt: { $lte: new Date(deadlineTo), $gt: new Date(deadlineFrom) } })

        res.send({
            numberOfCompleted,
            numberOfNotCompleted
        })
    }
})
router.get('/tasks', auth, async(req, res) => {

    console.log(req.query)

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
    }
    if (req.query.boardName) {
        match.boardName = req.query.boardName
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
        res.status(200).send({
            tasks: req.user.tasks,
            username: req.user.name,
            _id: req.user._id
        })
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
        res.status(200).send(`deleted task ${id}`)

    } catch (e) {
        res.status(500).send(e)
    }
});

router.patch('/edit/boardName', auth, async(req, res) => {
    const { newBoardName, oldBoardName } = req.body
    const tasks = await Task.find({ owner: req.user._id, boardName: oldBoardName })
    if (tasks.length !== 0) {
        tasks.forEach(async(task) => {
            task.boardName = newBoardName
            await task.save()
        })
        res.status(200).send()
    } else {
        res.status(400).send()
    }
})

router.delete('/edit/tasks/boardName', auth, async(req, res) => {
    const { boardName } = req.query
    const tasks = await Task.find({ owner: req.user._id, boardName })
    if (tasks.length !== 0) {
        tasks.forEach(async(task) => {
            await task.remove()
        })
        res.status(200).send()
    } else {
        res.status(400).send()
    }
})

router.patch('/edit/tasks/collectionName', auth, async(req, res) => {
    const { oldCollectionName, newCollectionName, newBoardName } = req.body
    const tasks = await Task.find({
        owner: req.user._id,
        collectionName: oldCollectionName,
        boardName: newBoardName
    })
    if (tasks.length !== 0) {
        tasks.forEach(async(task) => {
            task.collectionName = newCollectionName
            await task.save()
        })
        res.status(200).send()
    } else {
        res.status(400).send()
    }
})

router.delete('/edit/tasks/collectionName', auth, async(req, res) => {
    const { collectionName, boardName } = req.query

    const tasks = await Task.find({
        boardName: boardName,
        owner: req.user._id,
        collectionName
    })

    if (tasks.length !== 0) {
        tasks.forEach(async(task) => {
            await task.remove()
        })
        res.status(200).send()
    } else {
        res.status(400).send()
    }
})

router.patch('/edit/tasks/description', auth, async(req, res) => {
    const { oldData, newData, whereTo } = req.body
    const { boardName, collectionName } = whereTo

    const task = await Task.findOne({
        owner: req.user._id,
        boardName,
        collectionName,
        description: oldData.oldDescription
    })

    if (task) {
        task.description = newData.newDescription
        task.completed = newData.newCompleted
        await task.save()
        res.status(200).send()
    } else {
        res.status(400).send()
    }

})

router.get('/search/tasks', auth, async(req, res) => {
    const { boardName } = req.query
    const boardNames = await Task.find({ owner: req.user._id }).distinct('boardName')
    const options = {
        includeScore: true
    }

    const fuse = new Fuse(boardNames, options)

    const result = fuse.search(boardName)

    console.log(result)

    if (result.length !== 0) {
        res.status(200).send(result)
    } else {
        res.status(404).send()
    }
})


module.exports = router