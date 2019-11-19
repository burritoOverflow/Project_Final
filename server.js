const fs = require('fs');
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const PORT = process.env.PORT || 8000;
const MongoClient = require('mongodb').MongoClient;
const mongoURL = "mongodb://localhost:27017/HomeworkFinalProject";
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
const bodyParser = require('body-parser');

const app = express();

app.use(morgan('combined', { stream: accessLogStream }));
app.use(bodyParser.json());

// query results
let collection;

const connectDB = async () => {
  try {
    const connection = await MongoClient.connect(mongoURL);
    const db = connection.db('customersDB');
    collection = await db.createCollection('customers');
    console.log('Connected');
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

connectDB();

// return all customers
app.get('/api/customers', async (req, res) => {
  try {
    const result = await collection.find().toArray();
    res.end(JSON.stringify(result));
  } catch (err) {
    res.status(500);
    console.log(err);
    res.end(JSON.stringify({ status: "error" }));
  }
});

app.post('/api/customers', async (req, res) => {
  if (req.headers['content-type'] != 'application/json') {
    res.status(416);
    res.end(JSON.stringify({status: 'incorrect content-type'}));
  }
  try {
    const result = await collection.insertOne(req.body);
    res.status(201);
    const response = {
      resultID: `${result.insertedId}`
    };
    res.end(JSON.stringify(response));
  } catch (err) {
    res.status(500);
    console.log(err);
    res.end(JSON.stringify({ status: 'error' }));
  }
});

app.listen(PORT, () => console.log(`Running on port: ${PORT}`));
