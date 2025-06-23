import Aduan from "../model/aduanModel.js";
import User from "../model/userModel.js";
import sequelizePg from "../config/postgresql.js";

export const getAduan = async (req, res) => {
  try {
    const aduans = await Aduan.findAll({ order: [["tanggal_dibuat", "DESC"]] });
    res.json(aduans);
  } catch (error) {
    console.error("Error getAduans:", error);
    res.status(500).json({ message: "Gagal mengambil data aduan" });
  }
};

export const getAduanByID = async (req, res) => {
  try {
    const { id } = req.params;
    const aduan = await Aduan.findByPk(id);
    if (!aduan)
      return res.status(404).json({ message: "Aduan tidak ditemukan" });
    const user = await User.findByPk(aduan.user_id);
    const response = {
      ...aduan.dataValues,
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
    const userId = req.user.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });
    const { judul, isi, status, kategori } = req.body;
    if (!judul || !isi) {
      return res.status(400).json({ message: "Judul dan isi wajib diisi" });
    }

    // Ambil file lampiran dari multer (jika ada)
    const lampiran = req.file ? req.file.buffer : null;
    const lampiran_nama = req.file ? req.file.originalname : null;
    const lampiran_type = req.file ? req.file.mimetype : null;

    const newAduan = await Aduan.create({
      user_id: userId,
      judul,
      isi,
      status: status || "pending",
      kategori: kategori || null,
      tanggal_dibuat: new Date(),
      tanggal_diperbarui: new Date(),
      lampiran: lampiran,
      lampiran_nama: lampiran_nama,
      lampiran_type: lampiran_type,
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
    const aduan = await Aduan.findByPk(id);
    if (!aduan)
      return res.status(404).json({ message: "Aduan tidak ditemukan" });

    // Ambil file lampiran dari multer (jika ada update)
    const lampiran = req.file ? req.file.buffer : aduan.lampiran;
    const lampiran_nama = req.file ? req.file.originalname : aduan.lampiran_nama;
    const lampiran_type = req.file ? req.file.mimetype : aduan.lampiran_type;

    await aduan.update({
      judul: judul || aduan.judul,
      isi: isi || aduan.isi,
      status: status || aduan.status,
      kategori: kategori || aduan.kategori,
      tanggal_diperbarui: new Date(),
      lampiran: lampiran,
      lampiran_nama: lampiran_nama,
      lampiran_type: lampiran_type,
    });
    res.json(aduan);
  } catch (error) {
    console.error("Error updateAduan:", error);
    res.status(500).json({ message: "Gagal memperbarui aduan" });
  }
};

export const deleteAduanById = async (req, res) => {
  try {
    const { id } = req.params;
    const aduan = await Aduan.findByPk(id);
    if (!aduan)
      return res.status(404).json({ message: "Aduan tidak ditemukan" });
    await aduan.destroy();
    res.json({ message: "Aduan berhasil dihapus" });
  } catch (error) {
    console.error("Error deleteAduan:", error);
    res.status(500).json({ message: "Gagal menghapus aduan" });
  }
};

export const getStatsByStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const stats = await Aduan.findAll({
      attributes: [
        "status",
        [sequelizePg.fn("COUNT", sequelizePg.col("status")), "count"],
      ],
      where: { user_id: userId },
      group: ["status"],
      raw: true,
    });
    res.json(stats);
  } catch (error) {
    console.error("Error getStatsByStatus:", error);
    res.status(500).json({ error: "Gagal mengambil statistik aduan." });
  }
};

export const getStatsByStatusAdmin = async (req, res) => {
  try {
    const stats = await Aduan.findAll({
      attributes: [
        "status",
        [sequelizePg.fn("COUNT", sequelizePg.col("status")), "count"],
      ],
      group: ["status"],
      raw: true,
    });
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
    const aduans = await Aduan.findAll({
      where: { user_id: userId },
      order: [["tanggal_dibuat", "DESC"]],
    });
    res.json(aduans);
  } catch (error) {
    console.error("Error getAduanByUser:", error);
    res.status(500).json({ message: "Gagal mengambil data aduan user" });
  }
};

// Endpoint untuk download lampiran
export const downloadLampiran = async (req, res) => {
  try {
    const { id } = req.params;
    const aduan = await Aduan.findByPk(id);

    if (!aduan) {
      return res.status(404).json({ message: "Aduan tidak ditemukan" });
    }

    if (!aduan.lampiran) {
      return res.status(404).json({ message: "Lampiran tidak ditemukan" });
    }

    const filename = aduan.lampiran_nama || `lampiran-${id}`;
    const filetype = aduan.lampiran_type || "application/octet-stream";
    res.setHeader("Content-Type", filetype);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(filename)}"`
    );
    res.send(aduan.lampiran);
  } catch (error) {
    console.error("Error downloadLampiran:", error);
    res.status(500).json({ message: "Gagal download lampiran" });
  }
};
