const express = require('express')
const multer = require('multer')

const userRoute = require('../src/routers/user')
const taskRoute = require('../src/routers/task')

require('./db/mongoose')

const app = express()
const port = process.env.PORT || 3000

const upload = multer({
    dest: 'images'
})

app.post('/upload', upload.single('fileName'), (req, res) => {
    res.send()
})







app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(userRoute)
app.use(taskRoute)

app.listen(port, () => {
    console.log('server is up at ' + port)
})