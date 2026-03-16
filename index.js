import express from "express"
import { router } from "./route/router.js"
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import cookieParser from 'cookie-parser';
import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()
const app=express()
app.set("view engine","ejs")
app.set("views","./views")
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(express.static("public"))

let port = process.env.PORT

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
}));

app.use((req, res, next) => {
  res.locals.username = req.cookies.user;
  res.locals.msg = req.cookies.msg;
  res.locals.role = req.cookies.role;
  next();
});

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.secret_key,
  callbackURL: process.env.callback_url
},
function(accessToken, refreshToken, profile, done) {
  // Save or lookup user in DB here
  return done(null, profile);
}
));

passport.serializeUser((user, done) => {
done(null, user);
});

passport.deserializeUser((user, done) => {
done(null, user);
});

app.use((req,res,next)=>{
res.locals.currentRoute = req.path
next()
})

app.use((req, res, next) => {

    res.locals.username = req.cookies.user; // store user info for views
    res.locals.msg = req.cookies.msg;
    next();
  });

  app.use("/",router)

  
app.listen(port,()=>{
  console.log("Server Started...");
  
  mongoose.connect(process.env.MONGO_URL).then(()=>console.log("connected..."))
})
