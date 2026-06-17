const bcrypt  =require("bcryptjs");

const db = require("../config/db");

exports.dashboard = async (req, res) => {
  try {
    const [[users]] = await db.query(
      "SELECT COUNT(*) AS totalUsers FROM users"
    );

    const [[stores]] = await db.query(
      "SELECT COUNT(*) AS totalStores FROM stores"
    );

    const [[ratings]] = await db.query(
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





// Email Validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(email)) {
  return res.status(400).json({
    message: "Invalid email format",
  });
}

const [existingStore] = await db.query(
  "SELECT id FROM stores WHERE email = ?",
  [email]
);

if (existingStore.length > 0) {
  return res.status(400).json({
    message: "Store email already exists",
  });
}


  await db.query(
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
    const {
      name,
      email,
      address,
      role,
      sort,
      order,
    } = req.query;

    let query = `
      SELECT
      id,
      name,
      email,
      address,
      role
      FROM users
      WHERE 1=1
    `;

    if (name) {
      query += ` AND name LIKE '%${name}%'`;
    }

    if (email) {
      query += ` AND email LIKE '%${email}%'`;
    }

    if (address) {
      query += ` AND address LIKE '%${address}%'`;
    }

    if (role) {
      query += ` AND role='${role}'`;
    }

    if (sort) {
      query += ` ORDER BY ${sort} ${order || "ASC"}`;
    }

    const [users] = await db.query(query);

    res.json({ users });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getAllStores = async (req, res) => {
  try {
    const {
      name,
      address,
      sort,
      order,
    } = req.query;

    let query = `
      SELECT
      s.id,
      s.name,
      s.email,
      s.address,
      AVG(r.rating) AS averageRating
      FROM stores s
      LEFT JOIN ratings r
      ON s.id = r.store_id
      WHERE 1=1
    `;

    if (name) {
      query += ` AND s.name LIKE '%${name}%'`;
    }

    if (address) {
      query += ` AND s.address LIKE '%${address}%'`;
    }

    query += `
      GROUP BY
      s.id,
      s.name,
      s.email,
      s.address
    `;

    if (sort) {
      query += ` ORDER BY ${sort} ${order || "ASC"}`;
    }

    const [stores] = await db.query(query);

    res.json({ stores });
  } catch (error) {
    res.status(500).json(error);
  }
};



 exports.addUser = async (req, res) => {
  try {
const { name, email, password, address,role } = req.body;

// Name Validation
if (name.length < 20 || name.length > 60) {
  return res.status(400).json({
    message: "Name must be between 20 and 60 characters",
  });
}

// Address Validation
if (address.length > 400) {
  return res.status(400).json({
    message: "Address cannot exceed 400 characters",
  });
}

// Email Validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(email)) {
  return res.status(400).json({
    message: "Invalid email format",
  });
}

// Password Validation
const passwordRegex =
  /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;

if (!passwordRegex.test(password)) {
  return res.status(400).json({
    message:
      "Password must be 8-16 characters, contain at least one uppercase letter and one special character",
  });
}

const [existingUser] = await db.query(
  "SELECT id FROM users WHERE email = ?",
  [email]
);

if (existingUser.length > 0) {
  return res.status(400).json({
    message: "Email already exists",
  });
}

    const hashedPassword =
      await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO users
      (name,email,password,address,role)
      VALUES(?,?,?,?,?)`,
      [
        name,
        email,
        hashedPassword,
        address,
        role
      ]
    );

    res.status(201).json({
      message: "User Created Successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const [user] = await db.query(
      `
      SELECT
      u.id,
      u.name,
      u.email,
      u.address,
      u.role,
      AVG(r.rating) AS rating
      FROM users u
      LEFT JOIN stores s
      ON s.owner_id = u.id
      LEFT JOIN ratings r
      ON r.store_id = s.id
      WHERE u.id = ?
      GROUP BY u.id
      `,
      [id]
    );

    res.json(user[0]);
  } catch (error) {
    res.status(500).json(error);
  }
};