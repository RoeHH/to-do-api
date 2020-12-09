const { MongoClient } = require('mongodb')

const client = new MongoClient(process.env.DB_CONNECTION_STRING);


(async () => {
    await client.connect();
})()

export const getTodos = async () => {
    const dbo = client.db();
    return dbo.collection('customers').find().toArray();
}