const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const connectionUrl = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';
MongoClient.connect(connectionUrl, { useNewUrlParser: true, useUnifiedTopology: true },
    (err, result) => {
        if (err) return console.log('There is an error');
        const database = result.db(databaseName);
        database.collection('users').find({ age: { $gt: 2 } }).toArray((_, res) => {
            console.log(res)
        })
        database.collection('users').findOne(new mongodb.ObjectID('609a4689ada6e4d00a280aa6'),
            (_, res) => {
                console.log(res)
            }
        )
    })