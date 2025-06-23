// models/aduanMahasiswaModel.js
import sequelizePg from "../config/postgresql.js";
import { DataTypes } from "sequelize";

// Definisikan model aduan_mahasiswa
const Aduan = sequelizePg.define(
  "aduan_mahasiswa",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: DataTypes.INTEGER,
    judul: DataTypes.STRING,
    isi: DataTypes.TEXT,
    status: DataTypes.STRING,
    tanggal_dibuat: DataTypes.DATE,
    tanggal_diperbarui: DataTypes.DATE,
    kategori: DataTypes.STRING,
    lampiran: DataTypes.BLOB, // untuk menyimpan file PDF/gambar
  },
  {
    tableName: "aduan_mahasiswa",
    timestamps: false,
  }
);

// Sinkronisasi otomatis model ke database (hanya untuk development, bukan production)
Aduan.sync();

export default Aduan;
