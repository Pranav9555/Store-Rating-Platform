const db = require("./db");

const testConnection = async () => {
  try {
    const connection = await db.getConnection();

    console.log("✅ MySQL Connected Successfully");

    connection.release();
  } catch (error) {
    console.error("❌ MySQL Connection Failed");
    console.error(error.message);
  }
};

testConnection();