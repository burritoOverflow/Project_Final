const fs = require('fs');
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const PORT = process.env.PORT || 8000;
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
const bodyParser = require('body-parser');

const customerRoutes = require('./customerApi.js');
const { connectToDb } = require('./db.js');

const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackConfig = require('./webpack.config.js');

const app = express();

app.use(morgan('combined', { stream: accessLogStream }));
app.use('/api', customerRoutes.routes);

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
