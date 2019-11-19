const { MongoClient, ObjectID } = require('mongodb');

let db;

async function connectToDb() {
  const url = process.env.DB_URL || "mongodb://localhost:27017/HomeworkFinalProject";
  const client = new MongoClient(url, { useNewUrlParser: true });
  await client.connect();
  console.log('Connected to MongoDB at', url);
  db = client.db('customersDB');
}

async function getCustomers() {
  const result = await db.collection('customers').find().toArray();
  return result;
}

async function addCustomer(customer) {
  const result = await db.collection('customers').insertOne(customer);
  return result;
}

async function deleteCustomer(customerID) {
  const result = await db.collection('customers').deleteOne({ _id: ObjectID(customerID)});
  return result.deletedCount;
}

function getDb() {
  return db;
}

module.exports = { connectToDb, getCustomers, addCustomer, deleteCustomer, getDb };
