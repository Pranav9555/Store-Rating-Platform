const db = require("../config/db");

//store listing API
exports.getStores = async (req, res) => {
  try {
    const userId = req.user.id; // logged-in user

    const [stores] = await db.query(
      `
      SELECT 
        s.id,
        s.name,
        s.address,

        -- overall rating
        (
          SELECT ROUND(AVG(r.rating),1)
          FROM ratings r
          WHERE r.store_id = s.id
        ) AS overallRating,

        -- THIS USER'S rating
        (
          SELECT r.rating
          FROM ratings r
          WHERE r.store_id = s.id
          AND r.user_id = ?
        ) AS userRating

      FROM stores s
      `,
      [userId]
    );

    res.json(stores);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};