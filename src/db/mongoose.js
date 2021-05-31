const mongoose = require('mongoose')
const uri = `mongodb://127.0.0.1:27017/task-manager-api-test`

mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .then(res => console.log('Database: OK 👍'))
    .catch(e => console.log(e))