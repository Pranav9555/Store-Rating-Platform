const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
require("./config/testConnection");
const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 5000;

app.listen(PORT,(req,res) => {
  console.log(`app Listening on port ${PORT}`);
})