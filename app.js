const { auth } = require("express-openid-connect");
const { requiresAuth } = require('express-openid-connect');
const express = require("express");
const config = require("./authconfig");
const app = express();
const createChannel = require("./createChannel");
var bodyParser = require('body-parser')
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
  name:  String, 
  lastName: String,
  email:   String,
  languaje: String,
  cellPhone: Number,
  sex: String,
  likes: [String],
});

let groupSchema = new Schema({
    channelId: String,
    userOne: String,
    userTwo: String,
    userThree: String,
  });
let userData = mongoose.model('userData', userSchema);
let GroupData = mongoose.model('groupData', groupSchema);

mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb+srv://workpals:'+ process.env.MONGOPASSWORD +'@cluster0-8n9mw.mongodb.net/workpals?retryWrites=true&w=majority', 
{useNewUrlParser: true});

app.use(auth(config));
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send('index');
});
app.get('/profile', requiresAuth(), (req, res) => {
    res.send(JSON.stringify(req.openid.user));
  });
app.get("/logout", (req, res) => {
    req.logout({
        returnTo: "http://www.workpals.co/",
        client_id: config.clientID
    });
    res.redirect("/");
    });


app.post("/create", (req, res) => {
    let data = {
         name: req.openid.user.given_name,
         lastName: req.openid.user.familily_name,
         email: req.openid.user.email,
         languaje: req.body.languaje,
         cellPhone: req.body.cellPhone,
         sex: req.body.sex,
         likes: req.body.likes,
    }
    let user = userData(data);
    user.save();
    res.send("works!")
});
app.listen(app.get('port'), function() {
    console.log("server is running in port 3000");
});