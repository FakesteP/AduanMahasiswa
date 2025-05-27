// controllers/authController.js
import User from "../model/userModel.js";
import bcrypt from "bcrypt";

export const login = async (req, res) => {
  const { nim, password } = req.body;

  const user = await User.findOne({ where: { nim } });
  if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: "Password salah" });

  req.session.userId = user.id;
  res
    .status(200)
    .json({
      message: "Login berhasil",
      user: { id: user.id, nama: user.nama, role: user.role },
    });
};

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: "Gagal logout" });
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Logout berhasil" });
  });
};
