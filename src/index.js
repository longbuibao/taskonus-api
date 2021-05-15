const express = require('express')
const User = require('../src/models/user')
require('./db/mongoose')

const app = express()
const port = process.env.PORT || 3000

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.post('/users', async(req, res) => {
    try {
        const user = new User(req.body)
        await user.save()
        res.send('ok')
    } catch (e) {
        res.status(400).send("check again sir")
    }
})


app.listen(port, () => {
    console.log('server is up at ' + port)
})