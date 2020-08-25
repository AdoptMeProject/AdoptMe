// require('dotenv').config();

// const bodyParser   = require('body-parser');
// const cookieParser = require('cookie-parser');
// const express      = require('express');
// const favicon      = require('serve-favicon');
// const hbs          = require('hbs');
// const logger       = require('morgan');
// const path         = require('path');

// const session    = require("express-session");
// const flash      = require("connect-flash");

// require('./config/db.config');
    

// // const app_name = require('./package.json').name;
// // const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

// const app = express();

// // Middleware Setup
// app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());

// // Express View engine setup

// app.use(require('node-sass-middleware')({
//   src:  path.join(__dirname, 'public'),
//   dest: path.join(__dirname, 'public'),
//   sourceMap: true
// }));
      

// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'hbs');
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));


// hbs.registerHelper('ifUndefined', (value, options) => {
//   if (arguments.length < 2)
//       throw new Error("Handlebars Helper ifUndefined needs 1 parameter");
//   if (typeof value !== undefined ) {
//       return options.inverse(this);
//   } else {
//       return options.fn(this);
//   }
// });
  

// // default value for title local
// app.locals.title = 'Express - Generated with IronGenerator';


// // Enable authentication using session + passport
// app.use(session({
//   secret: 'irongenerator',
//   resave: true,
//   saveUninitialized: true,
//   store: new MongoStore( { mongooseConnection: mongoose.connection })
// }))
// app.use(flash());
// require('./passport')(app);
    

// const index = require('./routes/index');
// app.use('/', index);

// const authRoutes = require('./routes/auth');
// app.use('/auth', authRoutes);
      

// module.exports = app;

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
const router = require('./config/routes.js');
app.use('/', router);

const PORT = Number(process.env.PORT || 3000)

app.listen(PORT, () => {
  console.log(`Ready!`);
});