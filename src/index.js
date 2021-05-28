const express = require('express')
    // require('dotenv').config()



const userRoute = require('../src/routers/user')
const taskRoute = require('../src/routers/task')

require('./db/mongoose')

const app = express()
const port = process.env.PORT || 3000

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(userRoute)
app.use(taskRoute)


app.listen(port, () => {
    console.log('server is up at ' + port)
})