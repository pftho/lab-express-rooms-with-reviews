const express = require("express");
const router = express.Router();
const User = require("../models/User.model.js");
const Room = require("../models/Room.model.js");
const Review = require("../models/Review.model.js");
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard.js");

