const express = require("express");
const auth = require("../middleware/authMiddleware");
const { submitRating } = require("../controllers/ratingController");
const { authorize } = require("../middleware/roleMiddleware");
const ratingRouter = express.Router();

ratingRouter.post("/", auth, authorize("user"), submitRating);

module.exports = ratingRouter;