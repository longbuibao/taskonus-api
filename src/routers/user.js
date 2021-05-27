const express = require('express')
const multer = require('multer')

const router = new express.Router()

const auth = require('../middleware/auth')
const User = require('../models/user');
//create a user
router.post('/users', async(req, res) => {
    try {
        const user = new User(req.body)
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send(token)
    } catch (e) {
        res.status(400).send(e)
    }
});
//login route
router.post('/users/login', async(req, res) => {
    try {
        const user = await User.findByCredentials(req.body)
        const token = await user.generateAuthToken()
        res.status(200).send({ user, token })
    } catch (e) {
        res.status(400).send(e.message)
    }
});
//logout user
router.post('/users/logout', auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e.message)
    }
});
//logout all sessions
router.post('/users/logoutall', auth, async(req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e.message)
    }
});
//fetch all users
router.get('/users/me', auth, async(req, res) => {
    res.status(200).send(req.user)
});
//update user
router.patch('/users/me', auth, async(req, res) => {
    const newValue = req.body
    const keys = Object.keys(newValue)
    const check = keys.every((key) => {
        return ["name", "email", "password"].includes(key)
    })
    if (check) {
        try {
            keys.forEach(key => {
                req.user[key] = newValue[key]
            })
            const updatedUser = await req.user.save()
            res.status(200).send(updatedUser)
        } catch (e) {
            res.status(500).send(e)
        }
    } else {
        res.status(400).send("accepted keys: ['name', 'email', 'password']")
    }
});
//delete user
router.delete('/users/me', auth, async(req, res) => {
    try {
        await req.user.remove()
        res.send(`deleted user ${req.user.email}`)
    } catch (e) {
        res.status(500).send(e)
    }

});
//upload user profile picture
const upload = multer({
    limits: {
        fileSize: 5000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname) {
            return cb(new Error('Please select an image'))
        }
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/))
            return cb(new Error('File must be an image'))
        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async(req, res) => {
    req.user.avatar = req.file.buffer
    try {
        await req.user.save()
        res.send({ status: 'Uploaded user image' })
    } catch (error) {
        res.status(400).send({ message: error.message })
    }

}, (err, req, res, next) => {
    res.status(400).send({ message: err.message })
})

//delete user profile
router.delete('/users/me/avatar', auth, async(req, res) => {
    try {
        req.user.avatar = undefined
        await req.user.save()
        res.send({ status: 'Deleted user Profile' })
    } catch (error) {
        res.status(500).send(error.message)
    }
})

module.exports = router