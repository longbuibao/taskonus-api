const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
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

userSchema.pre('save', async function(next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10)
    }
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User