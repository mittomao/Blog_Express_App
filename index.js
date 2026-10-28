require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const { bindFlmngr } = require('@flmngr/flmngr-server-node-express');

const adminRouter = require('./routes/');
const clientRouter = require('./routes/client');
const apiRouter = require('./routes/api');

const app = express();

const PORT = process.env.PORT || 9000;
const PATH_CLIENT_PAGES = path.join(__dirname, 'views/client/pages');
const PATH_ADMIN_PAGES = path.join(__dirname, 'views/admin/pages');
const PATH_CLIENT_LAYOUTS = path.join(__dirname, 'views/client/layouts');
const PATH_ADMIN_LAYOUTS = path.join(__dirname, 'views/admin/layouts');
const PATH_SHARED = path.join(__dirname, 'views/shared');

// File Manager Binding
bindFlmngr({
    app: app,
    urlFileManager: '/flmngr',
    urlFiles: '/images/',
    dirFiles: path.join(__dirname, 'public/images')
});

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session Middleware
app.use(
    session({
        resave: false,
        saveUninitialized: true,
        secret: process.env.SESSION_SECRET || 'somesecret',
        cookie: {
            maxAge: 8 * 60 * 60 * 1000 // 8 hours
        }
    })
);

// Static Files
app.use(express.static(path.join(__dirname, 'public')));

// View Engine Setup
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', [
    PATH_CLIENT_PAGES,
    PATH_ADMIN_PAGES,
    PATH_CLIENT_LAYOUTS,
    PATH_ADMIN_LAYOUTS,
    PATH_SHARED
]);

// CORS & Preflight Middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Routes
app.use('/admin', adminRouter);
app.use('/api', apiRouter);
app.use('/', clientRouter);

// Global Error Handler Middleware
app.use((err, req, res, next) => {
    console.error('Unhandled Application Error:', err);
    if (res.headersSent) {
        return next(err);
    }
    if (req.originalUrl.startsWith('/api') || req.xhr || (req.headers.accept && req.headers.accept.includes('application/json'))) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
    return res.status(500).render('page-404.ejs', {
        title: 'Server Error',
        isAdmin: false,
        layout: 'default-layout'
    });
});

// Database Connection & Server Initialization
const mongoUri = process.env.MONGODB_URL;
if (!mongoUri) {
    console.error('Fatal Error: MONGODB_URL is not defined in environment variables.');
    process.exit(1);
}

mongoose
    .connect(mongoUri, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    .then(() => {
        const server = app.listen(PORT, () => {
            console.log(`Connected to MongoDB & Listening on port ${PORT}`);
        });

        // Graceful Shutdown Handlers
        const handleShutdown = (signal) => {
            console.log(`Received ${signal}. Shutting down gracefully...`);
            server.close(() => {
                mongoose.connection.close(false, () => {
                    console.log('MongoDB connection closed. Server stopped.');
                    process.exit(0);
                });
            });
        };

        process.on('SIGINT', () => handleShutdown('SIGINT'));
        process.on('SIGTERM', () => handleShutdown('SIGTERM'));
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err.message);
        process.exit(1);
    });
