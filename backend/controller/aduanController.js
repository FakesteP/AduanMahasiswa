import * as AduanModel from "../model/aduanModel.js";
import User from "../model/userModel.js"; // buat validasi user

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
    const aduan = await AduanModel.getAduanByID(id);
    if (!aduan) return res.status(404).json({ message: "Aduan tidak ditemukan" });
    res.json(aduan);
  } catch (error) {
    console.error("Error getAduanById:", error);
    res.status(500).json({ message: "Gagal mengambil data aduan" });
  }
};

export const createNewAduan = async (req, res) => {
  try {
    const userId = req.session.userId; // asumsi session sudah ter-set
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    // Validasi user ada di DB
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    const { judul, isi, status } = req.body;
    if (!judul || !isi) {
      return res.status(400).json({ message: "Judul dan isi wajib diisi" });
    }

    const newAduan = await AduanModel.createNewAduan({
      user_id: userId,
      judul,
      isi,
      status: status || "pending",
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
    const { judul, isi, status } = req.body;

    const aduan = await AduanModel.getAduanById(id);
    if (!aduan) return res.status(404).json({ message: "Aduan tidak ditemukan" });

    const updatedAduan = await AduanModel.updateAduanById(id, {
      judul: judul || aduan.judul,
      isi: isi || aduan.isi,
      status: status || aduan.status,
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
    if (!aduan) return res.status(404).json({ message: "Aduan tidak ditemukan" });

    await AduanModel.deleteAduan(id);
    res.json({ message: "Aduan berhasil dihapus" });
  } catch (error) {
    console.error("Error deleteAduan:", error);
    res.status(500).json({ message: "Gagal menghapus aduan" });
  }
};
