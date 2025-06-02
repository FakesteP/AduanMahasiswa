import * as AduanModel from "../model/aduanModel.js"; // sesuaikan nama model
import User from "../model/userModel.js";

export const getAduan = async (req, res) => {
  try {
    const aduans = await AduanModel.getAllAduan();
    res.json(aduans);
  } catch (error) {
    console.error("Error getAduans:", error);
    res.status(500).json({ message: "Gagal mengambil data aduan" });
  }
};

export const getAduanByID = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Ambil aduan dari PostgreSQL
    const aduan = await AduanModel.getAduanById(id);
    if (!aduan)
      return res.status(404).json({ message: "Aduan tidak ditemukan" });

    // 2. Ambil user dari MySQL berdasarkan aduan.user_id
    const user = await User.findByPk(aduan.user_id);

    // 3. Gabungkan
    const response = {
      ...aduan,
      tanggal_dibuat: aduan.tanggal_dibuat,
      user: user
        ? {
            id: user.id,
            nama: user.nama,
            username: user.username,
          }
        : null,
    };

    res.json(response);
  } catch (error) {
    console.error("Error getAduanById:", error);
    res.status(500).json({ message: "Gagal mengambil data aduan" });
  }
};

export const createNewAduan = async (req, res) => {
  try {
    const userId = req.user.id; // dari middleware JWT
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    // Validasi user ada di DB
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    const { judul, isi, status, kategori } = req.body;
    if (!judul || !isi) {
      return res.status(400).json({ message: "Judul dan isi wajib diisi" });
    }

    const newAduan = await AduanModel.createNewAduan({
      user_id: userId,
      judul,
      isi,
      status: status || "pending",
      kategori: kategori || null,
    });

    res.status(201).json(newAduan);
  } catch (error) {
    console.error("Error createAduan:", error);
    res.status(500).json({ message: "Gagal membuat aduan" });
  }
};

export const updateAduanById = async (req, res) => {
  try {
    const { id } = req.params;
    const { judul, isi, status, kategori } = req.body;

    const aduan = await AduanModel.getAduanById(id);
    if (!aduan)
      return res.status(404).json({ message: "Aduan tidak ditemukan" });

    const updatedAduan = await AduanModel.updateAduanById(id, {
      judul: judul || aduan.judul,
      isi: isi || aduan.isi,
      status: status || aduan.status,
      kategori: kategori || aduan.kategori,
    });

    res.json(updatedAduan);
  } catch (error) {
    console.error("Error updateAduan:", error);
    res.status(500).json({ message: "Gagal memperbarui aduan" });
  }
};

export const deleteAduanById = async (req, res) => {
  try {
    const { id } = req.params;
    const aduan = await AduanModel.getAduanById(id);
    if (!aduan)
      return res.status(404).json({ message: "Aduan tidak ditemukan" });

    await AduanModel.deleteAduan(id);
    res.json({ message: "Aduan berhasil dihapus" });
  } catch (error) {
    console.error("Error deleteAduan:", error);
    res.status(500).json({ message: "Gagal menghapus aduan" });
  }
};
export const getStatsByStatus = async (req, res) => {
  try {
    const userId = req.user.id; // dari middleware auth
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const stats = await AduanModel.countByStatus(userId);
    res.json(stats); // kirim array statistik status
  } catch (error) {
    console.error("Error getStatsByStatus:", error);
    res.status(500).json({ error: "Gagal mengambil statistik aduan." });
  }
};

export const getStatsByStatusAdmin = async (req, res) => {
  try {
    const stats = await AduanModel.countByStatusAll();
    res.json(stats);
  } catch (error) {
    console.error("Error getStatsByStatusAdmin:", error);
    res.status(500).json({ error: "Gagal mengambil statistik aduan." });
  }
};

export const getAduanByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const aduans = await AduanModel.getAduanByUser(userId);
    res.json(aduans);
  } catch (error) {
    console.error("Error getAduanByUser:", error);
    res.status(500).json({ message: "Gagal mengambil data aduan user" });
  }
};
