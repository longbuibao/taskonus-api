const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
    //create a user
router.post('/users', async(req, res) => {
    try {
        const user = new User(req.body)
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(user.password, saltRounds)
        user.password = hashedPassword
        await user.save()
        res.status(201).send('saved user')
    } catch (e) {
        res.status(400).send("check again sir")
    }
});
//fetch all users
router.get('/users', async(req, res) => {
    try {
        const users = await User.find({})
        res.status(200).send(users)
    } catch (e) {
        res.status(400).send("something went wrong")
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
        res.status(500).send('something wrong')
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
        if (keys.includes('password')) {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(newValue.password, saltRounds)
            newValue.password = hashedPassword
        }
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
        res.status(500).send('something wrong')
    }

});

module.exports = router