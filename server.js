const fs = require('fs');
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const PORT = process.env.PORT || 8000;
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
const bodyParser = require('body-parser');

const { connectToDb, getCustomers, addCustomer, deleteCustomer } = require('./db.js');


const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackConfig = require('./webpack.config.js');

const app = express();

app.use(morgan('combined', { stream: accessLogStream }));
app.use(bodyParser.json());

// query results

// return all customers
app.get('/api/customers', async (req, res) => {
  try {
    const result = await getCustomers();
    res.set('Content-Type', 'application/json');
    res.end(JSON.stringify(result));
  } catch (err) {
    res.status(500);
    console.log(err);
    res.end(JSON.stringify({ status: "error" }));
  }
});

// check for validity of data prior to insert?
app.post('/api/customers', async (req, res) => {
  if (req.headers['content-type'] != 'application/json') {
    res.status(416);
    res.end(JSON.stringify({status: 'incorrect content-type'}));
  }
  try {
    const result = await addCustomer(req.body);
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

app.delete('/api/customers/', async (req, res) => {
  try {
    const result = await deleteCustomer(req.body._id);
    console.log(result);
    res.status(202);
    res.end(JSON.stringify({nDeleted: result}));
  } catch (err) {
    console.log(err);
    res.end(JSON.stringify({ status: 'error' }));
  }
});

if (process.env.NODE_ENV === 'development') {
  app.use(webpackMiddleware(webpack(webpackConfig), {
    publicPath: '/',
    stats: {
      colors: true,
    },
  }));
} else {
  app.use(express.static('dist'));
}

app.listen(PORT, () => {
  console.log(`Running on port: ${PORT}`);
  connectToDb();
});
