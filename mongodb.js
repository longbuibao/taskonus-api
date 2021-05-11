const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const connectionUrl = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

MongoClient.connect(connectionUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (err, result) => {
    if (err) return console.log('There is an error');
    //database to connect
    const db = result.db(databaseName);
    //collection to use
    db.collection('users').insertMany([{
        task: 'clean your house',
        isDone: true
    }], (err, res) => {
        console.log(res.ops)
    })
})