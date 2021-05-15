const mongoose = require('mongoose')
const User = require('../models/user')

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(res => console.log("ok"))
    .catch(e => console.log(e))

const Task = mongoose.model('Task', {
    description: {
        type: String,
        require: true
    },
    completed: {
        type: Boolean
    }
})