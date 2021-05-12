const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const connectionUrl = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';
MongoClient.connect(connectionUrl, { useNewUrlParser: true, useUnifiedTopology: true },
    (err, result) => {
        if (err) return console.log('There is an error');
        const database = result.db(databaseName);
        database.collection('users').updateMany({ age: { $exists: true } }, { $set: { age: 1234 } })
            .then(res => {
                console.log(res.modifiedCount)
            })
            .catch(err => {
                console.log(err)
            })
    })