const db = require("../config/db");

//submit rating API
exports.submitRating = async (req, res) => {
  const { storeId, rating } = req.body;

  await db.promise().query(
    `
    INSERT INTO ratings
    (user_id,store_id,rating)
    VALUES(?,?,?)
    ON DUPLICATE KEY UPDATE
    rating=VALUES(rating)
    `,
    [req.user.id, storeId, rating]
  );

  res.json({
    message: "Rating Submitted",
  });
};
