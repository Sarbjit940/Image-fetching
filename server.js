const express    = require ('express');
const bodyParser = require ('body-parser');
const app        = express ();
const morgan     = require('morgan');
const mongoose   = require('mongoose');

require ('./app/Config/constant');
require ('./app/Config/config');


var apiRoutes = require('./app/Routes/admin');

function setMongoDb() {
    mongoose.connect(DB_URL, {
        useNewUrlParser: true, useUnifiedTopology: true
    })
        .then(() => {
            console.log("mongo db is connected");
        });
}

app.use (bodyParser.json());
app.use(morgan('dev'));
app.use (bodyParser.urlencoded ({extended: true}));
app.use (API_URL_PREFIX, apiRoutes);

app.listen (PORT, console.log (`server is started at port ${PORT}`));
setMongoDb();
