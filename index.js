const express = require('express');
const mongoose = require('mongoose');
const passportSetup = require('./config/passport-setup');
const passport = require('passport');
const ejsLint = require('ejs-lint');
const authRoutes = require('./routes/authRoutes');
const {requireAuth,checkUser} = require('./middleware/authMiddleware')
const cookieParser = require('cookie-parser');
const app = express();
const dotenv = require('dotenv');
const cookieSession = require('cookie-session');
dotenv.config();
// middleware
app.use(express.static(__dirname+'/public'));
app.use(express.json());
app.use(cookieSession({
  maxAge: 3600 * 24 * 60 *60,
  keys:[process.env.COOKIE_SECRET]
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = process.env.DB_URL;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(process.env.PORT || 3000))
  .catch((err) => console.log(err));

// routes
app.get('*',checkUser);
app.use(authRoutes);
app.get('/', (req, res) => res.render('home'));
app.get('/Contacts', requireAuth,(req, res) => res.render('contact'));