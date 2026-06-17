const express = require("express");
const auth = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const {
  dashboard,
  addStore,
  getAllStores,
  addUser,
  getUserById,
  getUsers,
} = require("../controllers/adminController");
const AdminRouter = express.Router();

AdminRouter.get("/dashboard", auth, authorize("admin"), dashboard);

AdminRouter.post("/stores", auth, authorize("admin"), addStore);

AdminRouter.get("/users", auth, authorize("admin"),getUsers);

AdminRouter.post("/users", auth, authorize("admin"), addUser);

AdminRouter.get("/stores", auth, authorize("admin"), getAllStores);

AdminRouter.get("/users/:id", auth, authorize("admin"), getUserById);

module.exports = AdminRouter;
