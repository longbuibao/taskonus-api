const mongoose = require('mongoose')
const validator = require('validator')

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

const User = mongoose.model('User', {
    name: {
        type: String,
        trim: true,
        require: true,
        validate(val) {
            if (!isNaN(val.charAt(0))) {
                throw new Error('Please do not use user name start with a number!')
            }
        }
    },
    email: {
        type: String,
        trim: true,
        default: null,
        validate(val) {
            if (!validator.isEmail(val)) {
                throw new Error('Check your email again')
            }
        }
    },
    password: {
        type: String,
        require: true,
        validate(val) {
            if (validator.contains(val, 'password')) {
                throw new Error('Dont put `password` in your password')
            }
            if (val.length < 6) {
                throw new Error('password must be 6 characters or more')
            }
        }
    }
})

const longUser = new User({
    name: 'long        bui    ',
    email: 'blong1102@gmail.com',
    password: '123456password'
})
longUser.save()
    .then(() => console.log('saved!'))
    .catch(e => console.log(e))





// const myTask = new Task({
//     description: 'Learn Nodejs',
//     completed: false
// })

// myTask.save().then(() => {
//     console.log('ok')
// }).catch((err) => {
//     console.log(err)
// })