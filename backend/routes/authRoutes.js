const express = require("express");
const { login, register, updatePassword } = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");

const authRouter = express.Router();

authRouter.post("/login",login);
authRouter.post("/register",register);
authRouter.post("/update-password",auth,updatePassword);

module.exports = authRouter;