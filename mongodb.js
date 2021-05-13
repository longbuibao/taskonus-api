const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const connectionUrl = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';
MongoClient.connect(connectionUrl, { useNewUrlParser: true, useUnifiedTopology: true },
    (err, result) => {
        if (err) return console.log('There is an error');
        const database = result.db(databaseName);
        database.collection('users').deleteOne({ _id: new mongodb.ObjectID('609a3dce38b1f4bad06b6bf2') })
            .then(res => {
                console.log(res.deletedCount)
            })
            .catch(err => {
                console.log(err)
            })
    })