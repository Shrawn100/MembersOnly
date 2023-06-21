var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config()
const session = require("express-session");
const passport = require("passport");
const localStrategy=require("passport-local").Strategy;
const mongoose=require("mongoose")
const bcrypt=require("bcryptjs")
const asyncHandler=require("express-async-handler")
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const User=require("./models/User")

const mongoDB=process.env.MONGODB_URI

mongoose.connect(mongoDB,{useUnifiedTopology:true,useNewUrlParser:true});
const db=mongoose.connection;
db.on("error",console.error.bind(console,"mongo connection error"));


var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const secret=process.env.SECRET;
app.use(session({secret:secret,resave:false,saveUninitialized:true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({extended:false}));

passport.use(
  new localStrategy(async (username, password, done) => {
    const user = await User.findOne({ username: username });
    if (!user) {
      return done(null, false, { message: "Username doesnt not exist" });
    }
    bcrypt.compare(password, user.password, (err, res) => {
      if (res) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Incorrect password" });
      }
    });
  })
);

passport.serializeUser((user,next)=>{
  next(null,user.id)
});
passport.deserializeUser(asyncHandler(async(id,next)=>{
  const user=await User.findById(id);
  next(null,user)
}))

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
