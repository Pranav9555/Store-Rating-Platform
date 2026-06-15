const db = require("./db");

db.getConnection((err, connection) => {
  if (err) {
    console.log("Database Error:", err);
  } else {
    console.log("MySQL Connected Successfully");
    connection.release();
  }
});