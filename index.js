require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const adminRouter = require('./routes/');
const clientRouter = require('./routes/client');
const bodyParser = require('body-parser');
const session = require("express-session");
const path = require("path");
const expressLayouts = require('express-ejs-layouts')
const { bindFlmngr } = require("@flmngr/flmngr-server-node-express");

const app = express();
const PATH_ADMIN_TEMPLATE = "/views/pages/admin/";
const PATH_CLIENT_TEMPLATE = "/views/pages/client/";
const PATH_LAYOUTS_TEMPLATE = "/views/layouts/";

bindFlmngr({
    app: app,
    urlFileManager: "/flmngr",
    urlFiles: "/public/images/",
    dirFiles: "./images"
});

// Form Data
app.use(express.json());
app.use(bodyParser.json()); //utilizes the body-parser package
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    session({
        resave: true,
        saveUninitialized: true,
        secret: 'somesecret',
        cookie: { maxAge: 8*60*60*1000 },
        saveUninitialized: true,
        maxAge: new Date(Date.now() + 3600000),
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
    console.log(req.method, req.params);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});

//Routes
app.use("/admin", adminRouter);
app.use("/", clientRouter);

//connect db
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true })
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log('Connection Mongodb & Listening on port', process.env.PORT);
        });
    })
    .catch((err) => {
        console.log("Connect MongoDb ERROR: " + process.env.MONGODB_URL, err);
    });