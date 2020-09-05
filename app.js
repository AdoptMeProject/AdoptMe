require('dotenv').config();

const express = require('express');
const logger = require("morgan");
const path = require("path");
const cookieParser = require('cookie-parser')

require('./config/db.config')
require('./config/hbs.config');

const passport = require('./config/passport.config');
const session = require("./config/session.config");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger("dev"));
app.use(cookieParser())
app.use(session)
app.use(passport)

/**
 * View engine setup
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

/**
 * Configure routes
 */
const router = require('./config/routes.config.js');
app.use('/', router);

const PORT = Number(process.env.PORT || 3000)

app.listen(PORT, () => {
  console.log(`Ready!`);
});
