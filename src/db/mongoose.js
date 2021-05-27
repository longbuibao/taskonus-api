const mongoose = require('mongoose')

mongoose.connect(`mongodb://${process.env.DB_HOST}/task-manager-api`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .then(res => console.log('connected to the database'))
    .catch(e => console.log(e))