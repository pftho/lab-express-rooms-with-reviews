const express = require("express");
const router = express.Router();
const User = require("../models/User.model.js");
const Room = require("../models/Room.model.js");
const { isLoggedIn } = require("../middleware/route-guard.js");

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

// NOT WORKING FOR ITERATION 3
// Can see reviews loogin or loggues out

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
          isCurrentUserOwner:
            currentUser && owner._id.toString() === currentUser._id,
        }); // I had help for this line
      });
    })
    .catch((err) => console.log(err));
});

// Can only comment if not owner and logged
router.get("/rooms/:roomId", isLoggedIn, (req, res, next) => {
  const { roomId } = req.params;
  const { currentUser } = req.session;

  Room.findById(roomId)
    .populate("reviews")
    .then((room) => {
      User.findById(room.owner).then((owner) => {
        res.render("rooms/room", {
          owner,
          room,
          isCurrentUserOwner:
            currentUser && owner._id.toString() === currentUser._id,
        }); // I had help for this line
      });
    })
    .catch((err) => console.log(err));
});

//UPDATE
router.get("/rooms/update/:roomId", (req, res) => {
  const { roomId } = req.params;
  console.log(req.params);
  Room.findById(roomId).then((room) => {
    res.render("rooms/update", { room });
  });
});

router.post("/rooms/update/:roomId", (req, res) => {
  const { roomId } = req.params;
  const { name, imageUrl, description } = req.body;

  Room.findByIdAndUpdate(roomId, { name, imageUrl, description }, { new: true })
    .then(res.redirect(`/rooms/${roomId}`))
    .catch((err) => console.log(err));
});

//DELETE

router.get("/rooms/delete/:roomId", (req, res) => {
  const { roomId } = req.params;
  Room.findByIdAndDelete(roomId)
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => console.log(err));
});

module.exports = router;
