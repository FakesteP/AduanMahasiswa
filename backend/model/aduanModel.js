// models/aduanMahasiswaModel.js
import pgPool from "../config/postgresql.js";

// Ambil semua aduan
export const getAllAduan = async () => {
  const result = await pgPool.query(
    "SELECT * FROM aduan_mahasiswa ORDER BY tanggal_dibuat DESC"
  );
  return result.rows;
};

// Ambil aduan berdasarkan ID
export const getAduanById = async (id) => {
  const result = await pgPool.query(
    "SELECT * FROM aduan_mahasiswa WHERE id = $1",
    [id]
  );
  return result.rows[0];
};

// Buat aduan baru
export const createNewAduan = async ({ user_id, judul, isi, status }) => {
  const result = await pgPool.query(
    `INSERT INTO aduan_mahasiswa (user_id, judul, isi, status, tanggal_dibuat, tanggal_diperbarui)
     VALUES ($1, $2, $3, $4, NOW(), NOW())
     RETURNING *`,
    [user_id, judul, isi, status]
  );
  return result.rows[0];
};

// Update aduan berdasarkan ID
export const updateAduanById = async (id, { judul, isi, status }) => {
  const result = await pgPool.query(
    `UPDATE aduan_mahasiswa
     SET judul = $1,
         isi = $2,
         status = $3,
         tanggal_diperbarui = NOW()
     WHERE id = $4
     RETURNING *`,
    [judul, isi, status, id]
  );
  return result.rows[0];
};

// Hapus aduan berdasarkan ID
export const deleteAduan = async (id) => {
  const result = await pgPool.query(
    "DELETE FROM aduan_mahasiswa WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
};
