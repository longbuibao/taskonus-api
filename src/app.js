const express = require('express')

const userRoute = require('../src/routers/user')
const taskRoute = require('../src/routers/task')

require('./db/mongoose')

const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(userRoute)
app.use(taskRoute)

module.exports = app