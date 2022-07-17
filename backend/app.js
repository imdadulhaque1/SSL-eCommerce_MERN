require('express-async-errors');
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');

const userRoute = require('./api/routers/userRoute');
const categoryRoute = require('./api/routers/categoryRoute');
const error = require('./middlewares/error');

app.use(express.json());
app.use(cors());

if(process.env.NODE_ENV === "development"){
    app.use(morgan('dev'));
}

app.use('/api/user', userRoute);
app.use('/api/category', categoryRoute);

app.use(error);

module.exports = app;