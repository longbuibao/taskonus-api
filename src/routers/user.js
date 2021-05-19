const express = require('express')
const router = new express.Router()
const User = require('../models/user');
//create a user
router.post('/users', async(req, res) => {
    try {
        const user = new User(req.body)
        await user.save()
        res.status(201).send('created user')
    } catch (e) {
        res.status(400).send(e)
    }
});

router.post('/users/login', async(req, res) => {
    try {
        const user = await User.findByCredentials(req.body)
        res.send(user)
    } catch (e) {
        res.status(400).send(e.message)
    }
});
//fetch all users
router.get('/users', async(req, res) => {
    try {
        const users = await User.find({})
        res.status(200).send(users)
    } catch (e) {
        res.status(400).send(e)
    }
});
//fetch user by its id
router.get('/users/:id', async(req, res) => {
    const _id = req.params.id
    try {
        const user = await User.findById(_id)
        if (!user) {
            return res.status(404).send('not found user')
        }
        res.status(200).send(user)

    } catch (e) {
        res.status(500).send(e)
    }
});

//update user
router.patch('/users/:id', async(req, res) => {
    const _id = req.params.id
    const newValue = req.body
    const keys = Object.keys(newValue)
    const check = keys.every((key) => {
        return ["name", "email", "password"].includes(key)
    })
    if (check) {
        try {
            const user = await User.findById(_id)
            if (!user) {
                return res.status(404).send('not found user')
            }
            keys.forEach(key => {
                user[key] = newValue[key]
            })
            const updatedUser = await user.save()
            res.status(200).send(updatedUser)
        } catch (e) {
            res.status(500).send(e)
        }
    } else {
        res.status(400).send("accepted keys: ['name', 'email', 'password']")
    }
});
//delete user
router.delete('/users/:id', async(req, res) => {
    const id = req.params.id
    try {
        const user = await User.findByIdAndDelete(id)
        if (!user) {
            return res.status(404).send('not found user')
        }
        res.send(`deleted user ${user}`)

    } catch (e) {
        res.status(500).send(e)
    }

});

module.exports = router