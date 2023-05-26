require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const adminRouter = require('./routes/');
const clientRouter = require('./routes/client');
const bodyParser = require('body-parser');
const session = require("express-session");
const path = require("path");
const expressLayouts = require('express-ejs-layouts')

const app = express();
const PATH_ADMIN_TEMPLATE = "\\views\\pages\\admin\\";
const PATH_CLIENT_TEMPLATE = "\\views\\pages\\client\\";
const PATH_LAYOUTS_TEMPLATE = "\\views\\layouts\\";

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
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', [__dirname + PATH_LAYOUTS_TEMPLATE, __dirname + PATH_ADMIN_TEMPLATE, __dirname + PATH_CLIENT_TEMPLATE]);

//cors
//app.use(cors({ origin: true, credentials: true }));
app.use((req, res, next) => {
    console.log(req.params, req.method);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});

//Routes
app.use("/admin", adminRouter);
app.use("/", clientRouter);

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