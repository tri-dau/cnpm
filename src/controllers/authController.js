const User = require("../models/User");

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.create({ username, email, password });
    res.status(201).json({
      message: "Đăng ký thành công",
      userId: user.userid,
    });
  } catch (error) {
    console.error("Registration error:", error);
    if (error.name === "SequelizeUniqueConstraintError") {
      res.status(400).json({ error: "Email hoặc tên người dùng đã tồn tại" });
    } else {
      res.status(500).json({ error: "Lỗi server" });
    }
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });

    if (!user || password !== user.password) {
      return res
        .status(401)
        .json({ error: "Tên đăng nhập hoặc mật khẩu không đúng" });
    }

    res.json({
      message: "Đăng nhập thành công",
      user: {
        id: user.userid,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
};

module.exports = {
  register,
  login,
};
