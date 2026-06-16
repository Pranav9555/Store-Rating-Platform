const express = require("express");
const auth = require("../middleware/authMiddleware");
const { getStores } = require("../controllers/storeController");
const storeRouter = express.Router();

storeRouter.get("/", auth, getStores);

module.exports = storeRouter;