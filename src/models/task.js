const mongoose = require('mongoose')

const Task = mongoose.model('Task', {
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
    }
})

module.exports = Task