const db = require("../config/db");

//owner dashboard API
exports.ownerDashboard = async (req, res) => {
  const ownerId = req.user.id;

  const [data] = await db.promise().query(
    `
    SELECT
      u.name,
      u.email,
      r.rating
    FROM ratings r
    JOIN users u
      ON r.user_id=u.id
    JOIN stores s
      ON r.store_id=s.id
    WHERE s.owner_id=?
    `,
    [ownerId]
  );

  console.log(req.user);
  res.json(data);
};