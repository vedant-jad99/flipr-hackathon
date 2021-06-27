const express = require('express');
const mongoose = require('mongoose');
const schedule = require('node-schedule');
const passportSetup = require('./config/passport-setup');
const passport = require('passport');
const ejsLint = require('ejs-lint');
const authRoutes = require('./routes/authRoutes');
const {requireAuth,checkUser} = require('./middleware/authMiddleware')
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const cookieSession = require('cookie-session');
const mailController = require('./controllers/mailController');
const jwt = require('jsonwebtoken');
const Mail = require('./models/mail');

// middleware
dotenv.config();
const app = express();
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
app.get('/', async (req, res,next) => {
  const token = req.cookies['jwt'];
  const user =req.user;
    if(token){
        jwt.verify(token,process.env.JWT_SECRET,async (err,decodedToken) => {
            if(err){
                res.locals.mails = null;
            } else {
              let user = await User.findById(decodedToken['id']);
              let mails = await Mail.find({
                from:user.email,
              });
              console.log(mails);
              res.locals.mails = mails;
            }
        });
    }else if(user){
      console.log(user.email);
      let mails = await Mail.find({
        from:user.email,
      });
      console.log(mails);   
      res.locals.mails = mails;
    }else{
        res.locals.mails = null;
    }
  res.render('home');
  next();
});
app.get('/mailpage', requireAuth,(req, res,next) => {
  res.render('mailpage');
  next();
});
app.get('/maillist', requireAuth,async (req, res ,next) => {
    const token = req.cookies['jwt'];
    const user =req.user;
    if(token){
        jwt.verify(token,process.env.JWT_SECRET,async (err,decodedToken) => {
            if(err){
                res.locals.mails = null;
            } else {
              let user = await User.findById(decodedToken['id']);
              let mails = await Mail.find({
                from:user.email,
              });
              console.log(mails);
              res.locals.mails = mails;
            }
        });
    }else if(user){
      console.log(user.email);
      let mails = await Mail.find({
        from:user.email,
      });
      console.log(mails);
      res.locals.mails = mails;
    }else{
        res.locals.mails = null;
    }
  res.render('maillist');
  next();
});

app.post('/mail-save',mailController.mail_save,(req,res,next) =>{
  next();
});


// At a particular time
const somedate = new Date('Jun 27 2021 10:18:00');
var i=0;
schedule.scheduleJob(i.toString(),'*/1 * * * * *',()=>{
  console.log("Job@",new Date().toString());
  schedule.cancelJob(i.toString());
  console.log("Job@",new Date().toString());
  i++;
});












// function getTimeRemaining(endtime) {
//   var t = endtime - new Date().getTime();
//   var seconds = Math.floor((t / 1000) % 60);
//   var minutes = Math.floor((t / 1000 / 60) % 60);
//   var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
//   var days = Math.floor(t / (1000 * 60 * 60 * 24));
//   return {
//       'total': t,
//       'days': days,
//       'hours': hours,
//       'minutes': minutes,
//       'seconds': seconds
//   };
// }

  
// app.use(async function(req,res,next){
//   let mails =  await Mail.find();
//   for(var i=0; i<mails.length; i++){
//     date=mails[i]["sdate"];
//     console.log(mails[i]["sdate"]);
//     // var getTest = "<%= date %>"
//     // var deadline = new Date(getTest).getTime()
//     // initializeClock('clockdiv', deadline);    
//   }
      
//   next();
// });


function stopClock() {
  // window.location = "/eventStarted/" + <%= event[0] %>;
}

function initializeClock(id, endtime) {
  var clock = document.getElementById(id);
  var daysSpan = clock.querySelector('.days');
  var hoursSpan = clock.querySelector('.hours');
  var minutesSpan = clock.querySelector('.minutes');
  var secondsSpan = clock.querySelector('.seconds');

  function updateClock() {
      var t = getTimeRemaining(endtime);

      daysSpan.innerHTML = t.days;
      hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
      minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
      secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

      if (t.total <= 0) {
          clearInterval(timeinterval);
      }
      if (parseInt(t.days) <= 0 && parseInt(t.hours) <= 0 && parseInt(t.minutes) <= 0 && parseInt(t.seconds) <= 0) {
          daysSpan.innerHTML = 0;
          hoursSpan.innerHTML = 0;
          minutesSpan.innerHTML = 0;
          secondsSpan.innerHTML = 0;
          stopClock()
      }
  }

  updateClock();
  var timeinterval = setInterval(updateClock, 1000);
}






   