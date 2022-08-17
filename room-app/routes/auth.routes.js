const express = require("express");
const router = express.Router();
const User = require("../models/User.model.js");
const bcrypt = require("bcryptjs");
const saltRounds = 10;

//SIGN IN

router.get("/signup", (req, res) => {
  res.render("auth/signup");
});
router.post("/signup", (req, res) => {
  const { fullName, email, password } = req.body;
  console.log("req.body", req.body);

  //Hasing passwork before we create the use
  bcrypt
    .hash(password, saltRounds)
    .then((hashedPassword) => {
      const newUser = new User({ fullName, email, password: hashedPassword }); //creating a new User to update the schema with hashed password
      newUser
        .save() //creating in DB
        .then(res.redirect("/login")) // Redirect for user to login
        .catch((err) => {
          err;
        });
    })
    .catch((err) => console.log(err));
});

//LOGIN

router.get("/login", (req, res) => {
  res.render("auth/login");
});
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  console.log("req.body", req.body);
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.redirect("/login");
      } else if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect("/profile");
      }
    })
    .catch((err) => console.log(err));
});

router.get("/profile", (req, res) => {
  res.render("profile");
});

//LOGOUT

router.post("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

module.exports = router;
