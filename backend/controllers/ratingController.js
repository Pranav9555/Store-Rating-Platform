const db = require("../config/db");

//submit rating API
exports.submitRating = async (req, res) => {
  try {
    const { store_id, rating } = req.body;

    await db.query(
      `
      INSERT INTO ratings
      (user_id,store_id,rating)
      VALUES(?,?,?)
      ON DUPLICATE KEY UPDATE
      rating=VALUES(rating)
      `,
      [req.user.id, store_id, rating]
    );

    res.json({
      message: "Rating Submitted",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};