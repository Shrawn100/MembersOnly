var express = require('express');
var router = express.Router();
const {body, validationResult}=require("express-validator")
const User=require("../models/User")
const Post=require("../models/Posts")
const passport = require("passport");
const flash=require("connect-flash");
const bcrypt = require("bcryptjs")
const asyncHandler=require("express-async-handler");
const { DateTime } = require('luxon'); 
/* GET home page. */
router.get('/', asyncHandler(async(req, res, next)=> {

  let allMessages= await Post.find().populate("user").sort({date:-1}).exec();
 
  // Iterate over allMessages and format the date
  allMessages = allMessages.map(message => {
    const formattedDate = new Date(message.date).toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true
    });
    return { ...message, date: formattedDate };
  });
  

  
  res.render('index', { user:req.user ,title:'Express',allMessages, });
}));



router.get('/sign-up',(req,res,next)=>{
  const length = (value) => {
    return value.length > 0 ? 're-input' : '';
  };
  res.render('signup',{length})
})
router.post('/sign-up', [
  body("username", "Username must be greater than 3 characters").trim().isLength({ min: 3 }).escape(),
  body("password", "Password must be greater than 3 characters").trim().isLength({ min: 3 }).escape(),
  // Process request after validation and sanitisation
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const length = (value) => {
      return value.length > 0 ? 're-input' : '';
    };
    const newUser = new User({
      username: req.body.username,
      password: hashedPassword,
    });
    if(req.body.confirm!==req.body.password){
      res.render("signup", {length, unmatch:true, user: newUser, errors: ["Passwords dont match!"] });
      return;
    }

    if (!errors.isEmpty()) {
      res.render("signup", { user: newUser, errors: errors.array() });
    } else {
      const userExists = await User.findOne({ username: req.body.username });
      if (userExists) {
        res.render("signup", { user: newUser, errors: ["Username already taken!"] });
      } else {
        await newUser.save();
        res.redirect("/log-in");
      }
    }
  })
]);

router.get('/log-in',(req,res,next)=>{
  res.render('login')
})


router.post(
  '/log-in',
  [
    body('username', "Username must be greater than 3 characters").trim().isLength({ min: 3 }).escape(),
    body('password', "Password must be greater than 3 characters").trim().isLength({ min: 3 }).escape(),
  ],
  (req, res, next) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      
      const { username, password } = req.body;
      return res.render('login', {
        errors: errors.array(),
        username: username,
        password: password,
      });
    } else {
      passport.authenticate('local', (err, user, info) => {
        if (err) {
          // Handle error
          return next(err);
        }
        if (!user) {
          // Authentication failed
          const { username, password } = req.body;
          return res.render('login', {
            incorrect:true,
            errors: [{ msg: info.message }],
            username: username,
            password: password,
          });
        }
        // Authentication succeeded
        req.login(user, (err) => {
          if (err) {
            // Handle error
            return next(err);
          }
          // Redirect to the desired location upon successful login
          return res.redirect('/');
        });
      })(req, res, next);
    }
  }
);
router.get("/log-out", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

router.get("/post",(req,res,next)=>{
  
  res.render("post")
})
router.post("/post",[
  body("title","Invalid Title").trim().isLength({min:1}).escape(),
  body("message","Invalid Message").trim().isLength({min:1}).escape(),

  asyncHandler(async(req,res,next)=>{

    const errors=validationResult(req);
    
    const currentDateTime = DateTime.now().toISO();
    const post= new Post({
      user:res.locals.currentUser._id,
      title:req.body.title,
      message:req.body.message,
      date:currentDateTime,
    })
    if(!errors.isEmpty()){
      res.render("post",{
        post:post,errors:errors.array(),
      })
      return;
    }else{
      await post.save();
      res.redirect("/")
    }
  })
]);

module.exports = router;
