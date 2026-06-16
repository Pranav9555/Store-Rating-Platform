const express = require("express");
const auth = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const { dashboard, addStore, getUsers, getAllStores } = require("../controllers/adminController");
const AdminRouter = express.Router();

AdminRouter.get("/dashboard", auth, authorize("admin"), dashboard);

AdminRouter.post("/stores", auth, authorize("admin"), addStore);

AdminRouter.get("/users", auth, authorize("admin"), getUsers);

AdminRouter.get("/stores", auth, authorize("admin"), getAllStores);

module.exports = AdminRouter;
