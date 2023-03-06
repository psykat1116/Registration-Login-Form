//Requireing the packages
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const validator = require("validator");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const hbs = require("hbs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Register = require(__dirname + "/schema");
const app = express();
const auth = require(__dirname + "/auth");

//Set the port so that it can work anywhere
const port = process.env.PORT || 3000;

//Connecting with mongodb server
mongoose
  .connect("mongodb://localhost:27017/RegistrationDB")
  .then(() => {
    console.log("Connection Successful with mongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

let msg = "",
  msg1 = "";

let user, token;

//To work with static files and template engine handlebars.js
app.use(express.static("public"));
app.set("view engine", "hbs");
app.use(express.urlencoded({ extended: false }));
hbs.registerPartials("views");
app.use(cookieParser());

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/secret", auth, (req, res) => {
  res.render("secret");
});

app.get("/registration", (req, res) => {
  msg1 = "";
  res.render("Register", { errormsg: msg });
});

app.get("/login", (req, res) => {
  msg = "";
  res.render("login", { errormsg: msg1 });
});

app.get("/logout", auth, async (req, res) => {
  try {
    token = req.token;
    user = req.token;
    res.render("logout");
  } catch (error) {
    res.send(error);
  }
});

app.post("/logout", auth, async (req, res) => {
  if (await bcrypt.compare(req.body.password, req.user.password)) {
    //For single logout
    // req.user.tokens = req.user.tokens.filter((ele) => {
    //   return (ele = req.token);
    // });

    // For logout from all devices
    req.user.tokens=[];

    res.clearCookie("jwt");
    await req.user.save();
    res.redirect("/");
  } else {
    res.send(error);
  }
});

app.post("/registration", async (req, res) => {
  try {
    const pass = req.body.password;
    const cpass = req.body.cpassword;
    if (pass !== cpass) {
      msg = "**Password and Confirm Password Doesn't Match";
      return res.redirect("/registration");
    } else {
      msg = "";
      const newData = new Register({
        firstName: req.body.fname,
        lastName: req.body.lname,
        email: req.body.email,
        sex: req.body.gender,
        mobile: req.body.mobile,
        age: req.body.age,
        password: pass,
        confirmPassword: cpass,
      });

      //Storing the JWT token value after generating as a middleware
      const token = await newData.generateAuthToken();

      //generating coockies in the time of registration
      res.cookie("jwt", token, {
        expires: new Date(Date.now() + 10000),
        httpOnly: true,
      });

      await newData.save();
      res.status(200).render("created");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    pass = req.body.password;
    const getData = await Register.findOne({ email });

    //Storing the JWT token value after generating as a middleware
    const token = await getData.generateAuthToken();

    //generating cookies in time of login
    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 120000),
      httpOnly: true,
    });

    //Using bcrypt compare mathod to check that the password is matched or not
    if (await bcrypt.compare(pass, getData.password)) {
      msg1 = "";
      res.status(200).render("success");
    } else {
      msg1 = "**Invalid Login Details";
      res.status(400).redirect("/login");
    }
  } catch (error) {
    res.send(error);
  }
});

app.get("*", (req, res) => {
  res.render("error");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
