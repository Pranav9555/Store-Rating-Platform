const mysql = require("mysql2");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Pranav@123", 
  database: "store_rate",
});

module.exports = db;