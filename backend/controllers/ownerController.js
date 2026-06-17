const db = require("../config/db");

exports.ownerDashboard = async (req, res) => {
  try {
    const ownerId = req.user.id;

    // Average rating
    const [avgResult] = await db.query(
      `
      SELECT
        ROUND(AVG(r.rating),1) AS averageRating
      FROM ratings r
      JOIN stores s
        ON r.store_id = s.id
      WHERE s.owner_id = ?
      `,
      [ownerId]
    );

    // Users who rated
    const [users] = await db.query(
      `
      SELECT
        u.name,
        u.email,
        r.rating
      FROM ratings r
      JOIN users u
        ON r.user_id = u.id
      JOIN stores s
        ON r.store_id = s.id
      WHERE s.owner_id = ?
      `,
      [ownerId]
    );

    res.json({
      averageRating:
        avgResult[0].averageRating || 0,
      users,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};