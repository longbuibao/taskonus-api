const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        require: true,
        validate(val) {
            if (!val) {
                throw new Error('Check again your input')
            }
        }
    },
    completed: {
        type: Boolean,
        default: false
    },
    collectionName: {
        type: String
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task