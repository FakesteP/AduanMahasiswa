import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Base_Url } from "../utils/utils";

function ComplaintForm({ token, onSuccess }) {
  const navigate = useNavigate();

  const [kategori, setKategori] = useState("");
  const [judul, setJudul] = useState("");
  const [isi, setIsi] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const kategoriList = [
    "Akademik",
    "Fasilitas dan Infrastruktur",
    "Keuangan",
    "Pelayanan Administrasi",
    "Kesehatan dan Kesejahteraan",
    "Etika dan Perilaku",
    "Organisasi Kemahasiswaan dan Kegiatan Kampus",
    "Layanan Teknologi dan Informasi",
    "Layanan Karir dan Alumni",
    "Lain-lain",
  ];

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${Base_Url}/aduan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          judul,
          isi,
          kategori,
          status: "proses",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal mengirim aduan");

      setMessage("✅ Aduan berhasil dikirim!");
      setJudul("");
      setIsi("");
      setKategori("");
      if (onSuccess) onSuccess();
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-12 bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Tombol kembali */}
      <button
        onClick={() => navigate(-1)}
        className="mb-8 inline-flex items-center gap-2 text-blue-600 text-base font-semibold hover:underline transition"
      >
        ← Kembali
      </button>

      <h2 className="text-4xl font-extrabold mb-12 text-center text-gray-800 tracking-wide">
        Form Pengaduan
      </h2>

      {message && (
        <p
          className={`mb-10 text-center text-xl font-semibold ${
            message.includes("berhasil") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}

      {!kategori ? (
        <>
          <p className="mb-8 text-2xl font-semibold text-gray-700 text-center">
            Pilih Kategori Aduan
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {kategoriList.map((kat) => (
              <button
                key={kat}
                type="button"
                onClick={() => setKategori(kat)}
                className="rounded-lg border border-gray-300 px-6 py-4 text-gray-700 font-medium
                  bg-gray-50 hover:bg-blue-100 transition focus:outline-none focus:ring-4 focus:ring-blue-400"
              >
                {kat}
              </button>
            ))}
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          <p className="text-gray-700 text-2xl text-center">
            <span className="font-semibold">Kategori yang dipilih:</span>{" "}
            <span className="italic text-blue-600">{kategori}</span>
          </p>

          <input
            type="text"
            placeholder="Judul Aduan"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-6 py-4
              focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-transparent
              placeholder-gray-400 transition text-gray-800 font-semibold text-lg"
            required
          />

          <textarea
            placeholder="Deskripsi Aduan"
            value={isi}
            onChange={(e) => setIsi(e.target.value)}
            rows={8}
            className="w-full border border-gray-300 rounded-lg px-6 py-4
              focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-transparent
              placeholder-gray-400 transition resize-none text-gray-800 font-semibold text-lg"
            required
          />

          <button
            type="button"
            onClick={() => setKategori("")}
            className="text-lg text-blue-600 hover:underline font-semibold"
          >
            ← Ubah Kategori
          </button>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-5 rounded-lg font-bold
              hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? "Mengirim..." : "Kirim Aduan"}
          </button>
        </form>
      )}
    </div>
  );
}

export default ComplaintForm;
