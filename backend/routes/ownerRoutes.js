const express = require("express");
const auth = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const { ownerDashboard } = require("../controllers/ownerController");
const OwnerRouter = express.Router();
OwnerRouter.get("/dashboard", auth, authorize("owner"), ownerDashboard);

module.exports = OwnerRouter;
