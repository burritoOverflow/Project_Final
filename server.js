const fs = require('fs');
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const PORT = process.env.PORT || 8000;
const MongoClient = require('mongodb').MongoClient;
const mongoURL = "mongodb://localhost:27017/HomeworkFinalProject";
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

const app = express();

app.use(morgan('combined', { stream: accessLogStream }));

const connectDB = async () => {
  try {
    const connection = await MongoClient.connect(mongoURL);
    const db = connection.db('customersDB');
    const collection = await db.createCollection('customers');
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

connectDB();
app.listen(PORT, () => console.log(`Running on port: ${PORT}`));
