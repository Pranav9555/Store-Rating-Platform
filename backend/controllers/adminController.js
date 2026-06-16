const db = require("../config/db");

exports.dashboard = async (req, res) => {
  try {
    const [[users]] = await db.promise().query(
      "SELECT COUNT(*) AS totalUsers FROM users"
    );

    const [[stores]] = await db.promise().query(
      "SELECT COUNT(*) AS totalStores FROM stores"
    );

    const [[ratings]] = await db.promise().query(
      "SELECT COUNT(*) AS totalRatings FROM ratings"
    );

    res.json({
      totalUsers: users.totalUsers,
      totalStores: stores.totalStores,
      totalRatings: ratings.totalRatings,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

//create store API
exports.addStore = async (req, res) => {
  const {
    name,
    email,
    address,
    owner_id,
  } = req.body;

  await db.promise().query(
    `INSERT INTO stores
    (name,email,address,owner_id)
    VALUES(?,?,?,?)`,
    [name, email, address, owner_id]
  );

  res.json({
    message: "Store Added",
  });
};

exports.getUsers = async (req, res) => {
  try {
    const [users] = await db.promise().query(`
      SELECT
        id,
        name,
        email,
        address,
        role,
        created_at
      FROM users
      ORDER BY created_at DESC
    `);

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllStores = async (req, res) => {
  try {
    const [stores] = await db.promise().query(`
      SELECT
        s.id,
        s.name,
        s.email,
        s.address,
        ROUND(AVG(r.rating),1) AS averageRating

      FROM stores s

      LEFT JOIN ratings r
      ON s.id = r.store_id

      GROUP BY s.id
      ORDER BY s.created_at DESC
    `);

    res.status(200).json({
      success: true,
      stores,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};