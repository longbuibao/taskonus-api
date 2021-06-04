const express = require('express')

const userRoute = require('../src/routers/user')
const taskRoute = require('../src/routers/task')

require('./db/mongoose')

const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.get('/'. (_, res)=>{
  res.send('<p>Please go to this <a href="https://github.com/longbuibao/taskApp">link </a></p> to have more information about this API')
})

app.use(userRoute)
app.use(taskRoute)

module.exports = app
