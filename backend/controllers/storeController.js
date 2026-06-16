const db = require("../config/db");

//store listing API
exports.getStores = async (req, res) => {
  const [stores] = await db.promise().query(`
    SELECT
      s.id,
      s.name,
      s.address,
      ROUND(AVG(r.rating),1) AS rating
    FROM stores s
    LEFT JOIN ratings r
      ON s.id = r.store_id
    GROUP BY s.id
  `);

  res.json(stores);
};