require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const blogRouter = require('./routes/');
const bodyParser = require('body-parser');
const session = require("express-session");

const app = express();

// Form Data
app.use(express.json());
app.use(bodyParser.json()); //utilizes the body-parser package
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    session({
        resave: true,
        saveUninitialized: true,
        secret: 'somesecret',
        cookie: { maxAge: 360000 }
    }
    ));

// Static File
app.use(express.static(__dirname + '/public'));

// set the view engine to ejs
app.set('view engine', 'ejs');

//cors
//app.use(cors({ origin: true, credentials: true }));
app.use((req, res, next) => {
    console.log(req.params, req.method);
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Methods", "*");
    // res.header("Access-Control-Allow-Headers", "*");
    next();
});

//Routes
app.use(blogRouter);

//connect db
mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log('Connection Mongodb & Listening on port', process.env.PORT);
        });
    })
    .catch((err) => {
        console.log(err);
    });