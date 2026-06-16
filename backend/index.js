const express = require("express");
require("dotenv").config();
const cors = require("cors");
const authRouter = require("./routes/authRoutes");
const AdminRouter = require("./routes/adminRoutes");
const ratingRouter = require("./routes/ratingRoutes");
const OwnerRouter = require("./routes/ownerRoutes");
const storeRouter = require("./routes/storeRoutes");

require("./config/testConnection");
const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 5000;

//Routes
app.use("/api/auth",authRouter);
app.use("/api/admin",AdminRouter);
app.use("/api/ratings",ratingRouter);
app.use("/api/owner",OwnerRouter);
app.use("/api/stores",storeRouter);

app.listen(PORT,(req,res) => {
  console.log(`app Listening on port ${PORT}`);
})