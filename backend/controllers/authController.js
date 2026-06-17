const bcrypt = require("bcryptjs");
const db = require("../config/db");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
const { name, email, password, address } = req.body;

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

    const [user] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (user.length > 0) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO users(name,email,password,address,role)
       VALUES(?,?,?,?,?)`,
      [name, email, hashedPassword, address, "user"],
    );

    res.status(201).json({
      message: "User Registered Successfully",
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [user] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (user.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user[0].password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user[0].id,
        role: user[0].role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    res.json({
      token,
      user: {
        id: user[0].id,
        name: user[0].name,
        role: user[0].role,
      },
    });
  } catch (error) {
    res.status(500).json(error);
  }
};



exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const userId = req.user.id;

    const [users] = await db.query(
      "SELECT * FROM users WHERE id = ?",
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    const passwordRegex =/^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;

if (!passwordRegex.test(newPassword)) {
  return res.status(400).json({
    message:
      "Password must be 8-16 characters and contain one uppercase letter and one special character",
  });
}

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    await db.query(
      "UPDATE users SET password = ? WHERE id = ?",
      [hashedPassword, userId]
    );

    res.json({
      message: "Password updated successfully",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};
