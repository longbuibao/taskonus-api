const mongoose = require('mongoose')

const Task = mongoose.model('Task', {
    description: {
        type: String,
        require: true,
        default: null,
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
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    }
})

module.exports = Task