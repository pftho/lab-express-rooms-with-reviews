const router = require("express").Router();
const Room = require("../models/Room.model.js");
const User = require("../models/User.model.js");
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard.js");

/* GET home page */
router.get("/", (req, res, next) => {
  Room.find().then((rooms) => {
    console.log(rooms);
    res.render("index", { rooms });
  });
});

module.exports = router;
