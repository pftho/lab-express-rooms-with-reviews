const express = require("express");
const router = express.Router();
const User = require("../models/User.model.js");
const Room = require("../models/Room.model.js");
const { isLoggedIn } = require("../../middleware/route-guard.js");
const { $where } = require("../models/User.model.js");

//CREATE

router.get("/create", isLoggedIn, (req, res) => {
  res.render("rooms/create");
});
router.post("/create", isLoggedIn, (req, res) => {
  const { currentUser } = req.session;
  const { name, imageUrl, description } = req.body;
  Room.create({ owner: currentUser, name, imageUrl, description }).then(
    (newRoom) => {
      res.redirect(`/rooms/${newRoom._id}`);
    }
  );
});

router.get("/rooms/:roomId", (req, res) => {
  const { roomId } = req.params;
  const { currentUser } = req.session;

  Room.findById(roomId)
    .then((room) => {
      User.findById(room.owner).then((owner) => {
        console.log("currentUser", currentUser);
        console.log("owner", owner);
        res.render("rooms/room", {
          owner,
          room,
          isCurrentUserOwner: owner._id.toString() === currentUser._id,
        });
      });
    })
    .catch((err) => console.log(err));
});

//UPDATE

//DELETE

module.exports = router;
