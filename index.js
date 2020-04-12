const { auth } = require("express-openid-connect");
const { requiresAuth } = require('express-openid-connect');
const express = require("express");
const config = require("./authconfig");
const app = express();

app.use(auth(config));

app.get("/", (req, res) => {
  res.send(req.isAuthenticated() ? "Logged in" : "Logged out");
});
app.get('/profile', requiresAuth(), (req, res) => {
    res.send(JSON.stringify(req.openid.user));
  });

app.get("/logout", (req, res) => {
    req.logout({
        returnTo: "http://localhost:3000",
        client_id: config.clientID
    });
    res.redirect("/");
    });
app.listen(3000, function(){
    console.log("server is running in port 3000");
});


