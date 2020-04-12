const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const Auth0Sstrategy = require("passport-auth0")
const data = require("./authconfig")

const strategy = new Auth0Sstrategy(
    {
        domain: data.domain,
        clientID: data.clientID,
        clientSecret: data.clientSecret,
        callbackURL: data.callbackURL,
    },
    function (accessToken, refreshToken, extraParam, profile, done) {
        return done(null, profile);
    } 
)

passport.use(strategy);

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
    session({
            secret: 'the_key',
            resave: true,
            saveUninitialized: true,
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
    res.locals.loggedIn = false;
    if (req.session.passport && typeof req.session.passport.user !== 'undefined'){
        res.locals.loggedIn = true;
    }
    next();
});

app.get('/', function(req, res, next){
    res.send("hello");
});

app.get('/login', passport.authenticate('auth0', {
    clientID: data.clientID,
    domain: data.domain,
    redirectUri: data.callbackURL,
    responseType: 'code',
    audience: "https://workpals.auth0.com/userinfo",
    scope: 'openid profile'}),
    function(req, res) {
        res.redirect('/');
    }
)
app.get('/welcome', function(req, res, next){
    res.send("log in correctly");
});
app.listen(3000, function(){
    console.log("server is running in port 3000");
});


