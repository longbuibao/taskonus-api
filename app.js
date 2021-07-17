const express = require('express')
require('./db/mongoose')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const userRoute = require('./routers/user')
const taskRoute = require('./routers/task')
const { notification } = require('./utils/notification')

const app = express()

app.use(cookieParser())

app.use(
    cors({
        credentials: true,
        origin: 'http://localhost:3000'
    })
)

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Credentials', true)
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    )
    next()
})

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.set('view engine', 'ejs')
app.set('views', `${__dirname}/public/views`)

setInterval(notification, 3600 * 1000 * 24) // moi ngay tao 1 notification

app.use(userRoute)
app.use(taskRoute)

module.exports = app