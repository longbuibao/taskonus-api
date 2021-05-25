const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Task = require('../models/task')

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
        unique: true,
        async validate(val) {
            if (!validator.isEmail(val)) {
                throw new Error('Check your email again')
            }
            // const user = await User.findOne({ email: val });
            // if (user) {
            //     throw new Error('The specified email address is already in use.')
            // }
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
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function() {
    const user = this
    const userObj = user.toObject()
    delete userObj.password
    delete userObj.tokens

    return userObj
}

userSchema.methods.generateAuthToken = async function() {
    const token = jwt.sign({ _id: this._id.toString() }, 'key')
    this.tokens = this.tokens.concat({ token })
    await this.save()
    return token
}

//hash plain text password before saving
userSchema.pre('save', async function(next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10)
    }
    next()
});

//remove all tasks before remove user
userSchema.pre('remove', async function(next) {
    await Task.deleteMany({ owner: this._id })
    next()
});

userSchema.statics.findByCredentials = async(userObject) => {
    const { email, password } = userObject
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('unable to login')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('email or password is incorrect')
    }
    return user
}

const User = mongoose.model('User', userSchema)

module.exports = User